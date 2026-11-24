// Responsive images. Each source image becomes AVIF and WebP at a few widths,
// a JPEG fallback, and an untouched full-size copy that the page links to so
// an artifact can always be opened large enough to read. Nothing is ever
// upscaled, recoloured or cropped. Results are cached in var/cache/img.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const WIDTHS = [480, 800, 1200, 1600, 2400];
const FORMATS = {
  avif: (s) => s.avif({ quality: 62, effort: 4 }),
  webp: (s) => s.webp({ quality: 84 }),
  jpg: (s) => s.jpeg({ quality: 86, mozjpeg: true }),
};

export function createImages({ root, outDir }) {
  const cacheDir = path.join(root, 'var', 'cache', 'img');
  fs.mkdirSync(cacheDir, { recursive: true });
  const jobs = [];
  const done = new Map();

  // Registers an image and returns its descriptor synchronously once
  // prepared. Call prepare() for every image first, then await flush().
  async function prepare(file, group) {
    const key = `${group}:${file}`;
    if (done.has(key)) return done.get(key);
    const buf = fs.readFileSync(file);
    const hash = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 10);
    const meta = await sharp(buf).metadata();
    const name = path.basename(file, path.extname(file));
    const widths = [...new Set([...WIDTHS.filter((w) => w < meta.width), meta.width])];
    const variants = { avif: [], webp: [], jpg: [] };
    for (const [fmt, encode] of Object.entries(FORMATS)) {
      const list = fmt === 'jpg' ? [widths.filter((w) => w <= 1600).at(-1) ?? widths[0]] : widths;
      for (const w of list) {
        const outName = `${name}-${hash}-${w}.${fmt}`;
        const cached = path.join(cacheDir, outName);
        const rel = `img/${group}/${outName}`;
        variants[fmt].push({ w, path: '/' + rel });
        jobs.push(async () => {
          if (!fs.existsSync(cached)) await encode(sharp(buf).resize({ width: w, withoutEnlargement: true })).toFile(cached);
          const dest = path.join(outDir, rel);
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.copyFileSync(cached, dest);
        });
      }
    }
    const fullRel = `img/${group}/${name}-${hash}${path.extname(file)}`;
    jobs.push(async () => {
      const dest = path.join(outDir, fullRel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(file, dest);
    });
    const desc = { width: meta.width, height: meta.height, variants, full: '/' + fullRel };
    done.set(key, desc);
    return desc;
  }

  async function flush() {
    // small pool so AVIF encoding does not exhaust memory
    const pool = 4;
    let i = 0;
    await Promise.all(Array.from({ length: pool }, async () => { while (i < jobs.length) await jobs[i++](); }));
    jobs.length = 0;
  }

  return { prepare, flush };
}
