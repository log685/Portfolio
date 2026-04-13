/* canvas-bg.js — Aurora Glass Interactive Layer */
(function () {
  /* ── CUSTOM CURSOR ──────────────────────────── */
  const ring = document.createElement('div');
  const dot  = document.createElement('div');
  ring.className = 'cursor-ring';
  dot.className  = 'cursor-dot';
  document.body.append(ring, dot);

  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animateCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  })();

  /* ── AURORA BACKGROUND ──────────────────────── */
  const wrap = document.createElement('div');
  wrap.className = 'aurora-wrap';
  ['blob-1','blob-2','blob-3','blob-4'].forEach(cls => {
    const b = document.createElement('div');
    b.className = 'aurora-blob ' + cls;
    wrap.appendChild(b);
  });

  // Grain overlay
  const grain = document.createElement('div');
  grain.className = 'grain';
  wrap.appendChild(grain);

  document.body.insertBefore(wrap, document.body.firstChild);

  /* ── MAGNETIC BUTTONS ───────────────────────── */
  function initMagnetic() {
    document.querySelectorAll('.btn, .nav-links a, .nav-logo').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }
  initMagnetic();

  /* ── SCROLL REVEAL ──────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── SKILL BARS ─────────────────────────────── */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
          setTimeout(() => bar.style.width = bar.dataset.width + '%', 200 + i * 80);
        });
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-panel, .skills-section').forEach(p => skillObs.observe(p));

  /* ── ACTIVE NAV ─────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
    navLinks.forEach(a => a.classList.toggle('active',
      a.getAttribute('href').includes(current) && current !== ''));
  }, { passive: true });

  /* ── 3D TILT CARDS ──────────────────────────── */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── NUMBER COUNT-UP ────────────────────────── */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const isFloat = !Number.isInteger(target);
      let start = null;
      const dur = 1600;
      function step(ts) {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 4);
        const val = target * ease;
        el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if (prog < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

  /* ── PARALLAX HERO ──────────────────────────── */
  const heroTitle = document.querySelector('.hero-name');
  if (heroTitle) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroTitle.style.transform = `translateY(${y * 0.18}px)`;
      heroTitle.style.opacity = 1 - y / 500;
    }, { passive: true });
  }

  /* ── HOVER GLOW FOLLOW ──────────────────────── */
  document.querySelectorAll('.glow-follow').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty('--gx', x + 'px');
      card.style.setProperty('--gy', y + 'px');
    });
  });

})();
