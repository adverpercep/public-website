/* AP site search — client-side, Fuse.js against a pre-built static index */
(function () {
  var inSub = window.location.pathname.indexOf('/team/') !== -1 ||
              window.location.pathname.indexOf('/blog/') !== -1;
  var prefix = inSub ? '../' : '';

  var fuse = null;
  var indexPromise = null;

  function loadIndex() {
    if (indexPromise) return indexPromise;
    indexPromise = fetch(prefix + 'assets/search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        fuse = new Fuse(data, {
          keys: [
            { name: 'title', weight: 0.6 },
            { name: 'description', weight: 0.3 },
            { name: 'category', weight: 0.1 },
          ],
          threshold: 0.35,
          ignoreLocation: true,
        });
        return data;
      })
      .catch(function (err) { console.error('Search index failed to load', err); return []; });
    return indexPromise;
  }

  function css(el, props) {
    Object.keys(props).forEach(function (k) { el.style[k] = props[k]; });
  }

  var overlay, panel, input, resultsEl, emptyEl;

  function build() {
    overlay = document.createElement('div');
    css(overlay, {
      position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
      background: 'rgba(8,0,84,.5)', zIndex: '2147483647',
      display: 'none', justifyContent: 'center', padding: '80px 20px 20px',
      fontFamily: 'system-ui,-apple-system,sans-serif',
    });

    panel = document.createElement('div');
    css(panel, {
      background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '600px',
      maxHeight: '70vh', display: 'flex', flexDirection: 'column',
      boxShadow: '0 24px 64px rgba(8,0,84,.35)', overflow: 'hidden', height: 'fit-content',
    });

    var inputRow = document.createElement('div');
    css(inputRow, {
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '16px 18px', borderBottom: '1px solid #E4EBF1', flexShrink: '0',
    });

    var icon = document.createElement('span');
    icon.textContent = '⌕';
    css(icon, { fontSize: '18px', color: '#212E80', flexShrink: '0' });

    input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search the site…';
    input.setAttribute('aria-label', 'Search the site');
    css(input, {
      flex: '1', border: 'none', outline: 'none', fontSize: '16px',
      fontFamily: 'inherit', color: '#101B5F', background: 'transparent',
    });

    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close search');
    css(closeBtn, {
      width: '30px', height: '30px', borderRadius: '50%', border: 'none',
      background: '#E4EBF1', color: '#212E80', cursor: 'pointer', fontSize: '18px',
      lineHeight: '30px', textAlign: 'center', flexShrink: '0', padding: '0',
    });
    closeBtn.addEventListener('click', close);

    inputRow.appendChild(icon);
    inputRow.appendChild(input);
    inputRow.appendChild(closeBtn);

    resultsEl = document.createElement('div');
    css(resultsEl, { overflowY: 'auto', padding: '8px' });

    emptyEl = document.createElement('div');
    css(emptyEl, { padding: '32px 20px', textAlign: 'center', color: '#8C97A2', fontSize: '14px' });
    emptyEl.textContent = 'Start typing to search pages, insights, and team profiles.';

    panel.appendChild(inputRow);
    panel.appendChild(resultsEl);
    panel.appendChild(emptyEl);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.style.display === 'flex') close();
    });
    input.addEventListener('input', function () { renderResults(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var first = resultsEl.querySelector('a');
        if (first) first.click();
      }
    });
  }

  function renderResults(query) {
    query = query.trim();
    resultsEl.innerHTML = '';
    if (!query) {
      emptyEl.style.display = 'block';
      emptyEl.textContent = 'Start typing to search pages, insights, and team profiles.';
      return;
    }
    if (!fuse) { emptyEl.style.display = 'block'; emptyEl.textContent = 'Loading…'; return; }

    var matches = fuse.search(query, { limit: 8 });
    if (!matches.length) {
      emptyEl.style.display = 'block';
      emptyEl.textContent = 'No results for "' + query + '".';
      return;
    }
    emptyEl.style.display = 'none';

    matches.forEach(function (m) {
      var item = m.item;
      var row = document.createElement('a');
      row.href = prefix + item.url;
      css(row, {
        display: 'block', padding: '12px 14px', borderRadius: '10px',
        textDecoration: 'none', marginBottom: '2px',
      });
      row.addEventListener('mouseenter', function () { row.style.background = '#F7F9FC'; });
      row.addEventListener('mouseleave', function () { row.style.background = 'transparent'; });

      var titleRow = document.createElement('div');
      css(titleRow, { display: 'flex', alignItems: 'center', gap: '8px' });

      var title = document.createElement('span');
      title.textContent = item.title;
      css(title, { fontSize: '15px', fontWeight: '600', color: '#212E80' });

      var badge = document.createElement('span');
      badge.textContent = item.category;
      css(badge, {
        fontSize: '10px', fontWeight: '700', letterSpacing: '.06em', textTransform: 'uppercase',
        color: '#0B8395', background: '#D9EEF2', padding: '2px 8px', borderRadius: '999px', flexShrink: '0',
      });

      titleRow.appendChild(title);
      titleRow.appendChild(badge);
      row.appendChild(titleRow);

      if (item.description) {
        var desc = document.createElement('div');
        desc.textContent = item.description;
        css(desc, {
          fontSize: '13px', color: '#676E7B', marginTop: '3px', lineHeight: '1.4',
          overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
          WebkitLineClamp: '1', WebkitBoxOrient: 'vertical',
        });
        row.appendChild(desc);
      }

      resultsEl.appendChild(row);
    });
  }

  function open() {
    if (!overlay) build();
    loadIndex();
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    renderResults('');
    setTimeout(function () { input.focus(); }, 30);
  }

  function close() {
    if (!overlay) return;
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    input.value = '';
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.search-icon');
    if (!trigger) {
      var a = e.target.closest('a');
      if (a && a.closest('.mobile-nav') && a.textContent.trim() === 'Search') trigger = a;
    }
    if (!trigger) return;
    e.preventDefault();
    open();
  });
})();
