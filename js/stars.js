/**
 * portfolio/js/stars.js
 * ─────────────────────────────────────────
 * Two canvas layers:
 *   1. #star-canvas   → 220 twinkling stars drifting upward
 *   2. #particles-canvas → 70 colored particles rising from bottom
 *      Colors: teal #00f5c4 · purple #7b5ea7 · blue #4d9ef7
 * ─────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════
     STAR FIELD
  ═══════════════════════════════════════ */
  const sc   = document.getElementById('star-canvas');
  if (!sc) return;
  const sctx = sc.getContext('2d');
  let stars  = [];
  let tick   = 0;

  function resizeSC() {
    sc.width  = window.innerWidth;
    sc.height = window.innerHeight;
  }
  resizeSC();
  window.addEventListener('resize', () => { resizeSC(); rebuildStars(); });

  function makeStar(randomY) {
    return {
      x:             Math.random() * sc.width,
      y:             randomY !== undefined ? randomY : Math.random() * sc.height,
      r:             Math.random() * 1.5 + 0.18,
      speed:         Math.random() * 0.28 + 0.04,
      baseOpacity:   Math.random() * 0.65 + 0.18,
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed:  Math.random() * 0.018 + 0.008
    };
  }

  function rebuildStars() {
    stars = Array.from({ length: 220 }, () => makeStar());
  }
  rebuildStars();

  function drawStars() {
    tick += 1;
    sctx.clearRect(0, 0, sc.width, sc.height);

    stars.forEach(s => {
      // Drift upward
      s.y -= s.speed;
      if (s.y < -4) {
        s.y = sc.height + 4;
        s.x = Math.random() * sc.width;
      }

      // Twinkle
      s.twinkleOffset += s.twinkleSpeed;
      const op = s.baseOpacity * (0.68 + 0.32 * Math.sin(s.twinkleOffset));

      sctx.beginPath();
      sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sctx.fillStyle = `rgba(255,255,255,${op})`;
      sctx.fill();
    });

    requestAnimationFrame(drawStars);
  }
  drawStars();

  /* ═══════════════════════════════════════
     FLOATING PARTICLES
  ═══════════════════════════════════════ */
  const pc   = document.getElementById('particles-canvas');
  if (!pc) return;
  const pctx = pc.getContext('2d');
  let particles = [];

  function resizePC() {
    pc.width  = window.innerWidth;
    pc.height = window.innerHeight;
  }
  resizePC();
  window.addEventListener('resize', resizePC);

  // Particle color bases (rgba prefix without closing paren)
  const PARTICLE_COLORS = [
    'rgba(0,245,196,',   // teal
    'rgba(123,94,167,',  // purple
    'rgba(77,158,247,',  // blue
  ];

  function makeParticle(startAtBottom) {
    const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    const maxLife = 240 + Math.random() * 300;
    return {
      x:        Math.random() * pc.width,
      y:        startAtBottom ? pc.height + Math.random() * 40 : Math.random() * pc.height,
      r:        Math.random() * 2.4 + 0.35,
      speedY:   Math.random() * 0.75 + 0.22,
      speedX:   (Math.random() - 0.5) * 0.32,
      opacity:  Math.random() * 0.45 + 0.08,
      color,
      life:     startAtBottom ? 0 : Math.random() * maxLife,
      maxLife
    };
  }

  // Seed initial particles scattered across screen
  for (let i = 0; i < 68; i++) particles.push(makeParticle(false));

  function drawParticles() {
    pctx.clearRect(0, 0, pc.width, pc.height);

    // Spawn new particles from bottom
    if (particles.length < 90 && Math.random() < 0.35) {
      particles.push(makeParticle(true));
    }

    particles = particles.filter(p => {
      p.y    -= p.speedY;
      p.x    += p.speedX;
      p.life += 1;

      // Fade in at start, fade out near end
      const fadeIn  = Math.min(1, p.life / 55);
      const fadeOut = Math.min(1, (p.maxLife - p.life) / 55);
      const alpha   = p.opacity * Math.min(fadeIn, fadeOut);

      pctx.beginPath();
      pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pctx.fillStyle = p.color + alpha + ')';
      pctx.fill();

      return p.life < p.maxLife && p.y > -12;
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();
