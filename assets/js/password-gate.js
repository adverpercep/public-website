/* AP demo password gate — casual deterrent only, not real security.
   Content is hidden via CSS (body{visibility:hidden}) until the
   correct password is entered; this script just checks it and
   reveals the page. View-source / direct fetch still exposes markup. */
(function () {
  var KEY = 'ap-gate-unlocked';
  var HASH = '51fd988027c3311c0ec5f1682f8739014a5948e534bfc84671b72c80036f1ee5';

  function sha256Hex(str) {
    var enc = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-256', enc).then(function (buf) {
      return Array.from(new Uint8Array(buf))
        .map(function (b) { return b.toString(16).padStart(2, '0'); })
        .join('');
    });
  }

  function reveal() {
    document.body.style.visibility = 'visible';
  }

  if (sessionStorage.getItem(KEY) === '1') {
    reveal();
    return;
  }

  function css(el, props) {
    Object.keys(props).forEach(function (k) { el.style[k] = props[k]; });
  }

  var overlay = document.createElement('div');
  css(overlay, {
    visibility: 'visible', position: 'fixed', inset: '0', zIndex: '2147483647',
    background: 'radial-gradient(120% 120% at 20% 10%, #1C2971 0%, #1C2971 23%, #18235F 69%, #0A1040 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    fontFamily: 'system-ui,-apple-system,sans-serif',
  });

  var card = document.createElement('div');
  css(card, {
    background: '#fff', borderRadius: '20px', padding: '40px 36px', maxWidth: '380px', width: '100%',
    boxShadow: '0 24px 64px rgba(8,0,84,.4)', textAlign: 'center',
  });

  var eyebrow = document.createElement('div');
  eyebrow.textContent = 'PRIVATE PREVIEW';
  css(eyebrow, {
    fontSize: '11px', fontWeight: '700', letterSpacing: '.14em', color: '#0B8395', marginBottom: '10px',
  });

  var heading = document.createElement('h1');
  heading.textContent = 'Advertiser Perceptions';
  css(heading, {
    fontSize: '19px', fontWeight: '700', color: '#101B5F', marginBottom: '6px', lineHeight: '1.3',
  });

  var sub = document.createElement('p');
  sub.textContent = 'This site is a work-in-progress demo. Enter the password to continue.';
  css(sub, { fontSize: '13.5px', color: '#676E7B', lineHeight: '1.5', marginBottom: '22px' });

  var form = document.createElement('form');
  css(form, { display: 'flex', flexDirection: 'column', gap: '10px' });

  var input = document.createElement('input');
  input.type = 'password';
  input.placeholder = 'Password';
  input.setAttribute('aria-label', 'Password');
  input.autocomplete = 'off';
  css(input, {
    padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #D0D5DD',
    fontSize: '15px', fontFamily: 'inherit', color: '#101B5F', textAlign: 'center',
  });

  var errorEl = document.createElement('div');
  errorEl.textContent = 'Incorrect password — try again.';
  css(errorEl, { fontSize: '12.5px', color: '#C00000', display: 'none' });

  var submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Enter →';
  css(submit, {
    padding: '12px 16px', borderRadius: '10px', border: 'none', background: '#0B8395',
    color: '#fff', fontSize: '14.5px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
  });
  submit.addEventListener('mouseenter', function () { submit.style.background = '#10697F'; });
  submit.addEventListener('mouseleave', function () { submit.style.background = '#0B8395'; });

  form.appendChild(input);
  form.appendChild(errorEl);
  form.appendChild(submit);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    sha256Hex(input.value).then(function (hash) {
      if (hash === HASH) {
        sessionStorage.setItem(KEY, '1');
        overlay.remove();
        reveal();
      } else {
        errorEl.style.display = 'block';
        input.value = '';
        input.focus();
      }
    });
  });

  card.appendChild(eyebrow);
  card.appendChild(heading);
  card.appendChild(sub);
  card.appendChild(form);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  setTimeout(function () { input.focus(); }, 30);
})();
