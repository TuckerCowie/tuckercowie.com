// A minimal static server for local preview and for the checks.
//   node src/build/serve.mjs [dir] [port]

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.txt': 'text/plain; charset=utf-8',
};

export function serve(dir, port = 4173) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    let file = path.join(dir, p);
    if (!file.startsWith(dir)) { res.writeHead(403).end(); return; }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const nf = path.join(dir, '404.html');
      res.writeHead(404, { 'content-type': TYPES['.html'] });
      res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'Not found');
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-cache' });
    fs.createReadStream(file).pipe(res);
  });
  server.listen(port, '127.0.0.1', () => console.log(`Serving ${dir} at http://127.0.0.1:${port}/`));
  return server;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  serve(path.resolve(root, process.argv[2] ?? 'dist'), Number(process.argv[3]) || 4173);
}
