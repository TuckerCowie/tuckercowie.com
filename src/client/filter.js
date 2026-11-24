// Work index filters. Without this script each filter is a link to a
// prerendered page. With it, the three axes combine in place: rows are shown
// or hidden, the count updates, and the URL stays shareable.
//   one filter    -> its static path, e.g. /work/type/talk/
//   several       -> the index with a query, e.g. ?type=talk&skill=facilitation

(function () {
  'use strict';
  var box = document.querySelector('[data-filters]');
  var table = document.querySelector('.index tbody');
  // A collection is a saved filter with its own page; its links navigate.
  if (!box || !table || box.hasAttribute('data-collection')) return;
  var count = document.querySelector('[data-count]');
  var empty = document.querySelector('[data-empty]');
  var rows = [].slice.call(table.querySelectorAll('tr'));
  var axes = ['type', 'org', 'skill'];
  var state = { type: '', org: '', skill: '' };

  function read() {
    axes.forEach(function (ax) {
      var on = box.querySelector('[data-axis="' + ax + '"] [aria-current="true"]');
      state[ax] = on ? on.getAttribute('data-filter-value') : '';
    });
    var q = new URLSearchParams(location.search);
    axes.forEach(function (ax) { if (q.get(ax)) state[ax] = q.get(ax); });
  }

  function show() {
    var n = 0;
    rows.forEach(function (r) {
      var ok = (!state.type || r.getAttribute('data-type') === state.type) &&
        (!state.org || r.getAttribute('data-org') === state.org) &&
        (!state.skill || (' ' + r.getAttribute('data-skills') + ' ').indexOf(' ' + state.skill + ' ') !== -1);
      r.hidden = !ok;
      if (ok) n++;
    });
    if (count) count.textContent = n + (n === 1 ? ' entry' : ' entries');
    if (empty) empty.hidden = n > 0;
    axes.forEach(function (ax) {
      [].forEach.call(box.querySelectorAll('[data-axis="' + ax + '"] [data-filter-value]'), function (a) {
        if (a.getAttribute('data-filter-value') === state[ax]) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    });
  }

  function url() {
    var on = axes.filter(function (ax) { return state[ax]; });
    var all = box.querySelector('[data-filter-value=""]');
    var target = new URL(all.getAttribute('href'), location.href);
    if (on.length === 1) {
      var chip = box.querySelector('[data-axis="' + on[0] + '"] [data-filter-value="' + state[on[0]] + '"]');
      if (chip) target = new URL(chip.getAttribute('href'), location.href);
    }
    var q = new URLSearchParams(location.search);
    axes.forEach(function (ax) { q.delete(ax); });
    if (on.length > 1) on.forEach(function (ax) { q.set(ax, state[ax]); });
    var s = q.toString();
    return target.pathname + (s ? '?' + s : '');
  }

  box.addEventListener('click', function (e) {
    var a = e.target.closest('[data-filter-value]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    e.preventDefault();
    var ax = a.closest('[data-axis]').getAttribute('data-axis');
    var v = a.getAttribute('data-filter-value');
    state[ax] = state[ax] === v ? '' : v;
    show();
    history.replaceState(null, '', url());
  });

  read();
  show();
})();
