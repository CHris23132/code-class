const isUrl = value => /^https?:\/\//i.test(value?.trim() || '');

// data-enroll uses meta checkout-url; data-enroll="name" uses meta checkout-url-name.
document.querySelectorAll('[data-enroll]').forEach(a => {
  const name = a.dataset.enroll ? `checkout-url-${a.dataset.enroll}` : 'checkout-url';
  const url = document.querySelector(`meta[name="${name}"]`)?.content.trim();
  if (isUrl(url)) a.href = url;
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

function embedUrl(raw) {
  const url = new URL(raw);
  const host = url.hostname.replace(/^www\./, '');
  const youtube = host === 'youtu.be' ? url.pathname.slice(1) : host.endsWith('youtube.com') ? url.searchParams.get('v') || url.pathname.split('/').pop() : '';
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0`;
  if (host === 'vimeo.com') return `https://player.vimeo.com/video${url.pathname}?autoplay=1`;
  if (host.endsWith('loom.com')) return `${raw.replace('/share/', '/embed/')}?autoplay=1`;
  return raw;
}

const vsl = document.querySelector('.vsl-slot');
if (vsl && isUrl(vsl.dataset.vsl)) {
  vsl.querySelector('button').addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = embedUrl(vsl.dataset.vsl.trim());
    frame.title = 'How the program works';
    frame.allow = 'autoplay; fullscreen; picture-in-picture';
    frame.allowFullscreen = true;
    vsl.replaceChildren(frame);
  });
}

const carousel = document.querySelector('.quote-carousel');
if (carousel) {
  const track = carousel.querySelector('.quote-track');
  const slides = [...track.children];
  const dots = [...carousel.querySelectorAll('.quote-dots button')];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clone = slides[0].cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.append(clone);
  let index = 0;
  let timer;
  const show = (i, animate = true) => {
    index = i;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translateX(-${i * 100}%)`;
    if (!animate) void track.offsetWidth;
    dots.forEach((dot, n) => dot.setAttribute('aria-current', String(n === i % slides.length)));
  };
  const step = dir => {
    if (index >= slides.length) show(0, false);
    if (dir < 0 && index === 0) show(slides.length, false);
    show(index + dir);
  };
  const stop = () => clearInterval(timer);
  const start = () => { stop(); if (!still) timer = setInterval(() => step(1), 6000); };
  track.addEventListener('transitionend', e => { if (e.target === track && index === slides.length) show(0, false); });
  dots.forEach((dot, n) => dot.addEventListener('click', () => { show(n); start(); }));
  let touchX = null;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; stop(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    start();
  });
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  start();
}

const sticky = document.querySelector('.sticky-cta');
if (sticky) {
  const stickyLink = sticky.querySelector('a');
  const visible = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target);
    const show = visible.size === 0 && window.scrollY > 200;
    sticky.classList.toggle('show', show);
    sticky.setAttribute('aria-hidden', String(!show));
    stickyLink.tabIndex = show ? 0 : -1;
  });
  [document.querySelector('.hero .cta-group'), document.getElementById('offer'), document.getElementById('final'), document.querySelector('.more-courses')].filter(Boolean).forEach(el => observer.observe(el));
}
