/* ============================================
   INACOIN S.A.C. — Dynamic Interactions v3
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ──────────────────────────────────────────
     1. HERO IMAGE SLIDER + Ken Burns
     ────────────────────────────────────────── */
  const Slider = (() => {
    const slides = document.querySelectorAll('.hero__slide');
    const dots = document.querySelectorAll('.hero__dot');
    let current = 0;
    let timer = null;
    const INTERVAL = 5500;

    function go(idx) {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
        const img = s.querySelector('img');
        if (img) {
          img.style.animation = 'none';
          void img.offsetWidth;
          img.style.animation = '';
        }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      current = idx;
    }

    function next() { go((current + 1) % slides.length); }

    function start() { timer = setInterval(next, INTERVAL); }

    function init() {
      if (slides.length === 0) return;
      go(0);
      start();
      dots.forEach((d, i) => {
        d.addEventListener('click', () => {
          clearInterval(timer);
          go(i);
          start();
        });
      });
    }

    return { init };
  })();

  Slider.init();

  /* ──────────────────────────────────────────
     2. HEADER SCROLL + PROGRESS BAR
     ────────────────────────────────────────── */
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scroll-top');

  // Progress bar
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position:fixed;top:0;left:0;height:3px;z-index:1001;
    background:linear-gradient(90deg,#60A5FA,#F59E0B);
    border-radius:0 2px 2px 0;transition:width .15s linear;width:0;
  `;
  document.body.appendChild(progressBar);

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('header--scrolled', y > 60);
    scrollTopBtn.classList.toggle('visible', y > 500);

    // Progress
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = maxScroll > 0 ? (y / maxScroll) * 100 + '%' : '0';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ──────────────────────────────────────────
     3. MOBILE MENU
     ────────────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('active');
    navMenu.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ──────────────────────────────────────────
     4. ACTIVE NAV HIGHLIGHT
     ────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function highlightNav() {
    const scrollY = window.scrollY + 220;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => {
          l.classList.toggle('nav__link--active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ──────────────────────────────────────────
     5. SCROLL REVEAL
     ────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  /* ──────────────────────────────────────────
     6. ANIMATED COUNTERS (easeOutExpo)
     ────────────────────────────────────────── */
  function animateCounter(el) {
    const raw = el.getAttribute('data-target') || el.textContent;
    const num = parseInt(raw, 10);
    if (isNaN(num)) return;
    const suffix = raw.replace(/[0-9]/g, '');
    const duration = 2200;
    const fps = 60;
    const totalFrames = Math.round(duration / (1000 / fps));
    let frame = 0;
    el.textContent = '0' + suffix;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function tick() {
      frame++;
      const progress = easeOutExpo(frame / totalFrames);
      el.textContent = Math.round(num * progress) + suffix;
      if (frame < totalFrames) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = num + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          counterObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counterEls.forEach(el => counterObserver.observe(el));

  /* ──────────────────────────────────────────
     7. 3D TILT ON SERVICE CARDS
     ────────────────────────────────────────── */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* ──────────────────────────────────────────
     8. MAGNETIC BUTTONS
     ────────────────────────────────────────── */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  /* ──────────────────────────────────────────
     9. PARALLAX
     ────────────────────────────────────────── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  if (parallaxEls.length) {
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* ──────────────────────────────────────────
     10. SMOOTH ANCHOR LINKS
     ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76;
        window.scrollTo({ top: target.offsetTop - headerH, behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────────────
     11. RIPPLE ON BUTTONS
     ────────────────────────────────────────── */
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `@keyframes rippleAnim{to{transform:scale(2.5);opacity:0}}`;
  document.head.appendChild(rippleStyle);

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;border-radius:50%;
        background:rgba(255,255,255,.2);
        left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;
        transform:scale(0);animation:rippleAnim .6s ease-out forwards;pointer-events:none;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ──────────────────────────────────────────
     12. CURSOR GLOW (desktop only)
     ────────────────────────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:fixed;width:320px;height:320px;border-radius:50%;pointer-events:none;z-index:0;
      background:radial-gradient(circle,rgba(59,130,246,.05),transparent 70%);
      transform:translate(-50%,-50%);
      transition:left .35s cubic-bezier(.16,1,.3,1),top .35s cubic-bezier(.16,1,.3,1);
    `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  /* ──────────────────────────────────────────
     13. CLIENT LOGO CAROUSEL — Pause on hover
     ────────────────────────────────────────── */
  const carousel = document.getElementById('clients-carousel');
  if (carousel) {
    // Carousel is handled by CSS animation (scrollLogos)
    // Add mouse pause behavior
    carousel.addEventListener('mouseenter', () => {
      carousel.style.animationPlayState = 'paused';
    });
    carousel.addEventListener('mouseleave', () => {
      carousel.style.animationPlayState = 'running';
    });
  }

  /* ──────────────────────────────────────────
     14. STATS BAR — Staggered reveal
     ────────────────────────────────────────── */
  const statItems = document.querySelectorAll('.clients__stat-item');
  const statObserver = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const items = e.target.querySelectorAll('.clients__stat-item');
          items.forEach((item, i) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, i * 150);
          });
          statObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsBar = document.querySelector('.clients__stats-bar');
  if (statsBar) {
    statItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'all .7s cubic-bezier(.16,1,.3,1)';
    });
    statObserver.observe(statsBar);
  }

  console.log('🏗️ INACOIN S.A.C. — All dynamic modules loaded.');
});
