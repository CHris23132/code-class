import { mkdir, copyFile, cp } from 'node:fs/promises';
import './build-icons.js';
import './build-firebase.js';
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'course.js', 'firebase.js']) await copyFile(file, `dist/${file}`);
await cp('assets', 'dist/assets', { recursive: true });
await cp('vendor', 'dist/vendor', { recursive: true });
console.log('Built static website in dist/');
