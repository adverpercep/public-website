/* AP CTA Color Preview Toggle — client-facing, dev/preview only */
(function () {
  var KEY = 'ap-cta-scheme';
  var TEAL    = { bg: '#0B8395', hover: '#10697F', outline: '#D9EEF2', label: 'Teal' };
  var MAGENTA = { bg: '#DA0058', hover: '#B5004A', outline: '#FFD9E6', label: 'Magenta' };

  var scheme = sessionStorage.getItem(KEY) || 'teal';

  /* ── Inject override styles ── */
  var st = document.createElement('style');
  st.textContent = [
    /* solid buttons */
    'body.cta-magenta .btn-primary{background:' + MAGENTA.bg + '!important}',
    'body.cta-magenta .btn-primary:hover{background:' + MAGENTA.hover + '!important}',
    'body.cta-magenta .btn-magenta{background:' + MAGENTA.bg + '!important}',
    'body.cta-magenta .btn-magenta:hover{background:' + MAGENTA.hover + '!important}',
    /* nav CTA */
    'body.cta-magenta .contact-cta{background:' + MAGENTA.bg + '!important}',
    'body.cta-magenta .contact-cta:hover{background:' + MAGENTA.hover + '!important}',
    /* outline button */
    'body.cta-magenta .btn-teal-outline{color:' + MAGENTA.bg + '!important;border-color:' + MAGENTA.bg + '!important}',
    'body.cta-magenta .btn-teal-outline:hover{background:' + MAGENTA.outline + '!important}',
    /* hero promo pill */
    'body.cta-magenta .hero-promo .pill{background:' + MAGENTA.bg + '!important}',
  ].join('');
  document.head.appendChild(st);

  /* ── Apply scheme to body ── */
  function applyScheme(s) {
    scheme = s;
    sessionStorage.setItem(KEY, s);
    document.body.classList.toggle('cta-magenta', s === 'magenta');
    renderUI();
  }

  /* ── Build floating widget ── */
  var widget;

  function css(el, props) {
    Object.keys(props).forEach(function (k) { el.style[k] = props[k]; });
  }

  function buildWidget() {
    widget = document.createElement('div');
    css(widget, {
      position: 'fixed', bottom: '22px', right: '22px', zIndex: '2147483647',
      background: '#fff', border: '1px solid rgba(8,0,84,.12)',
      borderRadius: '14px', boxShadow: '0 6px 28px rgba(8,0,84,.15)',
      padding: '14px 16px 14px', fontFamily: 'system-ui,-apple-system,sans-serif',
      userSelect: 'none', minWidth: '210px',
    });

    /* label row */
    var lbl = document.createElement('div');
    css(lbl, {
      fontSize: '9.5px', letterSpacing: '.14em', textTransform: 'uppercase',
      fontWeight: '700', color: '#718096', marginBottom: '10px',
      display: 'flex', alignItems: 'center', gap: '6px',
    });
    var dot = document.createElement('span');
    css(dot, {
      width: '7px', height: '7px', borderRadius: '50%',
      display: 'inline-block', flexShrink: '0',
    });
    lbl.appendChild(dot);
    lbl.appendChild(document.createTextNode('Options'));
    widget._dot = dot;

    /* button row */
    var row = document.createElement('div');
    css(row, { display: 'flex', gap: '8px' });

    function makeBtn(id, color) {
      var btn = document.createElement('button');
      css(btn, {
        flex: '1', padding: '8px 10px', borderRadius: '8px', border: 'none',
        cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px',
        fontWeight: '700', letterSpacing: '.03em', color: '#fff',
        background: color.bg, transition: 'opacity .15s, outline .1s',
        outline: '2.5px solid transparent', outlineOffset: '2px',
      });
      btn.textContent = color.label;
      btn.addEventListener('click', function () { applyScheme(id); });
      return btn;
    }

    widget._tBtn = makeBtn('teal', TEAL);
    widget._mBtn = makeBtn('magenta', MAGENTA);

    row.appendChild(widget._tBtn);
    row.appendChild(widget._mBtn);

    /* sitemap link — resolves path based on subfolder depth */
    var inSub = window.location.pathname.indexOf('/team/') !== -1 ||
                window.location.pathname.indexOf('/blog/') !== -1;
    var siteLink = document.createElement('a');
    siteLink.href = (inSub ? '../' : '') + 'sitemap.html';
    css(siteLink, {
      display: 'block', marginTop: '10px', padding: '7px 10px',
      borderRadius: '7px', border: '1px solid rgba(8,0,84,.14)',
      fontSize: '11.5px', fontWeight: '600', textAlign: 'center',
      color: '#4A5568', textDecoration: 'none', background: 'transparent',
    });
    siteLink.textContent = '⊞  Project Guide';
    siteLink.addEventListener('mouseenter', function () { siteLink.style.background = '#F0F4FF'; });
    siteLink.addEventListener('mouseleave', function () { siteLink.style.background = 'transparent'; });

    widget.appendChild(lbl);
    widget.appendChild(row);
    widget.appendChild(siteLink);
    document.body.appendChild(widget);
  }

  function renderUI() {
    if (!widget) return;
    var isMag = scheme === 'magenta';
    css(widget._tBtn, { opacity: isMag ? '.4' : '1', outlineColor: isMag ? 'transparent' : TEAL.bg });
    css(widget._mBtn, { opacity: isMag ? '1' : '.4', outlineColor: isMag ? MAGENTA.bg : 'transparent' });
    css(widget._dot, { background: isMag ? MAGENTA.bg : TEAL.bg });
  }

  /* ── Newsletter modal ── */
  var nlModal;

  function buildNlModal() {
    var backdrop = document.createElement('div');
    css(backdrop, {
      position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
      background: 'rgba(8,0,84,.6)', zIndex: '2147483647',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    });

    var card = document.createElement('div');
    css(card, {
      background: '#fff', borderRadius: '24px', maxWidth: '520px', width: '100%',
      overflow: 'hidden', boxShadow: '0 24px 64px rgba(8,0,84,.35)', position: 'relative',
    });

    /* Header (navy gradient) */
    var hdr = document.createElement('div');
    css(hdr, {
      background: 'radial-gradient(120% 120% at 20% 10%, #1C2971 0%, #18235F 69%, #0A1040 100%)',
      padding: '40px 40px 36px', position: 'relative', overflow: 'hidden',
    });
    var hexA = document.createElement('div');
    css(hexA, { position:'absolute', top:'-20px', right:'-20px', width:'120px', height:'139px',
      clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
      background:'#576FD2', opacity:'.3' });
    var hexB = document.createElement('div');
    css(hexB, { position:'absolute', bottom:'-10px', right:'90px', width:'60px', height:'70px',
      clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
      background:'#0B8395', opacity:'.4' });
    hdr.appendChild(hexA);
    hdr.appendChild(hexB);

    var eyebrow = document.createElement('span');
    css(eyebrow, {
      display: 'inline-block', background: 'rgba(255,255,255,.12)',
      border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.8)',
      padding: '5px 16px', borderRadius: '999px', fontSize: '11px',
      letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: '700',
      marginBottom: '16px', position: 'relative', zIndex: '1',
    });
    eyebrow.textContent = 'Stay in the Know';

    var nlHeading = document.createElement('h2');
    css(nlHeading, {
      fontSize: '26px', fontWeight: '700', color: '#fff', lineHeight: '1.15',
      letterSpacing: '-.02em', position: 'relative', zIndex: '1',
    });
    nlHeading.textContent = 'Get the latest AP insights in your inbox.';

    hdr.appendChild(eyebrow);
    hdr.appendChild(nlHeading);

    /* Close button */
    var closeBtn = document.createElement('button');
    css(closeBtn, {
      position: 'absolute', top: '14px', right: '14px', width: '34px', height: '34px',
      borderRadius: '50%', background: 'rgba(255,255,255,.15)', border: 'none',
      color: '#fff', cursor: 'pointer', fontSize: '22px', lineHeight: '34px',
      textAlign: 'center', zIndex: '10',
    });
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.addEventListener('mouseenter', function () { closeBtn.style.background = 'rgba(255,255,255,.28)'; });
    closeBtn.addEventListener('mouseleave', function () { closeBtn.style.background = 'rgba(255,255,255,.15)'; });
    closeBtn.addEventListener('click', closeNlModal);

    /* Body */
    var body = document.createElement('div');
    css(body, { padding: '32px 40px 36px' });

    var desc = document.createElement('p');
    css(desc, { fontSize: '15px', lineHeight: '1.6', color: '#676E7B', marginBottom: '24px' });
    desc.textContent = "Weekly research findings, blog posts, and AP3 podcast episodes — data-driven insights you'll actually read.";

    var form = document.createElement('form');
    css(form, { display: 'flex', gap: '10px', flexWrap: 'wrap' });
    form.method = 'post';
    form.action = '#';

    var emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.placeholder = 'you@company.com';
    emailInput.required = true;
    css(emailInput, {
      flex: '1', minWidth: '180px', padding: '12px 18px', borderRadius: '999px',
      border: '1.5px solid #D0D5DD', fontFamily: 'system-ui,-apple-system,sans-serif',
      fontSize: '14px', color: '#101B5F',
    });

    var nlSubmit = document.createElement('button');
    nlSubmit.type = 'submit';
    css(nlSubmit, {
      padding: '12px 22px', borderRadius: '999px', background: '#0B8395',
      color: '#fff', border: 'none', fontFamily: 'system-ui,-apple-system,sans-serif',
      fontSize: '14px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
    });
    nlSubmit.textContent = 'Subscribe →';
    nlSubmit.addEventListener('mouseenter', function () { nlSubmit.style.background = '#10697F'; });
    nlSubmit.addEventListener('mouseleave', function () { nlSubmit.style.background = '#0B8395'; });

    var disclaimer = document.createElement('p');
    css(disclaimer, { fontSize: '12px', color: '#8C97A2', marginTop: '14px', lineHeight: '1.5' });
    disclaimer.textContent = 'By subscribing you agree to receive marketing emails. Unsubscribe anytime.';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      desc.textContent = '✓ You\'re subscribed! Check your inbox for a confirmation.';
      css(desc, { color: '#00AA49', fontWeight: '600', marginBottom: '0' });
      form.style.display = 'none';
      disclaimer.style.display = 'none';
    });

    form.appendChild(emailInput);
    form.appendChild(nlSubmit);
    body.appendChild(desc);
    body.appendChild(form);
    body.appendChild(disclaimer);
    card.appendChild(hdr);
    card.appendChild(closeBtn);
    card.appendChild(body);
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeNlModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNlModal(); });

    return backdrop;
  }

  function openNlModal() {
    if (!nlModal) nlModal = buildNlModal();
    nlModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(function () { nlModal.querySelector('input[type="email"]').focus(); }, 50);
  }

  function closeNlModal() {
    if (!nlModal) return;
    nlModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  /* Intercept footer "Newsletter Signup" links on every page */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (a.closest('footer') && a.textContent.trim() === 'Newsletter Signup') {
      e.preventDefault();
      openNlModal();
    }
  });

  /* ── Init ── (defer guarantees body exists) */
  buildWidget();
  applyScheme(scheme);
})();
