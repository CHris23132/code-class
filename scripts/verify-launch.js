// Launch rule: a page isn't done until every CTA is verified against a real destination.
// Usage: npm run verify:launch [-- page.html ...]   (defaults to the funnel pages)
import { readFile } from 'node:fs/promises';
import { funnel } from './products.js';

const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['index.html', 'workshop.html', 'thanks-workshop.html', 'future-founder.html'];
const isUrl = v => /^https?:\/\//i.test(String(v || '').trim());
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
const banned = ['STRIPE_WORKSHOP_URL', 'DATE_PLACEHOLDER', 'CALENDLY_WORKSHOP_URL', 'SUPPORT_EMAIL', 'announced soon', 'DRAFT: not launch-ready'];
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
  if (page !== 'thanks-workshop.html') {
    for (const s of banned.filter(s => html.includes(s))) problems.push(`contains "${s}"`);
    if (/name="robots" content="noindex"/.test(html)) problems.push('marked noindex');
  }
  if (page === 'workshop.html' || page === 'index.html') {
    const seatButtons = [...html.matchAll(/<a class="button[^"]*" href="([^"]*)"[^>]*>Save my seat/g)].map(m => m[1]);
    if (seatButtons.length < 5) problems.push(`found ${seatButtons.length} "Save my seat" buttons, expected 5 (header, hero, offer, final, sticky bar)`);
    for (const href of seatButtons.filter(h => h !== '#booking')) problems.push(`a "Save my seat" button points at ${href}, not #booking`);
    if (!/<section[^>]*id="booking"/.test(html)) problems.push('missing the #booking section');
    const widget = html.match(/class="calendly-inline-widget" data-url="([^"]*)"/);
    if (!widget || !isUrl(widget[1])) problems.push('the #booking section has no live Calendly URL');
    if (!html.includes('href="mailto:')) problems.push(`no support mailto link (funnel.supportEmail = "${funnel.supportEmail}")`);
  }
  if (page === 'thanks-workshop.html') {
    for (const key of ['software', 'ebook']) if (!isUrl(funnel[key])) problems.push(`funnel.${key} = "${funnel[key]}"`);
    if (!isEmail(funnel.supportEmail)) problems.push(`funnel.supportEmail = "${funnel.supportEmail}"`);
  }
  report(page, problems);
}

console.log(failed ? `\nNot launch-ready: ${failed} problem(s). After fixing, rebuild and click-test every CTA on the live page.` : '\nAll checks passed. Click-test every CTA on the live page before running traffic.');
process.exit(failed ? 1 : 0);
