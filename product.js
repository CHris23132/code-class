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
