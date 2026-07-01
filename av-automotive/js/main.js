/* AV Automotive Detailing — main.js */

// Hero image preload
(function () {
  const visual = document.getElementById('heroVisual');
  if (!visual) return;
  const img = new Image();
  img.onload = () => visual.classList.add('img-loaded');
  img.onerror = () => visual.classList.add('img-loaded'); // still fade in atmo
  img.src = 'images/herocar.png';
})();

// Nav scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile menu
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
burger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
});
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger?.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
  });
});

// Active nav link
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a:not(.nav-book)').forEach(a => {
  if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) {
    a.classList.add('active');
  }
});

// Scroll fade-up
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// Counter animation
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const decimal = el.dataset.decimal === 'true';
  const dur = 1600;
  const t0 = performance.now();
  function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = (decimal ? (target * e).toFixed(1) : Math.round(target * e)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// Modal
const overlay = document.querySelector('.modal-overlay');
const formBody = document.getElementById('formBody');
const formSuccess = document.querySelector('.form-success');

function openModal() {
  overlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-modal]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); openModal(); });
});
document.querySelector('.modal-close')?.addEventListener('click', closeModal);
overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Contact form (connect to Formspree/EmailJS for live submissions)
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    if (formBody) formBody.style.display = 'none';
    formSuccess?.classList.add('show');
    setTimeout(() => {
      closeModal();
      setTimeout(() => {
        if (formBody) formBody.style.display = '';
        formSuccess?.classList.remove('show');
        btn.textContent = 'Send Message';
        btn.disabled = false;
        this.reset();
      }, 400);
    }, 3500);
  }, 800);
});

// Contact page inline form
document.getElementById('contactPageForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    this.style.display = 'none';
    const success = document.getElementById('contactPageSuccess');
    if (success) success.style.display = 'block';
  }, 900);
});
