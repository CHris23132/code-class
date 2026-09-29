import { build } from 'esbuild';

await build({
  entryPoints: ['scripts/firebase-entry.js'],
  outfile: 'vendor/firebase.js',
  bundle: true,
  format: 'esm',
  minify: true,
  target: 'es2020',
  legalComments: 'none',
  logLevel: 'warning'
});
console.log('Bundled Firebase SDK into vendor/firebase.js');
