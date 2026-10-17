// Launch rule: a page isn't done until every CTA is verified against a real destination.
// Usage: npm run verify:launch [-- page.html ...]   (defaults to the free-class funnel pages)
import { readFile } from 'node:fs/promises';
import { funnel, freeClass, packages as buildPackages } from './products.js';

const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['index.html', 'thanks-free-class.html', 'packages.html', 'terms.html'];
const isUrl = v => /^https?:\/\//i.test(String(v || '').trim());
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
const banned = ['$47', 'Save my seat', 'refund', 'Refund', 'First Screen', 'STRIPE_', 'DATE_PLACEHOLDER', 'SUPPORT_EMAIL', 'announced soon', 'DRAFT: not launch-ready', 'minimum 5', 'at least 5'];
const stripeLinks = buildPackages.tiers.map(t => t.stripe);
let failed = 0;

const report = (page, problems) => {
  failed += problems.length;
  console.log(`${problems.length ? '✗' : '✓'} ${page}${problems.map(p => `\n    - ${p}`).join('')}`);
};

for (const page of pages) {
  const html = await readFile(page, 'utf8').catch(() => '');
  const problems = [];
  if (!html) { report(page, ['page is missing']); continue; }
  const visible = html.replace(/<!--[\s\S]*?-->/g, '');
  for (const id of funnel.metaPixels) if (!html.includes(`fbq('init', '${id}')`)) problems.push(`missing fbq('init', '${id}') for Meta Pixel ${id}`);
  if (page !== 'terms.html') for (const s of banned.filter(s => visible.includes(s))) problems.push(`contains old workshop/paid string "${s}"`);
  if (page !== 'thanks-free-class.html' && /name="robots" content="noindex"/.test(html)) problems.push('marked noindex');
  if (page === 'index.html') {
    if (!html.includes("fbq('track', 'ViewContent')")) problems.push("missing the Meta Pixel event fbq('track', 'ViewContent')");
    const ctas = [...visible.matchAll(/<a class="button[^"]*" href="([^"]*)"[^>]*>([^<]*)/g)].map(m => [m[1], m[2].trim()]);
    if (ctas.length < 4) problems.push(`found ${ctas.length} CTA buttons, expected 4 (header, hero, offer, sticky bar)`);
    for (const [href, text] of ctas) {
      if (href !== '#booking') problems.push(`CTA "${text}" points at ${href}, not #booking`);
      if (text !== 'Claim my free seat') problems.push(`CTA wording "${text}" isn't "Claim my free seat"`);
    }
    if (!/class="sticky-cta"/.test(html)) problems.push('missing the sticky mobile CTA bar');
    if (/<nav(?![^>]*class="footer-links")/.test(visible)) problems.push('has a nav menu outside the footer');
    const offPage = [...visible.matchAll(/<a [^>]*href="([^"#][^"]*)"/g)].map(m => m[1]).filter(h => !['terms.html', `mailto:${funnel.supportEmail}`].includes(h));
    for (const href of offPage) problems.push(`off-page link ${href} (only footer legal and the Calendly embed are allowed)`);
    if (!/<section[^>]*id="booking"/.test(html)) problems.push('missing the #booking section');
    const widget = html.match(/class="calendly-inline-widget" data-url="([^"]*)"/);
    if (!widget || widget[1] !== freeClass.calendly) problems.push(`the #booking embed isn't ${freeClass.calendly}`);
    if (!html.includes(`href="mailto:${funnel.supportEmail}"`) || !isEmail(funnel.supportEmail)) problems.push('no support email in the footer');
    if ((html.match(/<!-- ALT H1 \(/g) || []).length < 2) problems.push('expected two alternate H1s as comments for A/B testing');
  }
  if (page === 'thanks-free-class.html') {
    if (!/class="upsell-card"/.test(html)) problems.push('missing the Build-With-Me 1-on-1 upsell block');
    if (!isUrl(freeClass.oneOnOne)) problems.push(`freeClass.oneOnOne = "${freeClass.oneOnOne}" (the upsell button emails you until this is a booking link)`);
  }
  if (page === 'packages.html') {
    for (const url of stripeLinks) if (!html.includes(url)) problems.push(`missing exact Stripe link ${url}`);
    for (const t of buildPackages.tiers) {
      if (!visible.includes(t.cta)) problems.push(`missing CTA wording "${t.cta}"`);
      if (!visible.includes('USD')) { problems.push('prices must show USD'); break; }
    }
    if (!visible.includes('Start here — upgrade to the full build anytime and your $497 applies.')) problems.push('missing the Tier 1 upgrade note');
    if (/most popular|best value/i.test(visible)) problems.push('has an invented "most popular" / "best value" badge');
    if (!html.includes('CHRISTOPHER: add "Most popular" badge to Tier 2')) problems.push('missing the Most popular badge placeholder comment');
    if (/<nav(?![^>]*class="footer-links")/.test(visible)) problems.push('has a nav menu outside the footer');
    const allowed = new Set([...stripeLinks, 'terms.html', `mailto:${funnel.supportEmail}`, '#top', '#packages', '#final']);
    const offPage = [...visible.matchAll(/<a [^>]*href="([^"]*)"/g)].map(m => m[1]).filter(h => !h.startsWith('#') && !allowed.has(h));
    for (const href of offPage) problems.push(`off-page link ${href} (only Stripe + footer legal are allowed)`);
    if (!html.includes(`href="mailto:${funnel.supportEmail}"`) || !isEmail(funnel.supportEmail)) problems.push('no support email in the footer');
    if (!/<table class="pk-table"/.test(html)) problems.push('missing the comparison table');
  }
  if (page === 'terms.html' && /\$47|at least 5|minimum 5/.test(visible)) problems.push('still mentions the old paid workshop');
  report(page, problems);
}

console.log(failed ? `\nNot launch-ready: ${failed} problem(s). After fixing, rebuild and click-test every CTA on the live page.` : '\nAll checks passed. Click-test every CTA on the live page before running traffic.');
process.exit(failed ? 1 : 0);
