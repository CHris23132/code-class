const checkoutUrl = document.querySelector('meta[name="checkout-url"]')?.content.trim();
if (checkoutUrl) document.querySelectorAll('[data-enroll]').forEach(a => { a.href = checkoutUrl; });

document.getElementById('year').textContent = new Date().getFullYear();

const sticky = document.querySelector('.sticky-cta');
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
