(function () {
  // Bail for users who prefer reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Inject keyframes + hidden state — opacity/transform are GPU-composited
  var st = document.createElement('style');
  st.textContent = [
    '@keyframes apFadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}',
    '@keyframes apFadeIn{from{opacity:0}to{opacity:1}}',
    '.ap-hidden{opacity:0!important}'
  ].join('');
  document.head.appendChild(st);

  var FADE_UP = 'apFadeUp 0.55s ease-out forwards';
  var FADE    = 'apFadeIn 0.65s ease-out forwards';

  // Elements to animate and their animation style
  var targets = [
    { sel: '.sec-eyebrow,.sec-heading,.sec-lede,.stat,.pillar', anim: FADE_UP },
    { sel: '.hero-eyebrow,.hero h1,.hero-sub,.hero-ctas',       anim: FADE_UP },
    { sel: '.card,.case,.wwd-card,.serve-card',                 anim: FADE_UP },
    { sel: '.testi-inner,.hero-promo,.hub-feature,.form-card',  anim: FADE    }
  ];

  var seen = new WeakSet();

  targets.forEach(function (t) {
    document.querySelectorAll(t.sel).forEach(function (el) {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add('ap-hidden');
      el._apAnim  = t.anim;
      el._apDelay = 0;
    });
  });

  // Stagger siblings within known grid containers
  ['.cards', '.what-we-do-grid', '.serve-grid', '.stat-row', '.pillars', '.cases'].forEach(function (parent) {
    document.querySelectorAll(parent).forEach(function (container) {
      var kids = Array.from(container.children).filter(function (c) { return c._apAnim !== undefined; });
      kids.forEach(function (child, i) { child._apDelay = i * 85; });
    });
  });

  // Hero: cascade children in reading order
  ['.hero-eyebrow', '.hero h1', '.hero-sub', '.hero-ctas', '.hero-promo'].forEach(function (sel, i) {
    document.querySelectorAll(sel).forEach(function (el) { el._apDelay = i * 110; });
  });

  // Reveal: remove hidden class, run animation, then clean up so hover transitions work normally
  function reveal(el) {
    var delay = el._apDelay || 0;
    setTimeout(function () {
      el.classList.remove('ap-hidden');
      el.style.animation = el._apAnim;
      el.addEventListener('animationend', function () {
        el.style.animation = '';   // clear inline animation — CSS cascade takes over naturally
      }, { once: true });
    }, delay);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      reveal(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.ap-hidden').forEach(function (el) { io.observe(el); });
})();
