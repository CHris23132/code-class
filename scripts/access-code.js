import { createHash } from 'node:crypto';

const code = String(process.argv[2] || '').trim().toUpperCase();
if (!code) {
  console.error('Usage: npm run access-code -- NEWCODE');
  process.exit(1);
}
console.log(`Add this to ACCESS_CODE_HASHES in app.js to accept ${code}:`);
console.log(`'${createHash('sha256').update(code).digest('hex')}'`);
