/**
 * Adimara — Snap-scroll mechanics
 *
 * Straight port of reference.html's <script> — the one that was working.
 * No per-layer animations, no idle scale, no pile-up reset. Just the snap.
 *
 * Spec (LOCKED — from reference.html):
 *   DURATION 0.75s, EASE power2.out
 *   Scroll DOWN: outgoing yPercent -30 + scale 0.95 + opacity 0.4 + incoming yPercent 100→0
 *   Scroll UP:   reverse
 *   Lock input during transition
 *   Inputs: wheel, touch (50px swipe), arrow keys, Space, dot click, nav links
 *
 * Additions over reference.html (necessary for our build, NOT touching the snap):
 *   1. Slow background videos to 0.5x for a dreamier loop
 *   2. Burger menu open/close
 *   3. Nav links (data-go) jump to panels
 */

import { gsap } from 'gsap';

const DURATION = 0.75;
const EASE = 'power2.out';
const WHEEL_THRESHOLD = 5;
const TOUCH_THRESHOLD = 50;

const panels = gsap.utils.toArray('.panel');
const dots = gsap.utils.toArray('.dot');

let current = 0;
let isAnimating = false;

/* Initial state — only the first panel visible */
gsap.set(panels, { yPercent: (i) => (i === 0 ? 0 : 100) });

/* Per-layer playback rates.
   Pyramid bg-video runs faster (0.75x) so the gold light-channels in the
   temples have visible flicker/breathing motion instead of feeling frozen.
   Cloud-sky overlay runs much slower (0.3x) so the cloud drift feels meditative
   and doesn't compete with the pyramid motion. */
document.querySelectorAll('.panel-bg-video').forEach((v) => {
  v.playbackRate = 0.75;
});
document.querySelectorAll('.panel-cloud-sky').forEach((v) => {
  v.playbackRate = 0.3;
});

/* Panel 3 — sync the cloud-sky overlay's fade-in with the video midpoint
   ("when the camera passes the palm trees"). Without this, clouds are
   visible from the start and break the moment of revelation. */
const p3Panel = document.querySelector('.panel.p3');
if (p3Panel) {
  const p3Video = p3Panel.querySelector('.panel-bg-video');
  const p3Cloud = p3Panel.querySelector('.panel-cloud-sky');
  if (p3Video && p3Cloud) {
    /* Show clouds from t=2.4s onward (raw video time — at 0.75x playback this
       is the visible midpoint where the camera is past the palm trees).
       Hide briefly at the loop wrap so the fade-in re-fires next cycle. */
    p3Video.addEventListener('timeupdate', () => {
      const t = p3Video.currentTime;
      if (t >= 2.4 && t < 5.0) {
        p3Cloud.classList.add('visible');
      } else if (t < 0.4) {
        p3Cloud.classList.remove('visible');
      }
    });
  }
}

function go(targetIndex) {
  if (isAnimating) return;
  if (targetIndex === current) return;
  if (targetIndex < 0 || targetIndex >= panels.length) return;

  isAnimating = true;
  const direction = targetIndex > current ? 1 : -1;
  const outgoing = panels[current];
  const incoming = panels[targetIndex];

  gsap.set(incoming, {
    yPercent: direction === 1 ? 100 : -100,
    scale: 1,
    opacity: 1,
  });

  const tl = gsap.timeline({
    defaults: { duration: DURATION, ease: EASE },
    onComplete: () => {
      isAnimating = false;
      current = targetIndex;
      /* Pile-up reset — reference.html's snap leaves the outgoing panel at
         yPercent ±30 / opacity 0.4 forever. With simple gradient panels (the
         tutorial demo) you don't see it. With our layered images, every
         previously-departed panel stacks visibly on top of the active one.
         Reset all non-active panels to fully off-screen.
         clearProps wipes GSAP's tracked transform state first, so the new
         gsap.set produces a single clean transform instead of layering on top
         of stale yPercent/y values from the timeline. */
      panels.forEach((p, i) => {
        if (i === targetIndex) return;
        gsap.set(p, { clearProps: 'transform,scale,rotate,translate,opacity,x,y,xPercent,yPercent' });
        gsap.set(p, {
          yPercent: i < targetIndex ? -100 : 100,
          opacity: 1,
        });
      });
    },
  });

  /* Outgoing — recede + fully fade.
     Reference.html spec ends outgoing at opacity 0.4, but with our layered
     images that residue is too visible during the slide. Going to opacity 0
     keeps the depth/recession (yPercent -30, scale 0.95) while removing the
     "hanging" overlay. The pile-up reset in onComplete then resets to
     opacity 1 at yPercent ±100 (invisible because off-screen). */
  tl.to(outgoing, {
    yPercent: direction === 1 ? -30 : 30,
    scale: 0.95,
    opacity: 0,
  }, 0);

  tl.to(incoming, { yPercent: 0 }, 0);

  dots.forEach((d, i) => d.classList.toggle('active', i === targetIndex));
}

/* ------------------------------------------------------------------
   Inputs (verbatim from reference.html)
   ------------------------------------------------------------------ */
let wheelLock = false;
window.addEventListener('wheel', (e) => {
  if (wheelLock) return;
  if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
  wheelLock = true;
  setTimeout(() => { wheelLock = false; }, DURATION * 1000 + 100);
  if (e.deltaY > 0) go(current + 1);
  else go(current - 1);
}, { passive: true });

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
    e.preventDefault();
    go(current + 1);
  }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    go(current - 1);
  }
});

let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });
window.addEventListener('touchend', (e) => {
  const dy = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(dy) < TOUCH_THRESHOLD) return;
  if (dy > 0) go(current + 1);
  else go(current - 1);
}, { passive: true });

dots.forEach((d, i) => {
  d.addEventListener('click', () => go(i));
});

/* Nav links jump to panels (data-go="N") */
document.querySelectorAll('[data-go]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const target = parseInt(el.dataset.go, 10);
    if (!Number.isNaN(target)) go(target);
    closeMenu();
  });
});

/* ------------------------------------------------------------------
   Burger menu (additive — does not touch snap mechanic)
   ------------------------------------------------------------------ */
const burger = document.querySelector('.burger-menu');
const menuOverlay = document.getElementById('menu-overlay');
const menuClose = document.querySelector('.menu-close');

function openMenu() {
  if (!menuOverlay) return;
  menuOverlay.hidden = false;
  burger?.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  if (!menuOverlay) return;
  menuOverlay.hidden = true;
  burger?.setAttribute('aria-expanded', 'false');
}

burger?.addEventListener('click', () => {
  if (!menuOverlay) return;
  if (menuOverlay.hidden) openMenu();
  else closeMenu();
});
menuClose?.addEventListener('click', closeMenu);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOverlay && !menuOverlay.hidden) closeMenu();
});
