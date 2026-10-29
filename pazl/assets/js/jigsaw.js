/* All Work as a jigsaw.
   1. The timeline (.drops): each project is a piece that falls into place on a dashed spine as it scrolls into view.
   2. The assembled puzzle (.jigsaw): the same 24 pieces cut to interlock and packed into one block.
   Hover lifts a piece; click opens it large with a link to the project. */
(function () {
  var TAB = 0.34; /* room around the cell for the knobs, as a fraction of the cell */
  var m = TAB / (1 + 2 * TAB), a = m, b = 1 - m;
  var svg = document.getElementById('jigsaw-defs');
  if (!svg) return;
  var defs = svg.querySelector('defs');
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }

  /* one edge from P0 to P1; the knob points along `normal` when d = +1, inward when d = -1, straight when 0 */
  function edge(p0, p1, normal, d) {
    var dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.abs(dx || dy);
    function pt(u, v) { return (p0[0] + dx * u + normal[0] * v * d * L).toFixed(4) + ' ' + (p0[1] + dy * u + normal[1] * v * d * L).toFixed(4); }
    if (!d) return 'L' + pt(1, 0);
    /* classic knob: a narrow neck opening into a round head */
    return 'L' + pt(0.41, 0) +
      'C' + pt(0.41, 0.05) + ' ' + pt(0.39, 0.08) + ' ' + pt(0.38, 0.11) +
      'C' + pt(0.355, 0.15) + ' ' + pt(0.36, 0.26) + ' ' + pt(0.43, 0.30) +
      'C' + pt(0.47, 0.325) + ' ' + pt(0.53, 0.325) + ' ' + pt(0.57, 0.30) +
      'C' + pt(0.64, 0.26) + ' ' + pt(0.645, 0.15) + ' ' + pt(0.62, 0.11) +
      'C' + pt(0.61, 0.08) + ' ' + pt(0.59, 0.05) + ' ' + pt(0.59, 0) +
      'L' + pt(1, 0);
  }
  function cut(top, right, bottom, left) {
    return 'M' + a + ' ' + a + edge([a, a], [b, a], [0, -1], top) + edge([b, a], [b, b], [1, 0], right) +
      edge([b, b], [a, b], [0, 1], bottom) + edge([a, b], [a, a], [-1, 0], left) + 'Z';
  }
  function clip(id, d) {
    var cp = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    cp.setAttribute('id', id); cp.setAttribute('clipPathUnits', 'objectBoundingBox');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d); cp.appendChild(path); defs.appendChild(cp);
    return 'url(#' + id + ')';
  }
  function applyClip(el, url) {
    Array.prototype.forEach.call(el.querySelectorAll('.piece__clip, .piece__depth'), function (s) { s.style.clipPath = url; });
  }

  /* timeline pieces: every piece gets its own cut, at least two tabs out so it reads as a piece */
  var drops = Array.prototype.slice.call(document.querySelectorAll('.drops .piece'));
  var rd = rng(1028), rd2 = rng(2026); /* pieces 25 onward take their cuts from a second sequence */
  drops.forEach(function (el, i) {
    var pick = i >= 24 ? rd2 : rd;
    var e; do { e = [0, 1, 2, 3].map(function () { var r = pick(); return r < 0.4 ? 1 : r < 0.8 ? -1 : 0; }); } while (e.filter(function (x) { return x === 1; }).length < 2);
    applyClip(el, clip('drop-' + i, cut(e[0], e[1], e[2], e[3])));
  });

  /* the assembled block */
  var wrap = document.querySelector('.jigsaw');
  var pieces = wrap ? Array.prototype.slice.call(wrap.querySelectorAll('.piece')) : [];
  function colsFor(w) { return w >= 1000 ? 6 : w >= 620 ? 4 : 3; }
  function build() {
    if (!wrap) return;
    var n = pieces.length, cols = colsFor(wrap.clientWidth), rows = Math.ceil(n / cols);
    var rand = rng(20261028), H = [], V = [];
    for (var r = 0; r < rows; r++) { H[r] = []; V[r] = []; for (var c = 0; c < cols; c++) { H[r][c] = rand() < 0.5 ? 1 : -1; V[r][c] = rand() < 0.5 ? 1 : -1; } }
    Array.prototype.forEach.call(defs.querySelectorAll('clipPath[id^="jig-"]'), function (x) { x.remove(); });
    pieces.forEach(function (el, i) {
      var r = Math.floor(i / cols), c = i % cols;
      var top = r === 0 ? 0 : -H[r - 1][c], bottom = r === rows - 1 ? 0 : H[r][c];
      var left = c === 0 ? 0 : -V[r][c - 1], right = c === cols - 1 ? 0 : V[r][c];
      applyClip(el, clip('jig-' + i, cut(top, right, bottom, left)));
      el.style.left = ((c - TAB) / cols * 100) + '%';
      el.style.top = ((r - TAB) / rows * 100) + '%';
      el.style.width = ((1 + 2 * TAB) / cols * 100) + '%';
      el.style.height = ((1 + 2 * TAB) / rows * 100) + '%';
    });
    wrap.style.aspectRatio = cols + ' / ' + rows;
  }
  build();
  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 120); });

  /* fall into place as each row scrolls in */
  var rows = Array.prototype.slice.call(document.querySelectorAll('.drop'));
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-placed'); io.unobserve(en.target); } });
    }, { threshold: 0.3, rootMargin: '0px 0px -10% 0px' });
    rows.forEach(function (r) { io.observe(r); });
  } else {
    rows.forEach(function (r) { r.classList.add('is-placed'); });
  }

  /* expand on click */
  var expand = document.querySelector('.expand');
  if (!expand) return;
  var img = expand.querySelector('.expand__img'), eyebrow = expand.querySelector('.expand__eyebrow'),
      title = expand.querySelector('.expand__title'), desc = expand.querySelector('.expand__desc'),
      link = expand.querySelector('.expand__link'), closeBtn = expand.querySelector('.expand__close');
  var last = null;
  function open(el) {
    var src = el.querySelector('img');
    img.src = src.getAttribute('src'); img.alt = src.alt;
    eyebrow.textContent = el.dataset.num + ' — ' + el.dataset.cat + ' · ' + el.dataset.released;
    title.textContent = el.dataset.title; desc.textContent = el.dataset.desc;
    link.href = el.getAttribute('href');
    expand.hidden = false; document.body.classList.add('is-expanded');
    requestAnimationFrame(function () { expand.classList.add('is-open'); });
    last = el; closeBtn.focus();
  }
  function close() {
    expand.classList.remove('is-open'); document.body.classList.remove('is-expanded');
    setTimeout(function () { expand.hidden = true; if (last) last.focus(); }, 200);
  }
  drops.concat(pieces).forEach(function (el) { el.addEventListener('click', function (e) { e.preventDefault(); open(el); }); });
  closeBtn.addEventListener('click', close);
  expand.addEventListener('click', function (e) { if (e.target === expand) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !expand.hidden) close(); });
})();
