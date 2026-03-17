/* ═══════════════════════════════════════════════════════════════════════
   scripts.js — Mohamad Ghattas Portfolio
   Features:
     · Animated loader with fake progress
     · Custom cursor (dot + smooth-follow ring)
     · Particle canvas with mouse repulsion + line connections
     · Typewriter effect (cycling phrases)
     · Scroll progress bar
     · Navbar auto-scroll style + active link tracking
     · Hamburger mobile drawer
     · IntersectionObserver reveal animations
     · Animated count-up stats
     · Skill bar animations
     · 3D tilt effect on project cards
     · Magnetic button effect
     · Auto-running terminal simulation
     · Live clock (nav + footer)
     · Konami code → Matrix rain Easter egg
═══════════════════════════════════════════════════════════════════════ */

/* ══ CLOCK ══ */
function tick() {
  const t = new Date().toLocaleTimeString();
  const a = document.getElementById("clock");
  const b = document.getElementById("navClock");
  if (a) a.textContent = t;
  if (b) b.textContent = t;
}
setInterval(tick, 1000);
tick();

/* ══ LOADER ══ */
(function () {
  const msgs = [
    "BOOTING SYSTEM...",
    "LOADING ASSETS...",
    "COMPILING EXPERIENCE...",
    "RENDERING INTERFACE...",
    "READY."
  ];
  const bar  = document.getElementById("loaderBar");
  const msg  = document.getElementById("loaderMsg");
  const ldr  = document.getElementById("loader");
  document.body.style.overflow = "hidden";

  let pct = 0, mi = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 14 + 4;
    if (pct > 100) pct = 100;
    bar.style.width = pct + "%";
    const newMi = Math.floor((pct / 100) * msgs.length);
    if (newMi !== mi && newMi < msgs.length) { mi = newMi; msg.textContent = msgs[mi]; }
    if (pct >= 100) {
      clearInterval(iv);
      msg.textContent = "READY.";
      setTimeout(() => {
        ldr.classList.add("out");
        document.body.style.overflow = "";
        afterLoad();
      }, 450);
    }
  }, 75);
})();

function afterLoad() {
  initTypewriter();
  initParticles();
  initReveal();
  initTerminal();
}

/* ══ CUSTOM CURSOR ══ */
const dot   = document.getElementById("cur-dot");
const ring  = document.getElementById("cur-ring");
let mX = -100, mY = -100, rX = -100, rY = -100;

document.addEventListener("mousemove", e => {
  mX = e.clientX; mY = e.clientY;
  dot.style.left = mX + "px";
  dot.style.top  = mY + "px";
});

(function loopRing() {
  rX += (mX - rX) * 0.11;
  rY += (mY - rY) * 0.11;
  ring.style.left = rX + "px";
  ring.style.top  = rY + "px";
  requestAnimationFrame(loopRing);
})();

document.querySelectorAll(
  "a, button, .sk-card, .proj-card, .c-link, .chip"
).forEach(el => {
  el.addEventListener("mouseenter", () => document.body.classList.add("ch"));
  el.addEventListener("mouseleave", () => document.body.classList.remove("ch"));
});

/* ══ SCROLL PROGRESS ══ */
const prog = document.getElementById("prog-bar");
window.addEventListener("scroll", () => {
  const dH = document.documentElement.scrollHeight - window.innerHeight;
  prog.style.width = (window.scrollY / dH * 100) + "%";
  checkNav();
  updateActive();
}, { passive: true });

/* ══ NAVBAR SOLID ══ */
const nav = document.getElementById("nav");
function checkNav() {
  nav.classList.toggle("solid", window.scrollY > 40);
}

/* ══ ACTIVE NAV LINKS ══ */
const nls = document.querySelectorAll(".nl");
const secs = document.querySelectorAll("section[id]");
function updateActive() {
  let cur = "";
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 220) cur = s.id; });
  nls.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
}

/* ══ HAMBURGER ══ */
const burger  = document.getElementById("burger");
const mobMenu = document.getElementById("mobMenu");
burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  mobMenu.classList.toggle("open");
});
document.querySelectorAll(".mob-link").forEach(l =>
  l.addEventListener("click", () => {
    burger.classList.remove("open");
    mobMenu.classList.remove("open");
  })
);

/* ══ TYPEWRITER ══ */
function initTypewriter() {
  const phrases = [
    "scalable systems.",
    "elegant interfaces.",
    "robust back-ends.",
    "clean, readable code.",
    "innovative solutions.",
    "great software."
  ];
  const el = document.getElementById("typeText");
  let pi = 0, ci = 0, del = false;

  function step() {
    const ph = phrases[pi];
    if (!del) {
      el.textContent = ph.slice(0, ++ci);
      if (ci === ph.length) { del = true; return setTimeout(step, 2200); }
    } else {
      el.textContent = ph.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(step, del ? 48 : 85);
  }
  step();
}

/* ══ PARTICLE CANVAS ══ */
function initParticles() {
  const cv  = document.getElementById("particleCanvas");
  const ctx = cv.getContext("2d");
  let W, H;
  const mouse = { x: -9999, y: -9999 };
  const COLORS = ["#00f5d4", "#00f5d4", "#00f5d4", "#ff2d78"];

  function resize() {
    W = cv.width  = window.innerWidth;
    H = cv.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  class P {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .45;
      this.vy = (Math.random() - .5) * .45;
      this.r  = Math.random() * 1.4 + .4;
      this.a  = Math.random() * .5 + .12;
      this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d  = Math.hypot(dx, dy);
      if (d < 130) {
        const f = (130 - d) / 130;
        this.x += (dx / d) * f * 2.2;
        this.y += (dy / d) * f * 2.2;
      }
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col;
      ctx.globalAlpha = this.a;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  const pts = Array.from({ length: 130 }, () => new P());

  function lines() {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 110) {
          ctx.beginPath();
          ctx.strokeStyle = "#00f5d4";
          ctx.globalAlpha = (1 - d / 110) * .09;
          ctx.lineWidth = .5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => { p.update(); p.draw(); });
    lines();
    requestAnimationFrame(frame);
  }
  frame();
}

/* ══ SCROLL REVEAL + COUNTERS + SKILL BARS ══ */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("in");   // triggers rv-* CSS
      io.unobserve(el);

      // stat counter
      const numEl = el.querySelector(".stat-n");
      if (numEl && !numEl.dataset.done) {
        numEl.dataset.done = "1";
        countUp(numEl, +numEl.dataset.target);
      }

      // skill bar
      const fill = el.querySelector(".sk-fill");
      if (fill) {
        setTimeout(() => { fill.style.width = fill.dataset.w + "%"; }, 180);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".rv-up, .rv-left, .rv-right, .sk-card").forEach(el => io.observe(el));
}

function countUp(el, target) {
  const dur = 1400;
  const step = target / (dur / 16);
  let cur = 0;
  const iv = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(iv); }
    el.textContent = Math.floor(cur);
  }, 16);
}

/* ══ 3D TILT ══ */
document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r  = card.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - .5;
    const y  = (e.clientY - r.top)  / r.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(12px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform .6s cubic-bezier(.23,1,.32,1)";
    card.style.transform  = "perspective(700px) rotateY(0) rotateX(0) translateZ(0)";
    setTimeout(() => card.style.transition = "", 600);
  });
});

/* ══ MAGNETIC BUTTONS ══ */
document.querySelectorAll(".mag").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * .32;
    const y = (e.clientY - r.top  - r.height / 2) * .32;
    btn.style.transform  = `translate(${x}px, ${y}px)`;
    btn.style.transition = "transform .1s";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform  = "translate(0,0)";
    btn.style.transition = "transform .6s cubic-bezier(.23,1,.32,1)";
  });
});

/* ══ TERMINAL ══ */
function initTerminal() {
  const db = {
    "./whoami": [
      { t: "Mohamad Ghattas",                           cls: "ok"  },
      { t: "Software Engineering Student @ UCalgary",   cls: "ok"  },
      { t: "4th Year  ·  Calgary, AB, Canada",          cls: "ok"  }
    ],
    "./skills": [
      { t: "Languages : Python, Java, C, C++, JS, HTML, CSS, SQL", cls: "ok" },
      { t: "Frameworks: React, Node.js",                            cls: "ok" },
      { t: "Tools     : Git, VS Code, IntelliJ IDEA",              cls: "ok" }
    ],
    "./projects": [
      { t: "[01] Movie Theatre Ticket Reservation — Java + SQL", cls: "ok" },
      { t: "[02] Disaster Victims Management System — Java",     cls: "ok" },
      { t: "[03] E-Commerce Website — HTML/CSS/JS",              cls: "ok" },
      { t: "[04] Flight Menu Application — C++",                 cls: "ok" },
      { t: "[05] Museum Management System — Python + SQL",       cls: "ok" }
    ],
    "./contact": [
      { t: "Email   : mohamadghattas04@gmail.com",                   cls: "ok" },
      { t: "LinkedIn: linkedin.com/in/mohamad-ghattas-1b0613331/",   cls: "ok" },
      { t: "GitHub  : github.com/MohamadG04",                        cls: "ok" }
    ],
    "./status": [
      { t: "✔  Available for internships & opportunities",    cls: "ok" },
      { t: "✔  Open to collaborations",                       cls: "ok" },
      { t: "✔  Always learning something new",                cls: "ok" }
    ]
  };
  const queue = ["./whoami", "./skills", "./projects", "./contact", "./status"];
  let qi = 0;

  const cmdEl  = document.getElementById("tCmd");
  const outEl  = document.getElementById("tOut");
  const body   = document.getElementById("termBody");

  function run() {
    const cmd = queue[qi % queue.length];
    qi++;
    typeCmd(cmd, () => {
      // echo the command
      const echo = document.createElement("div");
      echo.className = "t-out t-echo";
      echo.innerHTML = `<span class="t-pr" style="font-size:.72rem">visitor@mg-portfolio:~$</span> ${cmd}`;
      outEl.appendChild(echo);
      cmdEl.textContent = "";

      const lines = db[cmd] || [{ t: "command not found", cls: "err" }];
      let li = 0;
      const iv = setInterval(() => {
        if (li >= lines.length) {
          clearInterval(iv);
          const sp = document.createElement("div");
          sp.className = "t-spacer";
          outEl.appendChild(sp);
          body.scrollTop = 9999;
          // keep a rolling window — clear old output if too many lines
          if (outEl.children.length > 60) {
            while (outEl.children.length > 40) outEl.removeChild(outEl.firstChild);
          }
          setTimeout(run, 2200);
          return;
        }
        const d = document.createElement("div");
        d.className = `t-out ${lines[li].cls}`;
        d.textContent = lines[li].t;
        outEl.appendChild(d);
        li++;
        body.scrollTop = 9999;
      }, 140);
    });
  }

  function typeCmd(str, cb) {
    cmdEl.textContent = "";
    let i = 0;
    const iv = setInterval(() => {
      cmdEl.textContent += str[i++];
      if (i >= str.length) { clearInterval(iv); setTimeout(cb, 300); }
    }, 65);
  }

  run();
}

/* ══ KONAMI CODE → MATRIX ══ */
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let ki = 0, koTimer;

document.addEventListener("keydown", e => {
  if (e.key === KONAMI[ki]) {
    ki++;
    clearTimeout(koTimer);
    koTimer = setTimeout(() => { ki = 0; }, 2000);
    if (ki === KONAMI.length) {
      ki = 0;
      openMatrix();
    }
  } else {
    ki = 0;
  }
  if (e.key === "Escape") closeMatrix();
});

const matOverlay = document.getElementById("matrixOverlay");
const matCanvas  = document.getElementById("matrixCanvas");
let matRAF;

function openMatrix() {
  matOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  runMatrix();
}
function closeMatrix() {
  matOverlay.classList.add("hidden");
  document.body.style.overflow = "";
  cancelAnimationFrame(matRAF);
}

function runMatrix() {
  const ctx = matCanvas.getContext("2d");
  matCanvas.width  = window.innerWidth;
  matCanvas.height = window.innerHeight;
  const W = matCanvas.width, H = matCanvas.height;
  const sz   = 14;
  const cols = Math.floor(W / sz);
  const drops = Array(cols).fill(1);
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\".split("");

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#00ff41";
    ctx.font = `${sz}px monospace`;
    drops.forEach((y, i) => {
      const c = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(c, i * sz, y * sz);
      if (y * sz > H && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    });
    if (!matOverlay.classList.contains("hidden")) matRAF = requestAnimationFrame(draw);
  }
  draw();
}

/* ══ CLICK RIPPLE ══ */
document.addEventListener("click", e => {
  if (e.target.closest(".cta-primary, .cta-ghost, .c-link")) return;
  const r = document.createElement("div");
  r.style.cssText = `
    position:fixed; border-radius:50%;
    width:6px; height:6px;
    pointer-events:none; z-index:9997;
    left:${e.clientX}px; top:${e.clientY}px;
    transform:translate(-50%,-50%) scale(1);
    border:1px solid rgba(0,245,212,.7);
    animation:rippleOut .6s ease forwards;
  `;
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 620);
});

/* inject ripple keyframe once */
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
  @keyframes rippleOut {
    to { transform:translate(-50%,-50%) scale(28); opacity:0; }
  }
`;
document.head.appendChild(rippleStyle);