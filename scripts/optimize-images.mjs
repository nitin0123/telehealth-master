// Generate responsive/next-gen variants for everything under public/, plus a
// dimensions manifest the <Picture> component reads so width and height are
// emitted automatically (which is what stops layout shift).
//
//   npm run images
//
// For each source JPEG/PNG it writes, next to the original:
//   <name>.webp          same size, WebP        (all images)
//   <name>-480.webp      480px wide, WebP       (only if the source is wider)
//   <name>-480.<ext>     480px wide, original format, as the <img> fallback
//
// Originals are never modified or deleted: they stay the fallback for clients
// without WebP support. Re-running is cheap, unchanged outputs are skipped.
import sharp from 'sharp';
import { readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC = fileURLToPath(new URL('../public', import.meta.url));
const MANIFEST = fileURLToPath(new URL('../src/data/imageMeta.json', import.meta.url));

/** Images that are decorative chrome rather than content; left alone. */
const SKIP = [/favicon/, /logo\.png$/, /og-default/];

const SMALL_WIDTH = 480;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (['.jpg', '.jpeg', '.png', '.webp'].includes(extname(p).toLowerCase())) out.push(p);
  }
  return out;
}

const sources = walk(PUBLIC).filter(
  (f) => !/-480\.[a-z]+$/i.test(f) && !SKIP.some((re) => re.test(f))
);

const manifest = {};
let written = 0;
let skipped = 0;

for (const file of sources) {
  const ext = extname(file);
  const base = file.slice(0, -ext.length);
  const url = '/' + relative(PUBLIC, file).split(/[\\/]/).join('/');
  const meta = await sharp(file).metadata();
  manifest[url] = { w: meta.width, h: meta.height };

  // A source that is already WebP only needs its dimensions recording.
  const jobs = ext.toLowerCase() === '.webp' ? [] : [[`${base}.webp`, (img) => img.webp({ quality: 78 })]];
  if (meta.width > SMALL_WIDTH && ext.toLowerCase() !== '.webp') {
    jobs.push([`${base}-${SMALL_WIDTH}.webp`, (img) => img.resize(SMALL_WIDTH).webp({ quality: 74 })]);
    jobs.push([`${base}-${SMALL_WIDTH}${ext}`, (img) => img.resize(SMALL_WIDTH).jpeg({ quality: 76, mozjpeg: true })]);
  }

  for (const [out, transform] of jobs) {
    if (existsSync(out)) { skipped++; continue; }
    await transform(sharp(file)).toFile(out);
    written++;
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`${sources.length} sources | ${written} variants written, ${skipped} already present`);
console.log(`manifest: ${relative(process.cwd(), MANIFEST)} (${Object.keys(manifest).length} entries)`);
