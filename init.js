/**
 * Shory — Scroll & Animation Init
 * Stack: Lenis (smooth scroll) + GSAP + ScrollTrigger + SplitType
 */

/* ─────────────────────────────────────────────
   1. LENIS SMOOTH SCROLL — synced with GSAP
───────────────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

/* ─────────────────────────────────────────────
   2. REUSABLE ANIMATION FUNCTIONS
───────────────────────────────────────────── */

/**
 * animateHeading(el)
 * Splits heading into lines, animates each line up from y:60, opacity:0
 * @param {Element|string} el — heading element or CSS selector
 * @param {Object} scrollTriggerConfig — optional ScrollTrigger overrides
 */
function animateHeading(el, scrollTriggerConfig = {}) {
  const target = typeof el === 'string' ? document.querySelector(el) : el;
  if (!target) return;

  const split = new SplitType(target, { types: 'lines' });

  gsap.set(split.lines, { willChange: 'transform, opacity' });

  gsap.fromTo(
    split.lines,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 0.9,
      ease: 'power3.out',
      onComplete() {
        split.lines.forEach((line) => (line.style.willChange = 'auto'));
      },
      scrollTrigger: {
        trigger: target,
        start: 'top 82%',
        toggleActions: 'play none none none',
        ...scrollTriggerConfig,
      },
    }
  );
}

/**
 * animateText(el)
 * Fades body text / paragraphs in from y:30, opacity:0
 * @param {Element|string} el — element or CSS selector
 * @param {Object} scrollTriggerConfig — optional ScrollTrigger overrides
 */
function animateText(el, scrollTriggerConfig = {}) {
  const target = typeof el === 'string' ? document.querySelector(el) : el;
  if (!target) return;

  gsap.set(target, { willChange: 'transform, opacity' });

  gsap.fromTo(
    target,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      onComplete() {
        target.style.willChange = 'auto';
      },
      scrollTrigger: {
        trigger: target,
        start: 'top 82%',
        toggleActions: 'play none none none',
        ...scrollTriggerConfig,
      },
    }
  );
}

/**
 * animateCards(els)
 * Staggers cards / images: scale 0.94, opacity 0 → scale 1, opacity 1
 * @param {NodeList|Element[]|string} els — elements or CSS selector
 * @param {Object} scrollTriggerConfig — optional ScrollTrigger overrides
 */
function animateCards(els, scrollTriggerConfig = {}) {
  const targets =
    typeof els === 'string'
      ? gsap.utils.toArray(els)
      : Array.from(els);

  if (!targets.length) return;

  gsap.set(targets, { willChange: 'transform, opacity' });

  gsap.fromTo(
    targets,
    { scale: 0.94, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      stagger: 0.12,
      duration: 1,
      ease: 'power3.out',
      onComplete() {
        targets.forEach((t) => (t.style.willChange = 'auto'));
      },
      scrollTrigger: {
        trigger: targets[0],
        start: 'top 82%',
        toggleActions: 'play none none none',
        ...scrollTriggerConfig,
      },
    }
  );
}

/* ─────────────────────────────────────────────
   3. SECTION WIRING EXAMPLE
   Shows how to wire all three functions for
   a single section (e.g. "Why choose Shory?")
───────────────────────────────────────────── */

/*
  <!-- HTML structure expected: -->
  <section class="section why-section">
    <div class="container">
      <div class="sec-head">
        <h2 class="sec-title">Why choose Shory?</h2>       ← animateHeading
        <p class="sec-sub">Zero hassle insurance...</p>    ← animateText
      </div>
      <div class="why-grid">
        <div class="why-card">...</div>                    ← animateCards
        <div class="why-card">...</div>
      </div>
    </div>
  </section>

  // Wiring:
  const whySection = document.querySelector('.why-section');
  if (whySection) {
    animateHeading(whySection.querySelector('.sec-title'));
    animateText(whySection.querySelector('.sec-sub'));
    animateCards(whySection.querySelectorAll('.why-card'));
  }
*/

/* ─────────────────────────────────────────────
   4. SITE-WIDE SECTION ANIMATIONS
   Wire every section on the page using the
   three reusable functions above.
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // ── Why choose Shory ──
  animateHeading('.why-section .sec-title');
  animateText('.why-section .sec-sub');
  animateCards('.why-section .why-card');

  // ── Choose the right insurance (video/scroll section) ──
  animateHeading('.insurance-section .scroll-sec-title');
  animateText('.insurance-section .scroll-sec-sub');
  animateCards('.insurance-section .vid-card');

  // ── Testimonials ──
  animateHeading('.testi-section .testi-title');
  animateCards('.testi-section .testi-card');

  // ── FAQ ──
  animateHeading('.faq-section .sec-title');
  animateText('.faq-section .faq-head-sub');
  animateCards('.faq-section .faq-item');

  // ── Partners ──
  animateText('.partners-title');

  // ── Trust bar items ──
  animateCards([
    ...document.querySelectorAll('.trust-item'),
    ...document.querySelectorAll('.trust-cbuae'),
  ]);

  // ── App CTA ──
  animateHeading('.app-cta-title');

  // ── Footer help ──
  animateHeading('.footer-help-title');
});
