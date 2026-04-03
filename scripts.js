/* ═══════════════════════════════════════════════════
   scripts.js — Mohamad Ghattas Portfolio
   Features:
     · Live clock
     · Scroll progress bar
     · Navbar scroll state + active link tracking
     · Hamburger / mobile drawer
     · Typewriter effect
     · IntersectionObserver scroll reveals
     · Animated count-up stats
═══════════════════════════════════════════════════ */

/* ── CLOCK ── */
function tick() {
  const el = document.getElementById('clock');
  if (el) el.textContent = new Date().toLocaleTimeString();
}
setInterval(tick, 1000);
tick();

/* ── SCROLL PROGRESS ── */
const prog = document.getElementById('prog');
window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;

  // Progress bar
  if (prog) prog.style.width = (scrolled / total * 100) + '%';

  // Navbar
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', scrolled > 50);

  // Active nav links
  updateActiveLink(scrolled);
}

/* ── ACTIVE NAV LINK ── */
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateActiveLink(scrollY) {
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 220) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ── HAMBURGER / MOBILE DRAWER ── */
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  drawer.classList.toggle('open');
  document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
});

drawer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  });
});

const phrases = [
  'high-performance systems.',
  'intuitive user experiences.',
  'resilient architectures.',
  'maintainable codebases.',
  'impactful digital products.',
  'modern web applications.',
  'efficient APIs.',
  'secure platforms.',
  'thoughtful solutions.',
  'perfect interfaces.',
  'data-driven tools.',
  'reliable infrastructure.',
  'developer-friendly systems.',
  'scalable platforms.',
  'clean abstractions.',
  'end-to-end solutions.',
  'future-ready software.',
  'user-centered designs.',
  'fast, responsive apps.',
  'well-tested code.',
];

const typeEl = document.getElementById('typeText');
let phraseIndex = 0;
let charIndex   = 0;
let deleting    = false;

function typeStep() {
  const phrase = phrases[phraseIndex];

  if (!deleting) {
    typeEl.textContent = phrase.slice(0, ++charIndex);
    if (charIndex === phrase.length) {
      deleting = true;
      return setTimeout(typeStep, 2200);
    }
  } else {
    typeEl.textContent = phrase.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeStep, deleting ? 52 : 90);
}

typeStep();

/* ── SCROLL REVEAL + COUNT-UP ── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);

    // Trigger count-up if this element (or a child) has data-target
    entry.target.querySelectorAll('.stat-n[data-target]').forEach(numEl => {
      if (numEl.dataset.done) return;
      numEl.dataset.done = '1';
      countUp(numEl, Number(numEl.dataset.target));
    });
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -30px 0px',
});

revealEls.forEach(el => revealObserver.observe(el));

function countUp(el, target) {
  const duration = 1200;
  const step = target / (duration / 16);
  let current = 0;

  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(interval);
  }, 16);
}