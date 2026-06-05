/**
 * portfolio/js/main.js
 * ─────────────────────────────────────────
 * Shared page logic:
 *   - Scroll reveal (IntersectionObserver adds .visible to .reveal)
 *   - Mobile nav toggle (hamburger ↔ X, drawer slide)
 *   - Side nav dots (highlight active section on scroll)
 *   - Skill progress bar animation (data-width → actual width)
 *   - Project row accordion (click to expand .proj-expand)
 *   - Stat number counter animation (data-count)
 *   - Contact form submission (simulated)
 *   - Nav border intensity on scroll
 * ─────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────
     1. SCROLL REVEAL
  ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal so it doesn't flicker back
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold:  0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // Immediately reveal first-page hero elements (no scroll needed)
  (function revealHero() {
    const heroSection = document.querySelector('.hero-section, #hero');
    if (!heroSection) return;
    const heroReveals = heroSection.querySelectorAll('.reveal');
    heroReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 80 + i * 130);
    });
  })();

  /* ─────────────────────────────────────
     2. MOBILE NAV TOGGLE
  ───────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      navMobile.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close drawer when a link is clicked
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMobile.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close drawer on outside click
    document.addEventListener('click', e => {
      if (navMobile.classList.contains('open') &&
          !navMobile.contains(e.target) &&
          !navToggle.contains(e.target)) {
        navToggle.classList.remove('open');
        navMobile.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ─────────────────────────────────────
     3. SIDE NAV DOTS
  ───────────────────────────────────── */
  const sideDots = document.querySelectorAll('.side-dot[data-section]');

  if (sideDots.length) {
    const sectionIds = Array.from(sideDots).map(d => d.dataset.section);

    function getActiveSection() {
      let active = sectionIds[0];
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.5) active = id;
      });
      return active;
    }

    function updateSideNav() {
      const active = getActiveSection();
      sideDots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.section === active);
      });
    }

    window.addEventListener('scroll', updateSideNav, { passive: true });
    updateSideNav();

    // Click to scroll to section
    sideDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const target = document.getElementById(dot.dataset.section);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ─────────────────────────────────────
     4. SKILL PROGRESS BARS
     Triggered when .progress-fill enters viewport
  ───────────────────────────────────── */
  const fills = document.querySelectorAll('.progress-fill[data-width]');

  if (fills.length) {
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill  = entry.target;
          const width = fill.dataset.width || '70%';
          // Small delay so CSS transition is visible
          setTimeout(() => { fill.style.width = width; }, 120);
          barObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.4 });

    fills.forEach(f => barObserver.observe(f));
  }

  /* ─────────────────────────────────────
     5. PROJECT ROW ACCORDION
  ───────────────────────────────────── */
  document.querySelectorAll('.project-row[data-expandable]').forEach(row => {
    const expand = row.querySelector('.proj-expand');
    const arrow  = row.querySelector('.proj-arrow');

    if (!expand) return;

    row.addEventListener('click', () => {
      const isOpen = expand.classList.toggle('open');
      row.classList.toggle('expanded', isOpen);
      if (arrow) {
        arrow.textContent = isOpen ? '↓' : '→';
      }
    });

    // Keyboard accessibility
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');
    row.setAttribute('aria-expanded', 'false');
    row.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        row.click();
        row.setAttribute('aria-expanded', expand.classList.contains('open'));
      }
    });
  });

  /* ─────────────────────────────────────
     6. STAT COUNTER ANIMATION
     Usage: <span class="stat-number" data-count="42" data-suffix="+">42+</span>
  ───────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-number[data-count]');

  if (counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let   current = 0;
        const duration = 1000; // ms
        const steps    = 50;
        const step     = Math.ceil(target / steps);
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(interval);
        }, duration / steps);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.6 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ─────────────────────────────────────
     7. CONTACT FORM (simulated submit)
  ───────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const original  = submitBtn.textContent;

      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;

      setTimeout(() => {
        submitBtn.textContent    = 'Sent! ✓';
        submitBtn.style.background = 'var(--purple)';
        submitBtn.style.boxShadow  = '0 0 20px var(--purple-glow)';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.textContent    = original;
          submitBtn.disabled       = false;
          submitBtn.style.background = '';
          submitBtn.style.boxShadow  = '';
        }, 3500);
      }, 1200);
    });
  }

  /* ─────────────────────────────────────
     8. NAV BORDER INTENSITY ON SCROLL
  ───────────────────────────────────── */
  const navEl = document.querySelector('nav');
  if (navEl) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navEl.style.borderBottomColor = 'rgba(0,245,196,0.28)';
        navEl.style.background        = 'rgba(2,8,24,0.92)';
      } else {
        navEl.style.borderBottomColor = '';
        navEl.style.background        = '';
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────
     9. SMOOTH SCROLL FOR ANCHOR LINKS
  ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id  = a.getAttribute('href').slice(1);
      const el  = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
