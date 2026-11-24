// The mood switcher. The mood for first paint is chosen by the inline script
// in <head> (see src/build/moods.mjs); this file handles everything after.
//
// Precedence: ?mood= in the URL, then the visitor's saved choice, then the
// system's light or dark preference, then Still Water.
//
// <html data-mood> is present only when the mood was chosen explicitly. With
// no attribute, the two default stylesheets follow prefers-color-scheme on
// their own, which is also how the site works with scripting off.

(function () {
  'use strict';
  var cfg = JSON.parse(document.getElementById('mood-config').textContent);
  var root = document.documentElement;
  var byId = {};
  cfg.moods.forEach(function (m) { byId[m.id] = m; });
  var dark = window.matchMedia('(prefers-color-scheme: dark)');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)');

  function auto() {
    var want = dark.matches ? 'dark' : 'light';
    var m = cfg.moods.filter(function (x) { return x.auto === want; })[0];
    return (m || cfg.moods[0]).id;
  }
  function current() { return root.getAttribute('data-mood') || auto(); }

  // Loads a mood's stylesheet. It is inert until data-mood matches it, so
  // loading never changes what is on screen.
  function load(id) {
    var existing = document.querySelector('link[data-mood-sheet="' + id + '"]');
    if (existing) return existing.sheet ? Promise.resolve() : new Promise(function (ok) { existing.addEventListener('load', ok); existing.addEventListener('error', ok); });
    return new Promise(function (ok) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cfg.base + id + '.css';
      link.setAttribute('data-mood-sheet', id);
      link.addEventListener('load', ok);
      link.addEventListener('error', ok);
      document.head.appendChild(link);
    });
  }

  function reflect() {
    var id = current();
    var m = byId[id];
    var buttons = document.querySelectorAll('[data-mood-set]');
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-mood-set') === id));
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    if (root.hasAttribute('data-mood')) {
      for (var j = 0; j < metas.length; j++) { metas[j].removeAttribute('media'); metas[j].setAttribute('content', m.theme); }
    }
  }

  function carry(id) {
    // A mood chosen by URL travels with the visitor across internal links.
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i], url;
      try { url = new URL(a.getAttribute('href'), location.href); } catch (e) { continue; }
      if (url.origin !== location.origin || /\.(jpe?g|png|webp|avif|json|svg|pdf)$/i.test(url.pathname)) continue;
      if (a.getAttribute('href').charAt(0) === '#') continue;
      if (id) url.searchParams.set(cfg.param, id); else url.searchParams.delete(cfg.param);
      a.href = url.href;
    }
  }

  function apply(id, announce) {
    root.setAttribute('data-mood', id);
    root.setAttribute('data-mood-from', 'saved');
    try { localStorage.setItem(cfg.storageKey, id); } catch (e) { /* private mode: the choice lasts for this page */ }
    // The saved choice now rules, so the URL stops asserting a different one.
    var url = new URL(location.href);
    if (url.searchParams.has(cfg.param)) { url.searchParams.delete(cfg.param); history.replaceState(null, '', url.pathname + url.search + url.hash); carry(null); }
    reflect();
    if (announce) document.getElementById('mood-status').textContent = 'Mood: ' + byId[id].name;
  }

  function choose(id) {
    if (!byId[id] || id === current() && root.hasAttribute('data-mood')) { reflect(); return; }
    load(id).then(function () {
      var flip = function () { apply(id, true); };
      if (document.startViewTransition && !still.matches) document.startViewTransition(flip); else flip();
    });
  }

  function init() {
    var sw = document.querySelector('[data-c="switcher"]');
    if (sw) {
      sw.hidden = false;
      sw.addEventListener('click', function (e) {
        var b = e.target.closest('[data-mood-set]');
        if (b) choose(b.getAttribute('data-mood-set'));
      });
      // Warm the other sheets when the visitor reaches for the switcher.
      var warm = function () { cfg.moods.forEach(function (m) { load(m.id); }); };
      sw.addEventListener('pointerenter', warm, { once: true });
      sw.addEventListener('focusin', warm, { once: true });
    }
    if (root.getAttribute('data-mood-from') === 'url') carry(root.getAttribute('data-mood'));
    reflect();
    dark.addEventListener('change', reflect);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
