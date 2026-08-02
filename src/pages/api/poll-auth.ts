// Password gate for the results page. No accounts: one shared password, held
// in POLL_RESULTS_PASSWORD, exchanged for a cookie.
export const prerender = false;

import type { APIRoute } from 'astro';
import { issueResultsToken, passwordMatches, RESULTS_COOKIE } from '../../lib/poll';
import { rateLimited } from '../../lib/rateLimit';
import { readBody, redirect } from '../../lib/formBody';

export const POST: APIRoute = async ({ request, clientAddress, cookies, url }) => {
  const parsed = await readBody(request);
  if (!parsed) return redirect('/poll/results/?error=1');

  // A password form is exactly what gets brute forced, so the limiter is not
  // optional here the way it is on a contact form.
  if (await rateLimited(clientAddress, 'poll-auth')) {
    return redirect('/poll/results/?error=rate');
  }

  const submitted = typeof parsed.data.password === 'string' ? parsed.data.password : '';
  if (!passwordMatches(submitted)) return redirect('/poll/results/?error=1');

  cookies.set(RESULTS_COOKIE, issueResultsToken(), {
    path: '/',
    // A working day. Long enough to watch a poll through, short enough that a
    // borrowed laptop does not stay authorised indefinitely.
    maxAge: 60 * 60 * 12,
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  });

  const poll = url.searchParams.get('poll');
  return redirect(poll ? `/poll/results/?poll=${encodeURIComponent(poll)}` : '/poll/results/');
};
