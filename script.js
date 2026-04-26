/* ============================================================
   SCRIPT.JS — Flore | UGC Creator Personal Website
   ============================================================ */

'use strict';

/* ======================== CURSOR ======================== */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }

  animateRing();

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ======================== NAV HIDE/SHOW ON SCROLL ======================== */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastY    = 0;
  let ticking  = false;

  function handleScroll() {
    const y = window.scrollY;

    if (y > lastY && y > 80) {
      nav.classList.add('hidden');
      nav.classList.remove('visible');
    } else {
      nav.classList.remove('hidden');
      nav.classList.add('visible');
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });
})();

/* ======================== NAV BURGER (MOBILE) ======================== */
(function initBurger() {
  const burger = document.getElementById('navBurger');
  const links  = document.querySelector('.nav__links');
  if (!burger || !links) return;

  let open = false;

  burger.addEventListener('click', () => {
    open = !open;
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';

    const spans = burger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on link click
  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      open = false;
      links.classList.remove('open');
      document.body.style.overflow = '';
      const spans = burger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();

/* ======================== SCROLL REVEAL ======================== */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
})();

/* ======================== COUNTER ANIMATION ======================== */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    let startTime  = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ======================== PORTFOLIO FILTER ======================== */
(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const grid       = document.getElementById('portfolioGrid');

  if (!filterBtns.length || !grid) return;

  const items = grid.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // Animate items
      items.forEach(item => {
        const category = item.dataset.category;

        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

/* ======================== PARALLAX HERO GLOW ======================== */
(function initParallax() {
  const glow = document.querySelector('.hero__glow');
  if (!glow) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    glow.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
})();

/* ======================== SMOOTH ANCHOR SCROLL ======================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ======================== HERO ENTRANCE ANIMATION ======================== */
(function initHeroEntrance() {
  // Force reveal for hero items (already on screen)
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 100 + i * 80);
    });
  });
})();
