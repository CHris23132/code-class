import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const source = 'node_modules/@phosphor-icons/core/assets/regular';
const mappings = {
  arrowLeft:'arrow-left', arrowRight:'arrow-right', arrowUpRight:'arrow-up-right', bolt:'lightning', book:'book-open', check:'check', chevron:'caret-right', clock:'clock', close:'x', code:'code', copy:'copy', download:'download-simple', flag:'flag', github:'github-logo', help:'question', layers:'stack', note:'note-pencil', rocket:'rocket-launch', search:'magnifying-glass', shield:'shield-check', sparkles:'sparkle', terminal:'terminal-window', trophy:'trophy', palette:'palette', database:'database'
};
const icons = {};
for (const [name, file] of Object.entries(mappings)) {
  const svg = await readFile(path.join(source, `${file}.svg`), 'utf8');
  icons[name] = svg.replace(/^.*?<svg[^>]*>/s, '').replace(/<\/svg>\s*$/, '').trim();
}
await mkdir('assets/icons', { recursive: true });
const appFile = (await readFile('app.js', 'utf8')).replace(/^const phosphorIcons = .*\n/gm, '');
const importLine = "import { lessons, modules } from './course.js';";
if (!appFile.includes(importLine)) throw new Error('Could not find the icon library insertion point in app.js');
const appWithIcons = appFile.replace(importLine, `const phosphorIcons = ${JSON.stringify(icons)};\n${importLine}`);
await writeFile('app.js', appWithIcons);
await copyFile('node_modules/@phosphor-icons/core/LICENSE', 'assets/icons/PHOSPHOR-LICENSE.txt');
