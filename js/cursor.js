/**
 * portfolio/js/cursor.js
 * ─────────────────────────────────────────
 * Custom magnetic cursor:
 *   - #cursor-dot  → follows mouse exactly
 *   - #cursor-ring → lags behind with lerp interpolation
 *   - body.cursor-hover → applied on interactive elements
 *   - Magnetic effect on nav links
 * ─────────────────────────────────────────
 */

(function () {
  'use strict';

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return; // guard: exit if elements missing

  let mx = window.innerWidth  / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;

  const LERP_FACTOR = 0.12; // ring lag — smaller = more lag

  // Track actual mouse position
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Hide when mouse leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '0.6';
  });

  // Animation loop — dot snaps, ring lerps
  function animateCursor() {
    // Dot follows instantly
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    // Ring lerps toward mouse
    rx += (mx - rx) * LERP_FACTOR;
    ry += (my - ry) * LERP_FACTOR;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // ── Hover State ──────────────────────────────────────────
  const HOVER_SELECTOR = [
    'a', 'button',
    '.tag', '.stat-card', '.glass-card', '.skill-card',
    '.project-row', '.proj-featured-card',
    '.side-dot',
    'input', 'textarea', 'select',
    '.btn', '.social-link',
    '[data-expandable]',
    '.nav-logo', '.float-badge'
  ].join(', ');

  // Use event delegation for better performance
  document.addEventListener('mouseover', e => {
    if (e.target.closest(HOVER_SELECTOR)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(HOVER_SELECTOR)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // ── Magnetic Nav Links ────────────────────────────────────
  function applyMagnetic(selector, strength) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mousemove', e => {
        const r  = el.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  applyMagnetic('.nav-links a', 0.22);
  applyMagnetic('.nav-logo',    0.12);
})();
