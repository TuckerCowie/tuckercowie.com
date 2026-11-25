// The mood switcher. The mood for first paint is chosen by the inline script
// in <head> (see src/build/moods.mjs); this file handles everything after.
//
// Precedence: ?mood= in the URL, then the visitor's saved choice, then the
// system's light or dark preference, then Still Water.
//
// <html data-mood> is present only when the mood was chosen explicitly. With
// no attribute, the two default stylesheets follow prefers-color-scheme
// through their own media attributes, which is also how the site works with
// scripting off. Once a mood is explicit those media gates are lifted: each
// sheet is scoped to its own data-mood value, so only the chosen one applies.

(function () {
  'use strict';
  var cfg = JSON.parse(document.getElementById('mood-config').textContent);
  var root = document.documentElement;
  var byId = {};
  cfg.moods.forEach(function (m) { byId[m.id] = m; });
  var dark = window.matchMedia('(prefers-color-scheme: dark)');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)');
  var wanted = null;   // the latest mood asked for; an older, slower request must not win

  function auto() {
    var want = dark.matches ? 'dark' : 'light';
    var m = cfg.moods.filter(function (x) { return x.auto === want; })[0];
    return (m || cfg.moods[0]).id;
  }
  function current() { return root.getAttribute('data-mood') || auto(); }
  function status(text) { var el = document.getElementById('mood-status'); if (el) el.textContent = text; }

  // The static links for the two system defaults carry a media query. It is
  // lifted while a mood is explicit and restored when none is.
  function gate(on) {
    var links = document.querySelectorAll('link[data-mood-auto]');
    for (var i = 0; i < links.length; i++) {
      var l = links[i];
      if (!l.hasAttribute('data-media')) l.setAttribute('data-media', l.getAttribute('media') || 'all');
      l.media = on ? l.getAttribute('data-media') : 'all';
    }
  }

  // Loads a mood's stylesheet and resolves when it is ready. A sheet is inert
  // until data-mood matches it, so loading never changes what is on screen.
  function load(id) {
    var existing = document.querySelector('link[data-mood-sheet="' + id + '"], link[data-mood-auto="' + id + '"]');
    if (existing && existing.sheet) return Promise.resolve();
    return new Promise(function (ok, fail) {
      var link = existing;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cfg.base + id + '.css';
        link.setAttribute('data-mood-sheet', id);
      }
      link.addEventListener('load', function () { ok(); });
      link.addEventListener('error', function () { if (link.hasAttribute('data-mood-sheet')) link.remove(); fail(new Error('The stylesheet for ' + id + ' did not load.')); });
      if (!existing) document.head.appendChild(link);
    });
  }

  function reflect() {
    var id = current();
    var buttons = document.querySelectorAll('[data-mood-set]');
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-mood-set') === id));
    // One explicit theme-colour meta, placed first so it wins; removed when
    // the mood follows the system again.
    var meta = document.querySelector('meta[data-mood-theme]');
    if (root.hasAttribute('data-mood')) {
      if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; meta.setAttribute('data-mood-theme', ''); document.head.insertBefore(meta, document.head.firstChild); }
      meta.content = byId[id].theme;
    } else if (meta) meta.remove();
  }

  // A mood chosen by URL travels with the visitor across internal links.
  function carry(id) {
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i], href = a.getAttribute('href'), url;
      if (!href || href.charAt(0) === '#' || a.hasAttribute('download')) continue;
      try { url = new URL(href, location.href); } catch (e) { continue; }
      if (url.origin !== location.origin || !/(\/|\.html)$/.test(url.pathname)) continue;
      if (id) url.searchParams.set(cfg.param, id); else url.searchParams.delete(cfg.param);
      a.href = url.href;
    }
  }

  function setExplicit(id, from) {
    root.setAttribute('data-mood', id);
    root.setAttribute('data-mood-from', from);
    gate(false);
  }
  function setAuto() {
    root.removeAttribute('data-mood');
    root.removeAttribute('data-mood-from');
    gate(true);
  }

  function apply(id) {
    var saved = false;
    try { localStorage.setItem(cfg.storageKey, id); saved = localStorage.getItem(cfg.storageKey) === id; } catch (e) { /* storage is blocked */ }
    var url = new URL(location.href);
    if (saved) {
      // The saved choice now rules, so the URL stops asserting a mood.
      setExplicit(id, 'saved');
      if (url.searchParams.has(cfg.param)) { url.searchParams.delete(cfg.param); history.replaceState(null, '', url.pathname + url.search + url.hash); }
      carry(null);
    } else {
      // Nothing can be saved, so the choice travels in the URL instead.
      setExplicit(id, 'url');
      url.searchParams.set(cfg.param, id);
      history.replaceState(null, '', url.pathname + url.search + url.hash);
      carry(id);
    }
    reflect();
    status('Mood: ' + byId[id].name);
  }

  function choose(id) {
    if (!byId[id]) return;
    // Pressing the mood that is already saved changes nothing. Pressing one
    // that came from the URL keeps it.
    if (id === current() && root.getAttribute('data-mood-from') === 'saved') { reflect(); return; }
    wanted = id;
    load(id).then(function () {
      if (wanted !== id) return;
      var flip = function () { apply(id); };
      if (document.startViewTransition && !still.matches) document.startViewTransition(flip); else flip();
    }, function () {
      if (wanted !== id) return;
      reflect();
      status('The mood did not change. ' + byId[id].name + ' could not be loaded.');
    });
  }

  // Works out the mood again the way the head script does. Used when a page
  // comes back from the back/forward cache or another tab changes the choice.
  function resync() {
    var want = null, from = null, p = null;
    try { p = new URLSearchParams(location.search).get(cfg.param); } catch (e) { /* no URL API */ }
    if (p && byId[p]) { want = p; from = 'url'; }
    else { try { p = localStorage.getItem(cfg.storageKey); } catch (e) { p = null; } if (p && byId[p]) { want = p; from = 'saved'; } }
    if (want === root.getAttribute('data-mood')) { reflect(); return; }
    wanted = want;
    if (!want) { setAuto(); reflect(); return; }
    load(want).then(function () { if (wanted === want) { setExplicit(want, from); reflect(); } }, function () { reflect(); });
  }

  function init() {
    if (root.hasAttribute('data-mood')) gate(false);
    var sw = document.querySelector('[data-c="switcher"]');
    if (sw) {
      sw.hidden = false;
      sw.addEventListener('click', function (e) {
        var b = e.target.closest('[data-mood-set]');
        if (b) choose(b.getAttribute('data-mood-set'));
      });
      // Warm the other sheets when the visitor reaches for the switcher.
      var warm = function () { cfg.moods.forEach(function (m) { load(m.id).catch(function () {}); }); };
      sw.addEventListener('pointerenter', warm, { once: true });
      sw.addEventListener('focusin', warm, { once: true });
    }
    if (root.getAttribute('data-mood-from') === 'url') carry(root.getAttribute('data-mood'));
    reflect();
    dark.addEventListener('change', reflect);
    window.addEventListener('pageshow', function (e) { if (e.persisted) resync(); });
    window.addEventListener('storage', function (e) { if (e.key === cfg.storageKey || e.key === null) resync(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
