import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.png': 'image/png', '.webp': 'image/webp' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const allowed = ['/styles.css','/app.js','/course.js','/firebase.js','/vendor/firebase.js','/product.css','/product.js','/catalog.js'];
    const requestPath = pathname === '/' ? '/index.html' : pathname;
    if (!allowed.includes(requestPath) && !/^\/[a-z0-9-]+\.html$/.test(requestPath) && !/^\/assets\/(?:[a-zA-Z0-9_-]+\/)?[a-zA-Z0-9_.-]+$/.test(requestPath)) throw new Error('Not found');
    const file = path.join(root, requestPath);
    if (!(await stat(file)).isFile()) throw new Error('Not found');
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '0.0.0.0', () => console.log(`Code Class is ready at http://localhost:${port}`));
