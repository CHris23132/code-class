// Launch rule: a page isn't done until every checkout button resolves to a real checkout URL.
// Usage: npm run verify:launch [-- page.html ...]   (defaults to the funnel pages)
import { readFile } from 'node:fs/promises';
import { SESSION, funnel } from './products.js';

const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['workshop.html', 'thanks-workshop.html', 'future-founder.html'];
const isUrl = v => /^https?:\/\//i.test(String(v || '').trim());
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
let failed = 0;

const report = (page, problems) => {
  failed += problems.length;
  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.map(p => `\n    - ${p}`).join('')}`);
};

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const problems = [];
  const metas = Object.fromEntries([...html.matchAll(/<meta name="(checkout-url[\w-]*)" content="([^"]*)"/g)].map(m => [m[1], m[2]]));
  const buttons = [...html.matchAll(/data-enroll(?:="([\w-]*)")?/g)].map(m => m[1] ? `checkout-url-${m[1]}` : 'checkout-url');
  for (const [name, count] of Object.entries(buttons.reduce((acc, n) => ({ ...acc, [n]: (acc[n] || 0) + 1 }), {}))) {
    if (!isUrl(metas[name])) problems.push(`${count} button(s) use <meta name="${name}"> = "${metas[name] ?? 'missing'}", not a real checkout URL`);
  }
  if (/date announced soon|dates announced soon/.test(html)) problems.push('shows "announced soon" instead of a real date');
  if (/name="robots" content="noindex"/.test(html) && page !== 'thanks-workshop.html') problems.push('still marked noindex (draft)');
  if (page === 'workshop.html') {
    if (!SESSION.date) problems.push('SESSION.date is empty');
    if (!isEmail(funnel.supportEmail)) problems.push(`funnel.supportEmail = "${funnel.supportEmail}"`);
  }
  if (page === 'thanks-workshop.html') {
    for (const key of ['calendly', 'software', 'ebook']) if (!isUrl(funnel[key])) problems.push(`funnel.${key} = "${funnel[key]}"`);
  }
  report(page, problems);
}

console.log(failed ? `\nNot launch-ready: ${failed} problem(s). After fixing, rebuild and click-test every CTA on the live page.` : '\nAll checks passed. Click-test every CTA on the live page before running traffic.');
process.exit(failed ? 1 : 0);
