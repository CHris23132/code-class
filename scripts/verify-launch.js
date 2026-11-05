// Launch rule: a page isn't done until every CTA is verified against a real destination.
// Usage: npm run verify:launch [-- page.html ...]   (defaults to the free-class funnel pages)
import { readFile } from 'node:fs/promises';
import { funnel, freeClass, packages as buildPackages } from './products.js';
// future-founder.html is included so free-start CTAs stay pointed at the course software.

const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['index.html', 'thanks-free-class.html', 'packages.html', 'terms.html', 'future-founder.html'];
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
  const refundOk = page === 'future-founder.html' || page === 'index.html' || page === 'thanks-free-class.html';
  const bannedHere = refundOk ? banned.filter(s => s !== 'refund' && s !== 'Refund') : banned;
  if (page !== 'terms.html') for (const s of bannedHere.filter(s => visible.includes(s))) problems.push(`contains old workshop/paid string "${s}"`);
  if (page !== 'thanks-free-class.html' && /name="robots" content="noindex"/.test(html)) problems.push('marked noindex');
  if (page === 'index.html') {
    if (!html.includes("fbq('track', 'PageView')")) problems.push('missing PageView');
    if (!html.includes("fbq('track', 'Schedule')")) problems.push('missing Schedule on the webinar CTA');
    if (!html.includes('https://calendly.com/play3dinc/free-webinar-build-your-first-app')) problems.push('missing the webinar booking URL');
    if (!html.includes('Book My Free Webinar')) problems.push('missing the webinar CTA');
    if (html.includes('KitCheckoutClick') || html.includes('Get the First App Kit')) problems.push('homepage still has the kit CTA');
    if (html.includes('$27')) problems.push('homepage still shows the $27 price');
    if (!html.includes('30 seats per Saturday')) problems.push('missing the 30-seat Saturday cap');
    if (/Low6|DraftKings|TravelSpoken/.test(visible)) problems.push('names an employer');
    if (/Instagram clone/i.test(visible)) problems.push('calls it an Instagram clone on the lander');
    if (!html.includes(`href="mailto:${funnel.supportEmail}"`) || !isEmail(funnel.supportEmail)) problems.push('no support email in the footer');
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
    if (/most popular|best value/i.test(visible)) problems.push('has an invented "most popular" / "best value" badge');
    if (!html.includes('CHRISTOPHER: add "Most popular" badge to Tier 2')) problems.push('missing the Most popular badge placeholder comment');
    if (/<nav(?![^>]*class="footer-links")/.test(visible)) problems.push('has a nav menu outside the footer');
    const allowed = new Set([...stripeLinks, 'terms.html', `mailto:${funnel.supportEmail}`, '#top', '#packages']);
    const offPage = [...visible.matchAll(/<a [^>]*href="([^"]*)"/g)].map(m => m[1]).filter(h => !h.startsWith('#') && !allowed.has(h));
    for (const href of offPage) problems.push(`off-page link ${href} (only Stripe + footer legal are allowed)`);
    if (!html.includes(`href="mailto:${funnel.supportEmail}"`) || !isEmail(funnel.supportEmail)) problems.push('no support email in the footer');
    if (!/<table class="pk-table"/.test(html)) problems.push('missing the comparison table');
  }
  if (page === 'terms.html' && /\$47|at least 5|minimum 5/.test(visible)) problems.push('still mentions the old paid workshop');
  if (page === 'future-founder.html') {
    if (!html.includes("fbq('track', 'ViewContent')")) problems.push("missing the Meta Pixel event fbq('track', 'ViewContent')");
    const startLinks = [...visible.matchAll(/<a class="button[^"]*" href="([^"]*)"[^>]*>([^<]*)/g)].map(m => [m[1], m[2].trim()]);
    if (startLinks.length < 4) problems.push(`found ${startLinks.length} CTA buttons, expected at least 4 (header, hero, offer, sticky)`);
    for (const [href, text] of startLinks) {
      if (href !== 'future-founder-class.html') problems.push(`CTA "${text}" points at ${href}, not future-founder-class.html`);
      if (!/start the course/i.test(text)) problems.push(`CTA wording "${text}" should be Start the course`);
    }
    if (!/class="sticky-cta"/.test(html)) problems.push('missing the sticky mobile CTA bar');
    if (!/class="module-strip"/.test(html)) problems.push('missing the above-the-fold module strip');
    if (!/youtube\.com\/embed\/3nYfZG-rAuM/.test(html)) problems.push('missing the YouTube class video embed');
    if (/data-enroll|STRIPE_PROGRAM_URL|Claim my spot — \$/.test(html)) problems.push('still has paid Stripe enroll flow');
    if (!html.includes(freeClass.calendly)) problems.push('missing free-class Calendly secondary link');
    if (!html.includes('packages.html')) problems.push('missing packages.html secondary link');
  }
  report(page, problems);
}

console.log(failed ? `\nNot launch-ready: ${failed} problem(s). After fixing, rebuild and click-test every CTA on the live page.` : '\nAll checks passed. Click-test every CTA on the live page before running traffic.');
process.exit(failed ? 1 : 0);
