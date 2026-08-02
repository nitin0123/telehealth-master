// Live results over server-sent events.
//
// Vercel caps how long a serverless function may run, so a stream cannot stay
// open indefinitely. This one sends the current standing, then re-checks every
// couple of seconds and pushes only when something changed, and closes itself
// well inside the cap. EventSource reconnects on its own, so the page keeps
// updating across those handovers: near-instant in practice, at the cost of a
// reconnect every minute or so.
//
// Behind the same password as the results page: without that check the tallies
// would be readable by anyone who guessed the URL, making the gate decorative.
export const prerender = false;

import type { APIRoute } from 'astro';
import { hasResultsAccess, RESULTS_COOKIE, tally } from '../../lib/poll';

/** Well inside Vercel's limit, leaving room for the final close to flush. */
const STREAM_MS = 50_000;
const POLL_MS = 2_000;

export const GET: APIRoute = async ({ url, cookies }) => {
  if (!hasResultsAccess(cookies.get(RESULTS_COOKIE)?.value)) {
    return new Response('Unauthorised', { status: 401 });
  }

  const runId = Number(url.searchParams.get('run'));
  if (!Number.isInteger(runId) || runId <= 0) return new Response('Missing run', { status: 400 });

  const encoder = new TextEncoder();
  let timer: ReturnType<typeof setInterval> | undefined;
  let closer: ReturnType<typeof setTimeout> | undefined;

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      let last = '';

      const send = (event: string, data: unknown) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      const finish = () => {
        if (closed) return;
        closed = true;
        clearInterval(timer);
        clearTimeout(closer);
        // Tell the page this is a planned handover, not a failure, so it can
        // reconnect quietly rather than showing an error.
        try {
          controller.enqueue(encoder.encode('event: bye\ndata: {}\n\n'));
          controller.close();
        } catch {
          // Already torn down by the client disconnecting.
        }
      };

      const push = async () => {
        try {
          const current = await tally(runId);
          if (!current) return finish();
          const serialised = JSON.stringify(current);
          if (serialised === last) return;
          last = serialised;
          send('results', current);
        } catch {
          // A transient database error should not kill the stream: the next
          // tick will try again, and the client still has the last good data.
        }
      };

      await push();
      timer = setInterval(push, POLL_MS);
      closer = setTimeout(finish, STREAM_MS);
    },
    cancel() {
      clearInterval(timer);
      clearTimeout(closer);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      // Vercel's edge buffering would hold events back until the stream ended,
      // which would defeat the point of streaming them.
      'X-Accel-Buffering': 'no',
    },
  });
};
