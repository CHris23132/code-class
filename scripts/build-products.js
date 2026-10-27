import { mkdir, writeFile } from 'node:fs/promises';
import { products, goals, testimonials, press, credentials, funnel, freeClass, packages as buildPackages } from './products.js';
import { COURSE_VIDEO_ID } from '../course.js';

const SITE = 'https://torontoinnovationlab.com/';
const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const money = n => `$${n.toLocaleString('en-US')}`;
const isUrl = v => /^https?:\/\//i.test(String(v || '').trim());
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
const cohortText = funnel.cohortDate ? `Next cohort starts ${funnel.cohortDate} — 4 live sessions over 2 weeks.` : 'Next cohort: dates announced soon — 4 live sessions over 2 weeks.';
const supportLink = isEmail(funnel.supportEmail) ? `<a href="mailto:${attr(funnel.supportEmail)}">${funnel.supportEmail}</a>` : '';
const pixels = funnel.metaPixels.filter(id => /^\d+$/.test(id));
const pixel = (event = '') => pixels.length ? `  <!-- Meta Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
${pixels.map(id => `  fbq('init', '${id}');\n`).join('')}  fbq('track', 'PageView');${event ? `\n  ${event}` : ''}
  </script>
${pixels.map(id => `  <noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1"
  /></noscript>
`).join('')}  <!-- End Meta Pixel Code -->
` : '';
const icon = name => `<svg class="icon"><use href="#i-${name}"/></svg>`;

const sprite = `<svg width="0" height="0" class="sprite" aria-hidden="true">
    <symbol id="i-check" viewBox="0 0 256 256"><path fill="currentColor" d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></symbol>
    <symbol id="i-x" viewBox="0 0 256 256"><path fill="currentColor" d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 256 256"><path fill="currentColor" d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></symbol>
    <symbol id="i-shield" viewBox="0 0 256 256"><path fill="currentColor" d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"/></symbol>
    <symbol id="i-play" viewBox="0 0 256 256"><path fill="currentColor" d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"/></symbol>
    <symbol id="i-plus" viewBox="0 0 256 256"><path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/></symbol>
  </svg>`;

const head = ({ title, description, ogTitle, ogDescription, image, type, extra = '', track = '' }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#071827">
  <title>${title}</title>
  <meta name="description" content="${attr(description)}">
  <meta property="og:title" content="${attr(ogTitle)}">
  <meta property="og:description" content="${attr(ogDescription)}">
  <meta property="og:image" content="${isUrl(image) ? image : SITE + image}">
  <meta property="og:type" content="${type}">
  <meta name="twitter:card" content="summary_large_image">
${extra}  <link rel="icon" type="image/png" href="assets/favicon-portrait.png?v=2">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="product.css?v=11">
${pixel(track)}</head>`;

const logo = href => `<a class="logo" href="${href}" aria-label="Code Class home"><img src="assets/favicon-portrait.png?v=2" alt="" width="30" height="30"><span class="logo-word">codeclass<span>.</span></span></a>`;

const footer = link => `<footer class="site-footer">
    <div class="wrap">
      <p>© <span id="year">2026</span> Code Class · Made for curious minds. Built for what’s next.</p>
      <nav class="footer-links" aria-label="Footer">${link ? '<a href="courses.html">Browse all courses</a>' : ''}<a href="terms.html">Terms</a><a href="refund.html">Refund policy</a>${supportLink}</nav>
    </div>
  </footer>`;

const founderCard = `<article class="card founder-card">
            <img src="assets/products/founder.webp" alt="Portrait of the Code Class founder" width="480" height="480" loading="lazy" decoding="async">
            <h3>Built by a builder.</h3>
            <p>I started as a broke beginner teaching myself to code. This is the path I wish I’d had.</p>
            <ul class="credentials">
${credentials.map(c => `              <li>${icon('check')}${c}</li>`).join('\n')}
            </ul>
          </article>`;

const pressLogos = hidden => press.map(([file, name, w72, h]) => `<li><img src="assets/press/${file}.webp" alt="${hidden ? '' : attr(name)}" width="${Math.round(w72 * h / 72)}" height="${h}" loading="lazy" decoding="async"></li>`).join('');

const pressStrip = `
    <section class="press" aria-label="Work featured in">
      <p class="press-label">Work featured in</p>
      <div class="ticker">
        <div class="ticker-track">
          <ul>${pressLogos(false)}</ul>
          <ul aria-hidden="true">${pressLogos(true)}</ul>
        </div>
      </div>
    </section>
`;

const quotesFor = course => testimonials.filter(t => t.course === course && t.quote.trim() && t.name.trim());

function testimonialSection(p, eyebrow = 'From students', quotes = quotesFor(p.slug)) {
  const slot = p.live ? '\n    <!-- TESTIMONIALS: slot for founding-student videos -->\n' : '';
  if (!quotes.length) return slot;
  return `${slot}
    <section class="section testimonials">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">${eyebrow}</span>
          <h2>What builders are saying.</h2>
        </div>
        <div class="quote-carousel" aria-roledescription="carousel" aria-label="Student testimonials">
          <div class="quote-viewport">
            <div class="quote-track">
${quotes.map((t, i) => `              <figure class="quote-card" aria-roledescription="slide" aria-label="${i + 1} of ${quotes.length}">
                <blockquote>“${t.quote.trim()}”</blockquote>
                <figcaption>${t.photo ? `<img class="quote-photo" src="${attr(t.photo)}" alt="" width="48" height="48" loading="lazy" decoding="async">` : `<span class="quote-avatar" aria-hidden="true">${t.name.trim()[0].toUpperCase()}</span>`}<span><b>${t.name}</b>${t.role ? `<small>${t.role}</small>` : ''}</span></figcaption>
              </figure>`).join('\n')}
            </div>
          </div>
          <div class="quote-dots">${quotes.map((t, i) => `<button type="button" aria-label="Show quote from ${attr(t.name)}" aria-current="${i === 0}"></button>`).join('')}</div>
        </div>
      </div>
    </section>
`;
}

function vslSlot(url) {
  const ready = isUrl(url);
  return `<div class="vsl-slot" data-vsl="${attr(url)}">
            <button type="button" class="vsl-thumb"${ready ? ' aria-label="Play video: how the program works"' : ' disabled'}>
              <img src="assets/products/founder.webp" alt="" width="480" height="480" decoding="async">
              ${ready ? `<span class="vsl-play">${icon('play')}</span>` : ''}
              <span class="vsl-caption">${ready ? 'Watch: how the program works (3 min)' : 'Video coming soon'}</span>
            </button>
          </div>`;
}

const sessionsSection = p => `
    <section class="section sessions">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Live with me</span>
          <h2>The 4 live sessions.</h2>
          <p>Two weeks, four live build sessions on Zoom. Every session is recorded.</p>
        </div>
        <ol class="phases">
${p.sessions.map(([title, text], i) => `          <li class="phase">
            <div class="phase-top"><span class="phase-num">Session ${i + 1}</span><span class="phase-time">Live</span></div>
            <h3>${title}</h3>
            <p>${text}</p>
          </li>`).join('\n')}
        </ol>
      </div>
    </section>
`;

function freeStartPage(p) {
  const image = `assets/products/${p.slug}.webp`;
  const start = p.startUrl || 'future-founder-class.html';
  const cta = p.cta || 'Start the course';
  const startBtn = `${cta} ${icon('arrow')}`;
  const calendly = freeClass.calendly;
  const metas = `  <link rel="preload" as="image" href="${image}" fetchpriority="high">\n`;
  return `${head({ title: `${p.title} | Code Class`, description: p.description, ogTitle: p.title, ogDescription: p.ogDescription, image, type: 'product', extra: metas, track: "fbq('track', 'ViewContent');" })}
<body class="free-start-page">
  ${sprite}

  <header class="site-header">
    <div class="wrap header-inner">
      ${logo('./')}
      <div class="header-actions">
        <a class="header-link" href="courses.html">All courses</a>
        <a class="button button-small" href="${start}">${cta}</a>
      </div>
    </div>
  </header>

  <main id="top">
    <section class="hero start-hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">${p.eyebrow || 'Free to start'}</span>
          <h1>${p.headline}</h1>
          <p class="lead">${p.subhead}</p>
          <div class="cta-group">
            <a class="button button-large" href="${start}">${startBtn}</a>
            <p class="trust">${p.trust.join(' <i>·</i> ')}</p>
            <p class="start-secondary">Prefer live help? <a href="${calendly}" target="_blank" rel="noopener noreferrer">Book a free class</a> <i>·</i> <a href="packages.html">Build with me 1-on-1</a></p>
          </div>
        </div>
        <div class="hero-visual">
          <div class="course-thumb course-thumb-video">
            <iframe src="https://www.youtube.com/embed/${COURSE_VIDEO_ID}?rel=0&modestbranding=1" title="Code Class — build your first real app" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="eager"></iframe>
          </div>
          <p class="course-thumb-caption-out"><a href="${start}">Open the guided software · 12 lessons ${icon('arrow')}</a></p>
        </div>
      </div>
      <div class="wrap">
        <ol class="module-strip" aria-label="Course modules">
${p.phases.map(([name, minutes], i) => `          <li><span class="module-strip-num">0${i + 1}</span><strong>${name}</strong><small>~${minutes} min</small></li>`).join('\n')}
        </ol>
      </div>
    </section>
${pressStrip}
    <section class="section problem">
      <div class="wrap narrow">
        <h2>${p.problemTitle}</h2>
        <ul class="pain-list">
${p.problems.map(([strong, rest]) => `          <li><span class="pain-mark">${icon('x')}</span><p><strong>${strong}</strong> ${rest}</p></li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="section outcome">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">${p.outcomeEyebrow}</span>
          <h2>${p.outcomeTitle}</h2>
        </div>
        <div class="phones" aria-label="${attr(p.screensLabel)}">
${p.screens.map(([caption, html]) => `          <figure class="phone">
            <div class="screen">
              ${html}
            </div>
            <figcaption>${caption}</figcaption>
          </figure>`).join('\n')}
        </div>
        <p class="demo-note">Illustrative demo screens with sample content. Your app’s design and data will be your own.</p>
        <ul class="outcome-list">
${p.outcomes.map(o => `          <li>${icon('check')}${o}</li>`).join('\n')}
        </ul>
        <p class="applied">${p.applied}</p>
        <div class="cta-group center">
          <a class="button button-large" href="${start}">${startBtn}</a>
        </div>
      </div>
    </section>

    <section class="section different">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Why this works</span>
          <h2>This isn’t another video course.</h2>
        </div>
        <div class="columns">
${p.different.map(([title, text], i) => `          <article class="card">
            <span class="card-num">0${i + 1}</span>
            <h3>${title}</h3>
            <p>${text}</p>
          </article>`).join('\n')}
          ${founderCard}
        </div>
      </div>
    </section>

    <section class="section curriculum" id="modules">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">What’s inside</span>
          <h2>The 4 modules.</h2>
          <p>${p.phasesNote || 'About 4 hours in total. One focused weekend, or one module at a time.'}</p>
        </div>
        <ol class="phases">
${p.phases.map(([name, minutes, bullets], i) => `          <li class="phase">
            <div class="phase-top"><span class="phase-num">Module ${i + 1}</span><span class="phase-time">${minutes} min</span></div>
            <h3>${name}</h3>
            <ul>${bullets.map(b => `<li>${b}</li>`).join('')}</ul>
          </li>`).join('\n')}
        </ol>
        <p class="phase-plus">${icon('plus')} ${p.appliedTrack}</p>
        <div class="cta-group center">
          <a class="button button-large" href="${start}">${startBtn}</a>
        </div>
      </div>
    </section>

    <section class="section fit">
      <div class="wrap fit-grid">
        <div class="fit-col yes">
          <h2>For you if:</h2>
          <ul>
${p.forYou.map(t => `            <li>${icon('check')}${t}</li>`).join('\n')}
          </ul>
        </div>
        <div class="fit-col no">
          <h2>Not for you if:</h2>
          <ul>
${p.notForYou.map(t => `            <li>${icon('x')}${t}</li>`).join('\n')}
          </ul>
        </div>
      </div>
    </section>
${testimonialSection(p)}
    <section class="section offer" id="offer">
      <div class="wrap">
        <div class="offer-card single start-offer">
          <div class="offer-body">
            <span class="eyebrow">Everything you get</span>
            <h2>${p.offerTitle || p.name}</h2>
            <ul class="stack">
${p.stack.map(([label]) => `              <li><span>${label}</span><b>Included</b></li>`).join('\n')}
            </ul>
            <div class="price">
              <span class="today">Today: <b>Free</b></span>
            </div>
            <a class="button button-large full" href="${start}">${startBtn}</a>
            <div class="guarantee">
              ${icon('shield')}
              <p><strong>${p.guarantee[0]}:</strong> ${p.guarantee[1]}</p>
            </div>
            <p class="downsell">Want live 1-on-1? <a href="packages.html">See Build-With-Me packages ${icon('arrow')}</a></p>
          </div>
        </div>
      </div>
    </section>

    <section class="section faq">
      <div class="wrap narrow">
        <h2>Questions, answered.</h2>
${p.faq.map(([q, a]) => `        <details>
          <summary>${q}</summary>
          <p>${a}</p>
        </details>`).join('\n')}
      </div>
    </section>

    <section class="section final" id="final">
      <div class="wrap final-grid">
        <div class="course-thumb course-thumb-video final-thumb">
          <iframe src="https://www.youtube.com/embed/${COURSE_VIDEO_ID}?rel=0&modestbranding=1" title="Code Class walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>
        </div>
        <div>
          <h2>${p.finalHeadline}</h2>
          <p class="lead">${p.finalLead}</p>
          <a class="button button-large" href="${start}">${startBtn}</a>
          <p class="trust">${p.finalTrust}</p>
          <p class="start-secondary">Or <a href="${calendly}" target="_blank" rel="noopener noreferrer">book a free live class</a></p>
        </div>
      </div>
    </section>

    <section class="section more-courses">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Compare courses</span>
          <h2>Looking for something else?</h2>
        </div>
        <div class="mini-grid">
${products.filter(o => o.slug !== p.slug).map(o => `          <a class="mini-card" href="${o.slug}.html">
            <img src="assets/products/${o.slug}.webp" alt="" width="720" height="720" loading="lazy" decoding="async">
            <span class="mini-body"><b>${o.name}</b><small>${o.tagline}</small><span class="mini-price">${o.freeStart ? 'Free' : money(o.price)} <span class="mini-view">View course ${icon('arrow')}</span></span></span>
          </a>`).join('\n')}
        </div>
        <p class="more-all"><a href="courses.html">See all courses ${icon('arrow')}</a></p>
      </div>
    </section>
  </main>

  ${footer(true)}

  <div class="sticky-cta" aria-hidden="true">
    <span><b>${p.name}</b> · Free</span>
    <a class="button" href="${start}" tabindex="-1">${cta}</a>
  </div>

  <script src="product.js" defer></script>
</body>
</html>
`;
}

function productPage(p) {
  if (p.freeStart) return freeStartPage(p);
  const image = `assets/products/${p.slug}.webp`;
  const total = p.stack.reduce((sum, [, value]) => sum + value, 0);
  const cta = p.cta || 'Enroll now';
  const enroll = `${cta} — ${money(p.price)} ${icon('arrow')}`;
  const cohort = p.live ? `\n          <p class="cohort-line">${cohortText}</p>` : '';
  const metas = `  <meta name="checkout-url" content="${attr(p.checkoutUrl)}">\n${p.downsell ? `  <meta name="checkout-url-${p.downsell[1]}" content="${attr(funnel.evergreenCheckout)}">\n` : ''}  <link rel="preload" as="image" href="${image}" fetchpriority="high">\n`;
  return `${head({ title: `${p.title} | Code Class`, description: p.description, ogTitle: p.title, ogDescription: p.ogDescription, image, type: 'product', extra: metas })}
<body>
  ${sprite}

  <header class="site-header">
    <div class="wrap header-inner">
      ${logo('./')}
      <div class="header-actions">
        <a class="header-link" href="courses.html">All courses</a>
        <a class="button button-small" href="#offer" data-enroll>${cta}</a>
      </div>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">${p.eyebrow || 'No gurus. No hype. Just a builder.'}</span>
          <h1>${p.headline}</h1>
          <p class="lead">${p.subhead}</p>
          <div class="cta-group">
            <a class="button button-large" href="#offer" data-enroll>${enroll}</a>${cohort}
            <p class="trust">${p.trust.join(' <i>·</i> ')}</p>
          </div>
        </div>
        <div class="hero-visual${p.vslUrl ? ' has-vsl' : ''}">
          ${p.vslUrl ? `${vslSlot(p.vslUrl)}\n          ` : ''}<img class="hero-box" src="${image}" alt="${attr(`${p.name} course box: ${p.tagline}`)}" width="720" height="720" fetchpriority="high" decoding="async">
        </div>
      </div>
    </section>
${pressStrip}
    <section class="section problem">
      <div class="wrap narrow">
        <h2>${p.problemTitle}</h2>
        <ul class="pain-list">
${p.problems.map(([strong, rest]) => `          <li><span class="pain-mark">${icon('x')}</span><p><strong>${strong}</strong> ${rest}</p></li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="section outcome">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">${p.outcomeEyebrow}</span>
          <h2>${p.outcomeTitle}</h2>
        </div>
        <div class="phones" aria-label="${attr(p.screensLabel)}">
${p.screens.map(([caption, html]) => `          <figure class="phone">
            <div class="screen">
              ${html}
            </div>
            <figcaption>${caption}</figcaption>
          </figure>`).join('\n')}
        </div>
        <p class="demo-note">Illustrative demo screens with sample content. Your app’s design and data will be your own.</p>
        <ul class="outcome-list">
${p.outcomes.map(o => `          <li>${icon('check')}${o}</li>`).join('\n')}
        </ul>
        <p class="applied">${p.applied}</p>
      </div>
    </section>

    <section class="section different">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Why this works</span>
          <h2>This isn’t another video course.</h2>
        </div>
        <div class="columns">
${p.different.map(([title, text], i) => `          <article class="card">
            <span class="card-num">0${i + 1}</span>
            <h3>${title}</h3>
            <p>${text}</p>
          </article>`).join('\n')}
          ${founderCard}
        </div>
      </div>
    </section>
${p.sessions ? sessionsSection(p) : ''}
    <section class="section curriculum">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">What’s inside</span>
          <h2>The 4 phases.</h2>
          <p>${p.phasesNote || 'About 4 hours in total. One focused weekend, or one phase at a time.'}</p>
        </div>
        <ol class="phases">
${p.phases.map(([name, minutes, bullets], i) => `          <li class="phase">
            <div class="phase-top"><span class="phase-num">Phase ${i + 1}</span><span class="phase-time">${minutes} min</span></div>
            <h3>${name}</h3>
            <ul>${bullets.map(b => `<li>${b}</li>`).join('')}</ul>
          </li>`).join('\n')}
        </ol>
        <p class="phase-plus">${icon('plus')} ${p.appliedTrack}</p>
      </div>
    </section>

    <section class="section fit">
      <div class="wrap fit-grid">
        <div class="fit-col yes">
          <h2>For you if:</h2>
          <ul>
${p.forYou.map(t => `            <li>${icon('check')}${t}</li>`).join('\n')}
          </ul>
        </div>
        <div class="fit-col no">
          <h2>Not for you if:</h2>
          <ul>
${p.notForYou.map(t => `            <li>${icon('x')}${t}</li>`).join('\n')}
          </ul>
        </div>
      </div>
    </section>
${testimonialSection(p)}
    <section class="section offer" id="offer">
      <div class="wrap">
        <div class="offer-card">
          <div class="offer-visual">
            <img src="${image}" alt="" width="720" height="720" loading="lazy" decoding="async">
          </div>
          <div class="offer-body">
            <span class="eyebrow">Everything you get</span>
            <h2>${p.offerTitle || `The ${p.name} Course`}</h2>
            <ul class="stack">
${p.stack.map(([label, value, bonus]) => `              <li${bonus ? ' class="bonus"' : ''}><span>${bonus ? '<b>Bonus:</b> ' : ''}${label}</span><s>${money(value)}</s></li>`).join('\n')}
            </ul>
            <div class="price">
              <span class="total">Total value: <s>${money(total)}</s></span>
              <span class="today">Today: <b>${money(p.price)}</b></span>
            </div>
            <a class="button button-large full" href="#offer" data-enroll>${enroll}</a>${cohort.replace('cohort-line', 'cohort-line center')}
            <div class="guarantee">
              ${icon('shield')}
              <p><strong>${p.guarantee[0]}:</strong> ${p.guarantee[1]}</p>
            </div>${p.downsell ? `
            <p class="downsell">Can’t attend live? <a href="#offer" data-enroll="${p.downsell[1]}">Get the recordings + software self-serve for ${money(p.downsell[0])} ${icon('arrow')}</a></p>` : ''}
          </div>
        </div>
      </div>
    </section>

    <section class="section faq">
      <div class="wrap narrow">
        <h2>Questions, answered.</h2>
${p.faq.map(([q, a]) => `        <details>
          <summary>${q}</summary>
          <p>${a}</p>
        </details>`).join('\n')}
      </div>
    </section>

    <section class="section final" id="final">
      <div class="wrap final-grid">
        <img src="${image}" alt="" width="720" height="720" loading="lazy" decoding="async">
        <div>
          <h2>${p.finalHeadline}</h2>
          <p class="lead">${p.finalLead}</p>
          <a class="button button-large" href="#offer" data-enroll>${enroll}</a>${cohort}
          <p class="trust">${p.finalTrust}</p>
        </div>
      </div>
    </section>

    <section class="section more-courses">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Compare courses</span>
          <h2>Looking for something else?</h2>
        </div>
        <div class="mini-grid">
${products.filter(o => o.slug !== p.slug).map(o => `          <a class="mini-card" href="${o.slug}.html">
            <img src="assets/products/${o.slug}.webp" alt="" width="720" height="720" loading="lazy" decoding="async">
            <span class="mini-body"><b>${o.name}</b><small>${o.tagline}</small><span class="mini-price">${money(o.price)} <span class="mini-view">View course ${icon('arrow')}</span></span></span>
          </a>`).join('\n')}
        </div>
        <p class="more-all"><a href="courses.html">See all courses ${icon('arrow')}</a></p>
      </div>
    </section>
  </main>

  ${footer(true)}

  <div class="sticky-cta" aria-hidden="true">
    <span><b>${p.name}</b> · ${money(p.price)}</span>
    <a class="button" href="#offer" data-enroll tabindex="-1">${cta}</a>
  </div>

  <script src="product.js" defer></script>
</body>
</html>
`;
}

function galleryPage() {
  return `${head({ title: 'Courses — Find the Right Course for What You Want to Build | Code Class', description: 'Code Class courses: build your first app, publish to the App Store, build custom AI tools, or create internal tools for companies. No experience needed.', ogTitle: 'Code Class Courses — Find the course for what you want to build', ogDescription: 'Your first app, the App Store, AI tools, or business software. Pick your goal and start building.', image: `assets/products/${products[0].slug}.webp`, type: 'website' })}
<body class="catalog-page">
  ${sprite}

  <header class="site-header">
    <div class="wrap header-inner">
      ${logo('./')}
      <a class="header-link" href="future-founder-class.html">Student login ${icon('arrow')}</a>
    </div>
  </header>

  <main>
    <section class="catalog-hero">
      <div class="wrap">
        <span class="eyebrow">The Code Class course library</span>
        <h1>Find the course for what you want to <span class="highlight">build.</span></h1>
        <p class="lead">Every course is a guided, step-by-step system — video lessons plus interactive software — that ends with something real you built yourself. No experience needed.</p>
      </div>
    </section>

    <section class="catalog">
      <div class="wrap">
        <div class="goal-filter" role="group" aria-labelledby="goal-label">
          <span id="goal-label" class="goal-label">What do you want to build?</span>
          <div class="goal-chips">
${goals.map(([id, label, best]) => `            <button type="button" class="goal-chip" data-goal="${id}"${best ? ` data-best="${best}"` : ''} aria-pressed="${id === 'all'}">${label}</button>`).join('\n')}
          </div>
        </div>
        <p class="catalog-count" id="catalog-count" aria-live="polite">${products.length} courses</p>
        <div class="catalog-grid">
${products.map((p, i) => `          <article class="course-card" data-slug="${p.slug}" data-name="${attr(p.name)}" data-goals="${p.goals.join(' ')}">
            <a class="course-link" href="${p.slug}.html" aria-label="${attr(`${p.name}: ${p.tagline}`)}"></a>
            ${p.badge ? `<span class="course-badge">${p.badge}</span>` : ''}
            <span class="course-match">✦ Best match for you</span>
            <img src="assets/products/${p.slug}.webp" alt="" width="720" height="720"${i < 2 ? '' : ' loading="lazy"'} decoding="async">
            <div class="course-body">
              <h2>${p.name}</h2>
              <p class="course-tagline">${p.tagline}</p>
              <p class="course-summary">${p.summary}</p>
              <ul class="course-tags">${p.goals.map(g => `<li>${goals.find(([id]) => id === g)[1]}</li>`).join('')}</ul>
              <div class="course-foot"><span class="course-price">${p.freeStart ? 'Free' : money(p.price)}</span><span class="course-cta">View course ${icon('arrow')}</span></div>
            </div>
          </article>`).join('\n')}
        </div>
        <div class="catalog-help">
          <p><strong>Not sure where to start?</strong> ${products[0].name} is the foundation for every other course — your first real app, start to finish.</p>
          <a class="button" href="${products[0].slug}.html">See ${products[0].name} ${icon('arrow')}</a>
        </div>
      </div>
    </section>
  </main>

  ${footer(false)}

  <script src="catalog.js" defer></script>
</body>
</html>
`;
}

const LEGAL_UPDATED = 'October 7, 2026';

function legalPage({ title, intro, sections }) {
  const contact = supportLink ? `Email ${supportLink}` : 'Reply to your receipt email';
  return `${head({ title: `${title} | Code Class`, description: intro, ogTitle: `${title} — Code Class`, ogDescription: intro, image: 'assets/products/future-founder.webp', type: 'website' })}
<body class="legal-page">
  <header class="site-header">
    <div class="wrap header-inner">
      ${logo('./')}
      <a class="header-link" href="courses.html">All courses</a>
    </div>
  </header>

  <main class="legal">
    <div class="wrap narrow">
      <h1>${title}</h1>
      <p class="legal-updated">Last updated ${LEGAL_UPDATED}</p>
      <p class="lead">${intro}</p>
${sections.map(([h, body]) => `      <h2>${h}</h2>
      ${(Array.isArray(body) ? body : [body]).map(b => b.startsWith('<ul') ? b : `<p>${b}</p>`).join('\n      ')}`).join('\n')}
      <h2>Questions</h2>
      <p>${contact} and a real person will get back to you.</p>
    </div>
  </main>

  ${footer(false)}

  <script src="product.js" defer></script>
</body>
</html>
`;
}

const termsPage = () => legalPage({
  title: 'Terms',
  intro: 'The plain-English rules for buying and using Code Class workshops, programs, and courses.',
  sections: [
    ['What you’re buying', 'Each purchase gives one person access to what that page lists — for example a live workshop seat, live program sessions, session recordings, the guided software, and any bonuses. Access is for your own personal use.'],
    ['Live sessions', ['Live sessions run on Google Meet at the time you book or that’s shown on the page. Seats are limited per session.', 'If we ever have to move a session, we’ll email you the new time and the recording is still yours.']],
    ['Please don’t share', 'Your login, the recordings, the software, and the course materials are for you. Please don’t share, resell, or re-upload them.'],
    ['What you build is yours', 'The app and code you build during a workshop, program, or course belong to you.'],
    ['Results', 'We teach a step-by-step system and back it with the guarantees on each page, but what you build afterwards depends on you. We don’t promise income or business results.'],
    ['Payments and refunds', 'Payments are processed securely by Stripe. Refunds follow our <a href="refund.html">refund policy</a>.'],
    ['Changes', 'If these terms change, the new version will be posted here with a new date.']
  ]
});

const refundPage = () => legalPage({
  title: 'Refund policy',
  intro: 'Every Code Class offer has a simple guarantee: if you do the work and don’t get the first result we promise, you get your money back.',
  sections: [
    ['First Screen workshop ($47)', ['Attend live, follow along, and if you don\'t leave with a working app screen on your phone, email us within 7 days for a full refund.', 'If a session doesn’t reach the 5-person minimum, your seat moves to the next session and you keep every bonus.']],
    ...products.map(p => [`${p.offerTitle || p.name} (${p.freeStart ? 'Free' : money(p.price)})`, `<strong>${p.guarantee[0]}:</strong> ${p.guarantee[1].replace('email me and I’ll', 'email us and we’ll')}`]),
    ['Workshop credit', 'If you join Build &amp; Launch within 48 hours of your workshop, your $47 workshop payment is credited toward it.'],
    ['How refunds are paid', 'Refunds go back to the card you paid with through Stripe. They usually appear within 5–10 business days, depending on your bank.']
  ]
});

function thanksPage() {
  const linkButton = (url, label, ready) => isUrl(url)
    ? `<a class="button" href="${attr(url)}" target="_blank" rel="noopener">${label} ${icon('arrow')}</a>`
    : `<span class="button" aria-disabled="true">${ready}</span>`;
  const program = products.find(p => p.slug === 'future-founder');
  return `${head({ track: "fbq('trackCustom', 'WorkshopBooked');", title: 'You’re in — First Screen Workshop | Code Class', description: 'Your First Screen workshop seat is booked: your next step, software access, and bonuses.', ogTitle: 'You’re in — First Screen Workshop', ogDescription: 'Your seat is booked. Here’s everything you need.', image: 'assets/social/workshop.jpg', type: 'website', extra: '  <meta name="robots" content="noindex">\n' })}
<body class="thanks-page">
  ${sprite}

  <header class="site-header">
    <div class="wrap header-inner">
      ${logo('./')}
    </div>
  </header>

  <main class="thanks">
    <div class="wrap">
      <div class="thanks-head">
        <span class="eyebrow">First Screen workshop</span>
        <h1>You're in. Here's everything.</h1>
        <p class="lead">Your seat is booked. Your Google Meet link and calendar invite are in your confirmation email.</p>
      </div>
      <div class="step-list">
        <section class="upsell-card" aria-labelledby="upsell-title">
          <span class="eyebrow">Your next step · Free</span>
          <h2 id="upsell-title">Turn your first screen into a full app.</h2>
          <p>Continue with the free Future Founder course — video walkthrough plus guided software with all 12 lessons, prompts, and checkpoints.</p>
          <ol class="upsell-sessions">
${program.phases.map(([title, minutes], i) => `            <li><b>Module ${i + 1}: ${title}</b><span>~${minutes} min</span></li>`).join('\n')}
          </ol>
          <p class="upsell-credit">Create a free account to open the software. Want 1-on-1 help later? See Build-With-Me packages.</p>
          <a class="button button-large" href="${program.slug}.html">Start the free course ${icon('arrow')}</a>
        </section>
        <section class="step-card">
          <h2>Your software access</h2>
          <p>Open the guided classroom — create a free account to unlock all 12 lessons.</p>
          <a class="button" href="${program.startUrl || 'future-founder-class.html'}">Open the software ${icon('arrow')}</a>
        </section>
        <section class="step-card">
          <h2>Your ebook</h2>
          <p>Your “Build Your First App in a Weekend” ebook is ready now. Your starter kit (every prompt + template we use) arrives by email.</p>
          ${linkButton(funnel.ebook, 'Download the ebook', 'Ebook download coming soon')}
        </section>
      </div>
      <p class="fine-print">Small by design: minimum 5 to run — if we don’t hit 5, you roll to the next session and keep every bonus.${supportLink ? ` Questions? ${supportLink}` : ''}</p>
    </div>
  </main>

  ${footer(false)}

  <script src="product.js" defer></script>
</body>
</html>
`;
}

const fc = freeClass;
const claim = `Claim my free seat ${icon('arrow')}`;
const time12 = t => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''}${h < 12 ? 'am' : 'pm'}`; };
const slotList = fc.days.map(d => [d, fc.slots[d].map(time12)]);
const freeFooter = `<footer class="site-footer">
    <div class="wrap">
      <p>© <span id="year">2026</span> Code Class · Made for curious minds. Built for what’s next.</p>
      <nav class="footer-links" aria-label="Legal"><a href="terms.html">Terms</a>${supportLink}</nav>
    </div>
  </footer>`;

const story = [
  ['Where I started', 'No money. No job.', 'Just me, a laptop, and a dream of breaking into tech.'],
  ['Then it clicked', 'Top-rated on Fiverr.', 'Earned enough to take my first real vacation.'],
  ['Then a startup noticed', 'Flown to San Francisco.', 'My first tech conference. Real investor meetings.'],
  ['Software paid for this', 'My dream car.', 'Not rented. Not a prop. Mine — bought with software money.'],
  ['And then', 'Big tech job. She said yes.', 'Full-time at a big tech company, engaged to the love of my life.']
];

const freeFaq = [
  ['I’ve never written code — is this really for me?', 'Yes — it’s built for total beginners. You describe what you want, the AI writes the code, and I guide every click live.'],
  ['What if I can’t make my slot?', 'Use the reschedule link in your confirmation email to move to another weekend slot. Seats are small, so move early.'],
  ['What do I need installed before the class?', 'Just a laptop and your phone. Everything we use is free, and I walk you through setup at the start. <!-- CHRISTOPHER: confirm — or list anything people should install first (e.g. Expo Go on their phone) --> '],
  ['Is it really free? What’s the catch?', 'It’s really free — no card needed to book. The honest catch: most people want to keep building after, and I offer a paid 1-on-1 for that.'],
  ['Will there be a recording?', 'Yes. You get the session recording so you can rebuild your app anytime.']
];

function freeClassPage() {
  const schedule = attr(JSON.stringify({ slots: fc.slots, timeZone: fc.timeZone, days: `Every ${fc.days.join(' & ')}`, label: 'class' }));
  const sessionLine = cls => `<p class="session-line${cls ? ` ${cls}` : ''}" data-schedule="${schedule}">Every ${fc.days.join(' &amp; ')} — ${slotList.map(([d, t]) => `${d.slice(0, 3)} ${t.join(' &amp; ')}`).join(', ')} ET</p>`;
  // Live class is the primary (lime) door; video course is the equal-size secondary door.
  const dualCta = (size = 'button-large', meta = true) => `<div class="cta-group cta-two-door">
            <a class="button ${size}" href="#booking" data-track="BookLiveClassClick">Book a free live class ${icon('arrow')}</a>
            <a class="button ${size} button-course" href="future-founder-class.html" data-track="StartCourseClick">Start now with the video course ${icon('arrow')}</a>
            ${meta ? `<p class="cta-meta">Live: weekends, ${fc.minutes} min · Video: free · 12 lessons · start anytime</p>` : ''}
          </div>`;
  return `${head({ track: "fbq('track', 'ViewContent');", title: 'Free Live Class + Video Course | Code Class', description: 'Book a free live class on weekends, or start now with the free video course — build a real app with a real database, on your phone.', ogTitle: fc.headline, ogDescription: 'Book a free live class, or start now with the video course. Free to start either way.', image: 'assets/social/free-class.jpg', type: 'website', extra: `  <link rel="canonical" href="${SITE}">\n  <meta property="og:url" content="${SITE}">\n  <link rel="preload" as="image" href="assets/free-class/christopher.webp">\n` })}
<body class="free-class-page two-door">
  ${sprite}

  <header class="site-header">
    <div class="wrap header-inner">
      ${logo('#top')}
      <div class="header-cta-pair">
        <a class="button button-small" href="#booking" data-track="BookLiveClassClick">Book live class</a>
        <a class="button button-small button-course" href="future-founder-class.html" data-track="StartCourseClick">Video course</a>
      </div>
    </div>
  </header>

  <main id="top">
    <section class="lp-hero">
      <div class="wrap lp-hero-grid">
        <div class="lp-hero-copy">
          <span class="eyebrow">Two ways to start — both free</span>
          <!-- HEADLINE (A/B test): the live H1 lives in freeClass.headline in scripts/products.js. -->
          <h1>${fc.headline}</h1>
${fc.altHeadlines.map(([angle, text]) => `          <!-- ALT H1 (${angle}): ${text} -->`).join('\n')}
          <p class="lead">Build a real app with a real database, on your phone. Book a free live class with me on the weekend — or start now with the video course the moment you’re inspired.</p>
          ${dualCta('button-large', true)}
          <p class="lp-host"><img src="assets/free-class/christopher.webp" alt="" width="40" height="40"><span>Built &amp; taught by <b>Christopher Walsh</b></span></p>
          <ul class="proof-strip" aria-label="Christopher’s track record">
${fc.proof.map(p => `            <li>${icon('check')}${p}</li>`).join('\n')}
          </ul>
        </div>
        <figure class="lp-photo">
          <img src="assets/free-class/christopher.webp" alt="Christopher Walsh, your host" width="560" height="552" fetchpriority="high">
          <figcaption><b>Christopher Walsh</b><span>Live class host · video course</span></figcaption>
        </figure>
      </div>
    </section>

    <section class="section lp-build" id="build">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">What you’ll build</span>
          <h2>A real app with accounts, data, and a phone preview.</h2>
          <p class="lead">Not a toy demo — a working project you can keep growing after you start.</p>
        </div>
        <ul class="lp-cards">
          <li><h3>Screens you can tap through</h3><p>Design and build the main views of your app, then preview them on the web and on your phone.</p></li>
          <li><h3>Real sign-in and saved data</h3><p>Connect authentication and a cloud database so people can create accounts and keep their stuff.</p></li>
          <li><h3>Posts, profiles, and more</h3><p>Wire up the features that make an app feel alive — then prepare a mobile build when you’re ready.</p></li>
        </ul>
        <div style="margin-top:28px">${dualCta('button-large', false)}</div>
      </div>
    </section>

    <section class="section curriculum lp-steps" id="how">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">How it works</span>
          <h2>Live with me — or start with the video course.</h2>
          <p class="lead">Same goal either way: a real app on your phone. Pick the path that fits today.</p>
        </div>
        <ol class="phases three">
          <li class="phase"><div class="phase-top"><span class="phase-num">Live</span></div><h3>Book a free weekend class</h3><p>${fc.minutes} minutes on Google Meet. I guide you face-to-face while you build.</p></li>
          <li class="phase"><div class="phase-top"><span class="phase-num">Video</span></div><h3>Start the 12-lesson course</h3><p>Watch, copy the prompt, build, check it off — progress saves to your free account.</p></li>
          <li class="phase"><div class="phase-top"><span class="phase-num">Next</span></div><h3>Keep building</h3><p>When you’re ready for 1-on-1 help on your own idea, Build-With-Me is there.</p></li>
        </ol>
        <div style="margin-top:28px">${dualCta('button-large', false)}</div>
      </div>
    </section>

    <section class="section lp-story">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Why I teach this</span>
          <h2>I learned by building — not by watching alone.</h2>
          <p class="lead">Start live with me, or start with the video course — both get you building for real.</p>
        </div>
        <ol class="story-strip">
${story.map(([kicker, title, text], i) => `          <li><img src="assets/free-class/story-${i + 1}.webp" alt="${attr(`${kicker}: ${title} ${text}`)}" width="540" height="960" loading="lazy" decoding="async"></li>`).join('\n')}
        </ol>
        <div style="margin-top:28px">${dualCta('button-large', false)}</div>
      </div>
    </section>

    <section class="section faq">
      <div class="wrap narrow">
        <h2>Questions, answered.</h2>
        <details>
          <summary>I’ve never written code — can I still start?</summary>
          <p>Yes. Both the live class and the video course are built for beginners.</p>
        </details>
        <details>
          <summary>What’s the difference between the live class and the video course?</summary>
          <p>The live class is a ${fc.minutes}-minute Google Meet on weekends with me guiding you face-to-face. The video course is 12 on-demand lessons you can start anytime.</p>
        </details>
        <details>
          <summary>Is it really free?</summary>
          <p>Yes — no card required to book the live class or to open the video course. Optional paid 1-on-1 Build-With-Me packages exist if you want to build your own app with me later.</p>
        </details>
${freeFaq.filter(([q]) => /slot|recording|catch/i.test(q)).map(([q, a]) => `        <details>
          <summary>${q}</summary>
          <p>${a}</p>
        </details>`).join('\n')}
      </div>
    </section>

    <section class="section booking" id="booking">
      <div class="wrap">
        <div class="section-head">
          <p class="lp-repeat">Primary path — face-to-face</p>
          <h2>Book a free live class</h2>
          <p class="booking-flow">Pick your Saturday or Sunday slot below → free, no card required → get your Google Meet link instantly.</p>
          ${sessionLine('')}
        </div>
        <div class="booking-card">
          <div class="calendly-inline-widget" data-url="${attr(fc.calendly)}" style="min-width:320px;height:720px;"></div>
        </div>
        <script src="https://assets.calendly.com/assets/external/widget.js" async></script>
        <p class="fine-print">Small by design: max ${fc.maxSeats} seats per session. Saturdays &amp; Sundays · Eastern Time.</p>
        <div class="booking-alt">
          <p>Can’t make a weekend slot?</p>
          <a class="button button-large button-course" href="future-founder-class.html" data-track="StartCourseClick">Start now with the video course ${icon('arrow')}</a>
        </div>
      </div>
    </section>
  </main>

  ${freeFooter}

  <div class="sticky-cta sticky-cta-pair" aria-hidden="true">
    <a class="button" href="#booking" data-track="BookLiveClassClick" tabindex="-1">Book live class</a>
    <a class="button button-course" href="future-founder-class.html" data-track="StartCourseClick" tabindex="-1">Video course</a>
  </div>

  <script src="product.js" defer></script>
</body>
</html>
`;
}

function thanksFreeClassPage() {
  const oneOnOne = isUrl(fc.oneOnOne)
    ? `<a class="button button-large" href="${attr(fc.oneOnOne)}" target="_blank" rel="noopener">Book my 1-on-1 ${icon('arrow')}</a>`
    : `<a class="button button-large" href="mailto:${attr(funnel.supportEmail)}?subject=${encodeURIComponent('Build-With-Me 1-on-1')}">Ask about a 1-on-1 ${icon('arrow')}</a>`;
  return `${head({ title: 'You’re in — First App Class (Free) | Code Class', description: 'Your free class seat is booked. Check your email for the Google Meet link.', ogTitle: 'You’re in — First App Class (Free)', ogDescription: 'Your seat is booked. Check your email for the Google Meet link.', image: 'assets/social/free-class.jpg', type: 'website', extra: '  <meta name="robots" content="noindex">\n' })}
<body class="thanks-page">
  ${sprite}

  <header class="site-header">
    <div class="wrap header-inner">
      ${logo('./')}
    </div>
  </header>

  <main class="thanks">
    <div class="wrap">
      <div class="thanks-head">
        <span class="eyebrow">First App Class (Free)</span>
        <h1>You’re in — check your email for the Meet link.</h1>
        <p class="lead">Your seat is booked. Your Google Meet link and calendar invite are in your confirmation email.</p>
      </div>
      <div class="step-list">
        <section class="upsell-card" aria-labelledby="upsell-title">
          <span class="eyebrow">Build-With-Me 1-on-1</span>
          <h2 id="upsell-title">Want to keep going?</h2>
          <p>Bring your idea — a startup, a company tool, whatever — I lay out the plan and we start building it together, live, one-on-one.</p>
          ${oneOnOne}
        </section>
        <section class="step-card">
          <h2>What to expect in the free class</h2>
          <ul class="included">
            <li>${icon('check')}<span>Join from a laptop on Google Meet, with your phone nearby.</span></li>
            <li>${icon('check')}<span>We build your first app screen live — database, buttons, the works.</span></li>
            <li>${icon('check')}<span>You leave with a working app on your phone, plus a free account to open the Code Class build software.</span></li>
          </ul>
        </section>
        <section class="step-card">
          <h2>About the recording</h2>
          <p>Can’t stay for all of it, or want to rebuild it later? You’ll get the session recording after class. <!-- CHRISTOPHER: confirm how the recording is delivered (email, Drive link, etc.) --></p>
        </section>
      </div>
      <p class="fine-print">Need to change your time? Use the reschedule link in your confirmation email.${supportLink ? ` Questions? ${supportLink}` : ''}</p>
    </div>
  </main>

  ${freeFooter}

  <script src="product.js" defer></script>
</body>
</html>
`;
}

const redirectPage = to => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Code Class</title>
  <meta name="robots" content="noindex">
  <link rel="canonical" href="${SITE}">
  <meta http-equiv="refresh" content="0; url=${to}">
</head>
<body>
  <p><a href="${to}">Continue to Code Class</a></p>
</body>
</html>
`;

const pkg = buildPackages;
const packagesFooter = `<footer class="site-footer">
    <div class="wrap">
      <p>© <span id="year">2026</span> Code Class · Made for curious minds. Built for what’s next.</p>
      <nav class="footer-links" aria-label="Legal"><a href="terms.html">Terms</a>${supportLink}</nav>
    </div>
  </footer>`;

const packagesFaq = [
  ['I’ve never built anything — is this really for me?', 'Yes — that’s the point. We build your real app together, live. Try the free class first if you’re unsure.'],
  ['What if my idea is too big for 6 sessions?', 'We scope it in session 1 — you leave with the core app working and a plan for the rest.'],
  ['Who owns the app?', 'You do — 100%. Your idea, your code, your accounts.'],
  ['What if I need to reschedule a session?', '<!-- CHRISTOPHER: confirm reschedule policy — do not invent one -->Email support and ask before your session.'],
  ['How is this different from a course?', 'Courses give you videos to watch alone. This is you and me building your actual app, live.']
];

const cell = v => {
  if (v === true) return `<span class="pk-yes" aria-label="Included">${icon('check')}</span>`;
  if (v === false) return `<span class="pk-no" aria-label="Not included">${icon('x')}</span>`;
  return `<span class="pk-text">${v}</span>`;
};

const tierCta = t => `<a class="button${t.id === 'mvp' ? '' : ''} full" href="${attr(t.stripe)}" target="_blank" rel="noopener">${t.cta} ${icon('arrow')}</a>`;

function packagesPage() {
  const shortNames = ['MVP Kickstart', 'Full App', 'Full App + Support'];
  return `${head({ title: 'Build-With-Me Packages — 1-on-1 App Building | Code Class', description: 'Bring your idea. We’ll build the app together, live — 1-on-1 on Google Meet. MVP Kickstart from $497 USD, Full App $997, or Full App + Support $1,497.', ogTitle: 'Bring Your Idea. We’ll Build the App Together, Live.', ogDescription: 'No course. No videos to watch alone. You and me, face-to-face, building your real app — session by session.', image: 'assets/social/free-class.jpg', type: 'website', extra: `  <link rel="canonical" href="${SITE}packages.html">\n  <meta property="og:url" content="${SITE}packages.html">\n` })}
<body class="packages-page">
  ${sprite}

  <header class="site-header">
    <div class="wrap header-inner">
      ${logo('#top')}
    </div>
  </header>

  <main id="top">
    <section class="section offer pk-packages pk-packages-first" id="packages">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">1-on-1 — you bring the idea</span>
          <h1 class="pk-page-title">${pkg.headline}</h1>
          <p class="lead">All prices in USD. Stripe handles checkout — this page never sees your card.</p>
        </div>
        <!-- CHRISTOPHER: add "Most popular" badge to Tier 2 once it has the most buyers -->
        <div class="pk-grid">
${pkg.tiers.map(t => `          <article class="pk-card" id="tier-${t.id}">
            <header class="pk-card-head">
              <h3>${t.name}</h3>
              <p class="pk-price"><b>${money(t.price)}</b> <span>USD</span></p>
            </header>
            <ul class="included">
${t.bullets.map(b => `              <li>${icon('check')}<span>${b}</span></li>`).join('\n')}
            </ul>
${t.note ? `            <p class="pk-upgrade">${t.note}</p>\n` : ''}            ${tierCta(t)}
          </article>`).join('\n')}
        </div>
      </div>
    </section>

    <section class="section pk-compare">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Side by side</span>
          <h2>What’s in each package.</h2>
        </div>
        <div class="pk-table-wrap" tabindex="0" role="region" aria-label="Package comparison">
          <table class="pk-table">
            <thead>
              <tr>
                <th scope="col"><span class="visually-hidden">Feature</span></th>
${pkg.tiers.map((t, i) => `                <th scope="col">
                  <span class="pk-th-name">${shortNames[i]}</span>
                  <span class="pk-th-price">${money(t.price)} USD</span>
                </th>`).join('\n')}
              </tr>
            </thead>
            <tbody>
${pkg.compare.map(([label, ...vals]) => `              <tr>
                <th scope="row">${label}</th>
${vals.map(v => `                <td>${cell(v)}</td>`).join('\n')}
              </tr>`).join('\n')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="section curriculum lp-steps">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">How it works</span>
          <h2>Three steps from idea to app.</h2>
          <p class="lead">Pay once. Book your sessions. Build together live.</p>
        </div>
        <ol class="phases three">
          <li class="phase"><div class="phase-top"><span class="phase-num">Step 1</span></div><h3>Pick your package</h3><p>Pay securely through Stripe. Your receipt is emailed instantly.</p></li>
          <li class="phase"><div class="phase-top"><span class="phase-num">Step 2</span></div><h3>Get your booking link</h3><p>Christopher sends your private booking link — sessions on Google Meet, evenings and weekends ET.</p></li>
          <li class="phase"><div class="phase-top"><span class="phase-num">Step 3</span></div><h3>Build together, live</h3><p>Recordings after every session. You own 100% of the app.</p></li>
        </ol>
      </div>
    </section>

    <section class="section lp-mechanism pk-after">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">After you pay</span>
          <h2>What happens next.</h2>
          <p class="lead">Simple, clear, no guessing.</p>
        </div>
        <ul class="lp-cards">
          <li><h3>Your receipt</h3><p>Stripe emails your receipt instantly — that’s your proof of payment.</p></li>
          <li><h3>Your booking link</h3><p>Christopher sends your private session booking link. <!-- CHRISTOPHER: confirm how quickly --> </p></li>
          <li><h3>You build live</h3><p>Sessions on Google Meet. Recordings after each call. You own the app.</p></li>
        </ul>
      </div>
    </section>

    <section class="section faq">
      <div class="wrap narrow">
        <h2>Questions, answered.</h2>
${packagesFaq.map(([q, a]) => `        <details>
          <summary>${q}</summary>
          <p>${a}</p>
        </details>`).join('\n')}
      </div>
    </section>
  </main>

  ${packagesFooter}

  <script src="product.js" defer></script>
</body>
</html>
`;
}

function classPrepPage() {
  const extBtn = (href, label) => `<a class="button full" href="${attr(href)}" target="_blank" rel="noopener">${label} ${icon('arrow')}</a>`;
  return `${head({ title: 'Class prep — Get set up for First App Class | Code Class', description: 'A 10-minute setup before First App Class: install your editor, AI subscription, Expo Go, and optional GitHub.', ogTitle: 'You’re booked. Let’s get you set up.', ogDescription: 'About 10 minutes. Do this before class so we can build right away.', image: 'assets/social/free-class.jpg', type: 'website', extra: `  <link rel="canonical" href="${SITE}class-prep">\n  <meta property="og:url" content="${SITE}class-prep">\n` })}
<body class="prep-page">
  ${sprite}

  <header class="site-header">
    <div class="wrap header-inner">
      ${logo('#top')}
    </div>
  </header>

  <main id="top">
    <section class="prep-hero">
      <div class="wrap narrow">
        <span class="eyebrow">First App Class</span>
        <h1>You’re booked. Let’s get you set up.</h1>
        <p class="lead">About 10 minutes. Do this before class so we can build right away — not install software on the call.</p>
      </div>
    </section>

    <section class="section prep-steps">
      <div class="wrap narrow">
        <ol class="prep-list">
          <li class="prep-step" id="editor">
            <div class="prep-step-top"><span class="phase-num">Step 1</span><span class="prep-tag">Required</span></div>
            <h2>Install an editor</h2>
            <p>Pick one. Cursor is recommended for this class.</p>
            <div class="prep-actions">
              ${extBtn('https://cursor.com/download', 'Download Cursor')}
              ${extBtn('https://code.visualstudio.com/download', 'Download VS Code')}
            </div>
            <p class="prep-note"><b>Recommended:</b> Cursor. VS Code is fine too.</p>
          </li>

          <li class="prep-step" id="ai">
            <div class="prep-step-top"><span class="phase-num">Step 2</span><span class="prep-tag">Required</span></div>
            <h2>Get a paid AI subscription</h2>
            <p>You need Claude Pro+ or ChatGPT Plus+. Free tiers won’t cut it for class.</p>
            <div class="prep-actions">
              ${extBtn('https://claude.ai', 'Claude (Pro+)')}
              ${extBtn('https://chatgpt.com', 'ChatGPT (Plus+)')}
            </div>
            <p class="prep-note">Pick one for now. Either works.</p>
          </li>

          <li class="prep-step" id="extension">
            <div class="prep-step-top"><span class="phase-num">Step 3</span><span class="prep-tag">VS Code only</span></div>
            <h2>Install the AI extension</h2>
            <p><b>Cursor users:</b> skip this step — AI is built in. Sign in when Cursor asks.</p>
            <p><b>VS Code users:</b> install one extension, then sign in.</p>
            <div class="prep-actions">
              ${extBtn('https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code', 'Claude Code for VS Code')}
              ${extBtn('https://marketplace.visualstudio.com/items?itemName=openai.chatgpt', 'Codex for VS Code')}
            </div>
            <p class="prep-warn">Before you install: check the publisher says <b>Anthropic</b> or <b>OpenAI</b>. Skip anything else.</p>
          </li>

          <li class="prep-step" id="expo">
            <div class="prep-step-top"><span class="phase-num">Step 4</span><span class="prep-tag">Required</span></div>
            <h2>Install Expo Go on your phone</h2>
            <p>This is how your app opens on your phone during class.</p>
            <div class="prep-actions">
              ${extBtn('https://apps.apple.com/app/expo-go/id982107779', 'Expo Go for iPhone')}
              ${extBtn('https://play.google.com/store/apps/details?id=host.exp.exponent', 'Expo Go for Android')}
            </div>
          </li>

          <li class="prep-step" id="github">
            <div class="prep-step-top"><span class="phase-num">Step 5</span><span class="prep-tag prep-tag-optional">Optional</span></div>
            <h2>GitHub account</h2>
            <p>Nice for saving projects later. <b>Not needed</b> to run the app in class with Expo Go.</p>
            <div class="prep-actions">
              ${extBtn('https://github.com/signup', 'Create a free GitHub account')}
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="section prep-checklist-section">
      <div class="wrap narrow">
        <article class="prep-checklist" aria-labelledby="checklist-title">
          <span class="eyebrow">Before class</span>
          <h2 id="checklist-title">Your checklist</h2>
          <ul>
            <li><span class="prep-box" aria-hidden="true"></span><span>Cursor or VS Code installed</span></li>
            <li><span class="prep-box" aria-hidden="true"></span><span>Claude Pro+ or ChatGPT Plus+ active</span></li>
            <li><span class="prep-box" aria-hidden="true"></span><span>AI extension installed + signed in <small>(VS Code only)</small></span></li>
            <li><span class="prep-box" aria-hidden="true"></span><span>Expo Go on your phone</span></li>
            <li><span class="prep-box" aria-hidden="true"></span><span>GitHub account <small>(optional)</small></span></li>
          </ul>
        </article>
      </div>
    </section>

    <section class="section prep-close">
      <div class="wrap narrow">
        <p class="prep-stuck">Stuck? Email <a href="mailto:play3dinc@gmail.com">play3dinc@gmail.com</a></p>
        <p class="prep-sign">— Christopher</p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <p>© <span id="year">2026</span> Code Class</p>
      <nav class="footer-links" aria-label="Legal"><a href="terms.html">Terms</a>${supportLink}</nav>
    </div>
  </footer>

  <script src="product.js" defer></script>
</body>
</html>
`;
}

for (const p of products) await writeFile(`${p.slug}.html`, productPage(p));
await writeFile('index.html', freeClassPage());
await writeFile('thanks-free-class.html', thanksFreeClassPage());
await writeFile('packages.html', packagesPage());
await writeFile('class-prep.html', classPrepPage());
await mkdir('class-prep', { recursive: true });
await writeFile('class-prep/index.html', `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Class prep — Code Class</title>
  <meta name="robots" content="noindex">
  <link rel="canonical" href="${SITE}class-prep">
  <meta http-equiv="refresh" content="0; url=../class-prep.html">
</head>
<body>
  <p><a href="../class-prep.html">Continue to class prep</a></p>
</body>
</html>
`);
await writeFile('workshop.html', redirectPage('./'));
await writeFile('courses.html', galleryPage());
await writeFile('thanks-workshop.html', thanksPage());
await writeFile('terms.html', termsPage());
await writeFile('refund.html', refundPage());
console.log(`Generated ${products.length} product pages, index.html (the free class), packages.html, class-prep.html (+ /class-prep/), thanks-free-class.html, workshop.html (redirects home), courses.html, thanks-workshop.html (old paid event), terms.html, and refund.html. Run npm run verify:launch before sending traffic.`);
