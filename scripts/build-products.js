import { writeFile } from 'node:fs/promises';
import { products, goals } from './products.js';

const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const money = n => `$${n.toLocaleString('en-US')}`;
const icon = name => `<svg class="icon"><use href="#i-${name}"/></svg>`;

const sprite = `<svg width="0" height="0" class="sprite" aria-hidden="true">
    <symbol id="i-check" viewBox="0 0 256 256"><path fill="currentColor" d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></symbol>
    <symbol id="i-x" viewBox="0 0 256 256"><path fill="currentColor" d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 256 256"><path fill="currentColor" d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></symbol>
    <symbol id="i-shield" viewBox="0 0 256 256"><path fill="currentColor" d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.26,47,25.53a8,8,0,0,0,4.2,0c1-.27,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"/></symbol>
    <symbol id="i-plus" viewBox="0 0 256 256"><path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/></symbol>
  </svg>`;

const head = ({ title, description, ogTitle, ogDescription, image, type, extra = '' }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#071827">
  <title>${title}</title>
  <meta name="description" content="${attr(description)}">
  <meta property="og:title" content="${attr(ogTitle)}">
  <meta property="og:description" content="${attr(ogDescription)}">
  <meta property="og:image" content="${image}">
  <meta property="og:type" content="${type}">
${extra}  <link rel="icon" type="image/png" href="assets/favicon-portrait.png?v=2">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="product.css">
</head>`;

const logo = href => `<a class="logo" href="${href}" aria-label="Code Class home"><img src="assets/favicon-portrait.png?v=2" alt="" width="30" height="30"><span class="logo-word">codeclass<span>.</span></span></a>`;

const footer = link => `<footer class="site-footer">
    <div class="wrap">© <span id="year">2026</span> Code Class · Made for curious minds. Built for what’s next.${link ? ` <a href="./">Browse all courses</a>` : ''}</div>
  </footer>`;

const founderCard = `<article class="card founder-card">
            <img src="assets/products/founder.webp" alt="Portrait of the Code Class founder" width="480" height="480" loading="lazy" decoding="async">
            <h3>Built by a builder.</h3>
            <p>I started as a broke beginner teaching myself to code. I became a top-rated developer on Fiverr, then a startup CTO, then went to big tech — building apps that serve millions. This is the path I wish I’d had.</p>
          </article>`;

function productPage(p) {
  const image = `assets/products/${p.slug}.webp`;
  const total = p.stack.reduce((sum, [, value]) => sum + value, 0);
  const enroll = `Enroll now — ${money(p.price)} ${icon('arrow')}`;
  return `${head({ title: `${p.title} | Code Class`, description: p.description, ogTitle: p.title, ogDescription: p.ogDescription, image, type: 'product', extra: `  <meta name="checkout-url" content="${attr(p.checkoutUrl)}">\n  <link rel="preload" as="image" href="${image}" fetchpriority="high">\n` })}
<body>
  ${sprite}

  <header class="site-header">
    <div class="wrap header-inner">
      ${logo('./')}
      <div class="header-actions">
        <a class="header-link" href="./">All courses</a>
        <a class="button button-small" href="#offer" data-enroll>Enroll now</a>
      </div>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">No gurus. No hype. Just a builder.</span>
          <h1>${p.headline}</h1>
          <p class="lead">${p.subhead}</p>
          <div class="cta-group">
            <a class="button button-large" href="#offer" data-enroll>${enroll}</a>
            <p class="trust">${p.trust.join(' <i>·</i> ')}</p>
          </div>
        </div>
        <div class="hero-visual">
          <img src="${image}" alt="${attr(`${p.name} course box: ${p.tagline}`)}" width="720" height="720" fetchpriority="high" decoding="async">
        </div>
      </div>
    </section>

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

    <section class="section curriculum">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">What’s inside</span>
          <h2>The 4 phases.</h2>
          <p>About 4 hours in total. One focused weekend, or one phase at a time.</p>
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

    <section class="section offer" id="offer">
      <div class="wrap">
        <div class="offer-card">
          <div class="offer-visual">
            <img src="${image}" alt="" width="720" height="720" loading="lazy" decoding="async">
          </div>
          <div class="offer-body">
            <span class="eyebrow">Everything you get</span>
            <h2>The ${p.name} Course</h2>
            <ul class="stack">
${p.stack.map(([label, value, bonus]) => `              <li${bonus ? ' class="bonus"' : ''}><span>${bonus ? '<b>Bonus:</b> ' : ''}${label}</span><s>${money(value)}</s></li>`).join('\n')}
            </ul>
            <div class="price">
              <span class="total">Total value: <s>${money(total)}</s></span>
              <span class="today">Today: <b>${money(p.price)}</b></span>
            </div>
            <a class="button button-large full" href="#offer" data-enroll>${enroll}</a>
            <div class="guarantee">
              ${icon('shield')}
              <p><strong>${p.guarantee[0]}:</strong> ${p.guarantee[1]}</p>
            </div>
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
          <a class="button button-large" href="#offer" data-enroll>${enroll}</a>
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
        <p class="more-all"><a href="./">See all courses ${icon('arrow')}</a></p>
      </div>
    </section>
  </main>

  ${footer(true)}

  <div class="sticky-cta" aria-hidden="true">
    <span><b>${p.name}</b> · ${money(p.price)}</span>
    <a class="button" href="#offer" data-enroll tabindex="-1">Enroll now</a>
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
              <div class="course-foot"><span class="course-price">${money(p.price)}</span><span class="course-cta">View course ${icon('arrow')}</span></div>
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

for (const p of products) await writeFile(`${p.slug}.html`, productPage(p));
await writeFile('index.html', galleryPage());
console.log(`Generated ${products.length} product pages and the index.html course gallery`);
