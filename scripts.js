function tick() {
  const el = document.getElementById('clock');
  if (el) el.textContent = new Date().toLocaleTimeString();
}
setInterval(tick, 1000);
tick();

const prog = document.getElementById('prog');
window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;

  if (prog) prog.style.width = (scrolled / total * 100) + '%';

  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('scrolled', scrolled > 50);

  updateActiveLink(scrolled);
}

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

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);

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

/* ═══════════════════════════════════════════
   PROJECTS — accordion + modal
═══════════════════════════════════════════ */

// ── Staggered entrance ──
const projCards = document.querySelectorAll('.proj-card');

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.setProperty('--delay', `${i * 0.06}s`);
      entry.target.classList.add('in-view');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

projCards.forEach(card => cardObserver.observe(card));


// ── Modal ──
const overlay    = document.getElementById('projModalOverlay');
const closeBtn   = document.getElementById('projModalClose');
const modalImg   = document.getElementById('projModalImg');
const modalTitle = document.getElementById('projModalTitle');
const modalDesc  = document.getElementById('projModalDesc');
const modalTags  = document.getElementById('projModalTags');
const modalLink  = document.getElementById('projModalLink');

function openModal(card) {
  const { title, desc, tags, img, link } = card.dataset;

  modalImg.src             = img   || '';
  modalImg.alt             = title || '';
  modalTitle.textContent   = title || '';
  modalDesc.textContent    = desc  || '';

  modalTags.innerHTML = '';
  (tags || '').split(',').forEach(tag => {
    const span = document.createElement('span');
    span.className   = 'proj-tag';
    span.textContent = tag.trim();
    modalTags.appendChild(span);
  });

  if (link) {
    modalLink.href = link;
    modalLink.classList.remove('hidden');
  } else {
    modalLink.classList.add('hidden');
  }

  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

projCards.forEach(card => card.addEventListener('click', () => openModal(card)));
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });