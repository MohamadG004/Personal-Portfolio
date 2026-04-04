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
   PROJECTS — 3D tilt + FLIP modal
═══════════════════════════════════════════ */

const projCards = document.querySelectorAll('.proj-card');

// ── Staggered entrance ──
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.setProperty('--delay', `${i * 0.08}s`);
      entry.target.classList.add('in-view');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

projCards.forEach(card => {
  cardObserver.observe(card);

  // Add "View project" hint element
  const hint = document.createElement('div');
  hint.className = 'proj-card-hint';
  hint.innerHTML = 'View project <span>→</span>';
  card.querySelector('.proj-card-content').appendChild(hint);
});

// ── 3D mouse-follow tilt ──
projCards.forEach(card => {
  card.addEventListener('mousemove', handleTilt);
  card.addEventListener('mouseleave', resetTilt);
});

function handleTilt(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (rect.width / 2);   // -1 → +1
  const dy = (e.clientY - cy) / (rect.height / 2);  // -1 → +1

  const rotX = -dy * 11;
  const rotY =  dx * 11;

  card.style.transition = 'box-shadow 0.5s, border-color 0.35s';
  card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px) scale(1.025)`;
}

function resetTilt(e) {
  const card = e.currentTarget;
  card.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s, border-color 0.35s';
  card.style.transform = '';
}

// ── Modal ──
const overlay    = document.getElementById('projModalOverlay');
const modal      = document.getElementById('projModal');
const closeBtn   = document.getElementById('projModalClose');
const modalImg   = document.getElementById('projModalImg');
const modalTitle = document.getElementById('projModalTitle');
const modalDesc  = document.getElementById('projModalDesc');
const modalTags  = document.getElementById('projModalTags');
const modalLink  = document.getElementById('projModalLink');

let activeCard      = null;
let modalAnimation  = null;

function openModal(card) {
  const { title, desc, tags, img, link } = card.dataset;

  modalImg.src           = img   || '';
  modalImg.alt           = title || '';
  modalTitle.textContent = title || '';
  modalDesc.textContent  = desc  || '';

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

  activeCard = card;

  // Record card's position BEFORE showing overlay
  const cardRect = card.getBoundingClientRect();

  // Show overlay (fades in via CSS)
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Reset any leftover transform from a previous close
  modal.style.transition = 'none';
  modal.style.transform  = 'none';
  modal.style.opacity    = '1';

  // FLIP: wait one frame so the modal is at its final centered position,
  // then compute the inversion transform and animate to identity.
  requestAnimationFrame(() => {
    const modalRect = card.getBoundingClientRect(); // reuse to avoid reflow cost

    // Get modal's actual rendered position
    const mRect = modal.getBoundingClientRect();

    // Scale factors (card size → modal size)
    const scaleX = cardRect.width  / mRect.width;
    const scaleY = cardRect.height / mRect.height;

    // Translation (card center → modal center)
    const cardCX  = cardRect.left + cardRect.width  / 2;
    const cardCY  = cardRect.top  + cardRect.height / 2;
    const modalCX = mRect.left    + mRect.width     / 2;
    const modalCY = mRect.top     + mRect.height    / 2;
    const dx = cardCX - modalCX;
    const dy = cardCY - modalCY;

    // Start modal visually at card position (inverted FLIP)
    modal.style.transition = 'none';
    modal.style.transform  = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    modal.style.opacity    = '0.2';

    // Force reflow so the browser registers the start state
    modal.offsetHeight;

    // Animate to centered final state
    modal.style.transition = 'transform 0.52s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.38s cubic-bezier(0.22, 1, 0.36, 1)';
    modal.style.transform  = 'translate(0, 0) scale(1)';
    modal.style.opacity    = '1';
  });
}

function closeModal() {
  if (!activeCard) {
    _finishClose();
    return;
  }

  const cardRect = activeCard.getBoundingClientRect();
  const mRect    = modal.getBoundingClientRect();

  const scaleX = cardRect.width  / mRect.width;
  const scaleY = cardRect.height / mRect.height;
  const dx     = (cardRect.left + cardRect.width  / 2) - (mRect.left + mRect.width  / 2);
  const dy     = (cardRect.top  + cardRect.height / 2) - (mRect.top  + mRect.height / 2);

  modal.style.transition = 'transform 0.42s cubic-bezier(0.55, 0, 0.45, 1), opacity 0.32s';
  modal.style.transform  = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
  modal.style.opacity    = '0';

  overlay.classList.remove('open');

  setTimeout(_finishClose, 430);
}

function _finishClose() {
  overlay.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  modal.style.transform = '';
  modal.style.opacity   = '';
  modal.style.transition = '';
  activeCard = null;
}

projCards.forEach(card => card.addEventListener('click', () => openModal(card)));
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });