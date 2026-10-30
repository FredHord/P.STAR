/* FSF Studio — small behaviours. No dependencies. */
(function () {
  'use strict';

  /* Mobile nav toggle */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Rolling image sequences (.roll): cycle frames while on screen.
     data-interval sets the hold time in ms (default 1400). Honour reduced motion. */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rolls = Array.prototype.slice.call(document.querySelectorAll('.roll'));
  if (rolls.length && !reduce) {
    rolls.forEach(function (roll) {
      var frames = Array.prototype.slice.call(roll.querySelectorAll('img'));
      if (frames.length < 2) return;
      var i = 0, timer = null;
      var hold = parseInt(roll.getAttribute('data-interval'), 10) || 1400;
      var counter = roll.querySelector('.roll__count');
      frames[0].classList.add('is-on');
      roll.classList.add('is-live');

      function warm() { frames.forEach(function (f) { if (f.loading === 'lazy') f.loading = 'eager'; }); }
      function show(n) {
        var next = frames[n % frames.length];
        // never cut to a frame that has not loaded; try again next tick
        if (!next.complete || next.naturalWidth === 0) return;
        frames[i].classList.remove('is-on');
        i = n % frames.length;
        frames[i].classList.add('is-on');
        if (counter) counter.textContent = (i + 1) + ' / ' + frames.length;
      }
      function start() { warm(); if (!timer) timer = setInterval(function () { show(i + 1); }, hold); }
      function stop() { clearInterval(timer); timer = null; }

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
        }, { rootMargin: '600px 0px' }).observe(roll);
      } else {
        start();
      }
      document.addEventListener('visibilitychange', function () {
        document.hidden ? stop() : start();
      });
    });
  }

  /* Looping films (.loop__video): load and play only while near the viewport */
  var loops = Array.prototype.slice.call(document.querySelectorAll('video.loop__video[data-src]'));
  if (loops.length) {
    function arm(v) {
      if (getComputedStyle(v).display === 'none') return; // a phone still stands in for this loop
      if (!v.getAttribute('src')) { v.setAttribute('src', v.getAttribute('data-src')); v.load(); }
      if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    }
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? arm(e.target) : e.target.pause(); });
      }, { rootMargin: '400px 0px' });
      loops.forEach(function (v) { vio.observe(v); });
    } else {
      loops.forEach(arm);
    }
  }

  /* Phones get the lighter film encode */
  if (window.matchMedia && window.matchMedia('(max-width: 720px)').matches) {
    document.querySelectorAll('video.film[data-src-sm]').forEach(function (v) { v.setAttribute('src', v.getAttribute('data-src-sm')); });
  }

  /* Motion control: a footer button pauses every animation and loop, remembered per browser */
  (function () {
    var root = document.documentElement, key = 'pazl-motion';
    var off = false; try { off = localStorage.getItem(key) === 'off'; } catch (e) {}
    function apply() {
      root.classList.toggle('motion-off', off);
      document.querySelectorAll('video.loop__video').forEach(function (v) { if (off) v.pause(); else if (v.getAttribute('src')) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } });
      document.querySelectorAll('.motion-btn').forEach(function (b) { b.textContent = off ? 'Play motion' : 'Pause motion'; b.setAttribute('aria-pressed', off ? 'true' : 'false'); });
    }
    var nav = document.querySelector('.footer__links');
    if (nav) { var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'motion-btn'; nav.appendChild(btn); btn.addEventListener('click', function () { off = !off; try { localStorage.setItem(key, off ? 'off' : 'on'); } catch (e) {} apply(); }); }
    apply();
    if (off) document.addEventListener('play', function (e) { if (e.target.classList && e.target.classList.contains('loop__video')) e.target.pause(); }, true);
  })();

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* Contact form: until a real form endpoint is set, fall back to an email draft */
  var form = document.querySelector('form.form[data-fallback]');
  if (form && /YOUR_FORM_ID/.test(form.getAttribute('action') || '')) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var name = ((f.first_name && f.first_name.value) + ' ' + (f.last_name && f.last_name.value)).trim();
      var subject = 'New enquiry' + (name ? ' from ' + name : '');
      var body = (f.message ? f.message.value : '') + '\n\n' + name + (f.email ? '\n' + f.email.value : '');
      window.location.href = form.getAttribute('data-fallback') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  /* Work index filter: ?cat=video or #video deep-links to a discipline */
  var filters = document.querySelector('.filters');
  if (filters) {
    var pills = Array.prototype.slice.call(filters.querySelectorAll('.pill'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.card[data-cat]'));
    var count = document.querySelector('[data-count]');
    var empty = document.querySelector('.empty');

    function apply(cat, push) {
      var shown = 0;
      cards.forEach(function (card) {
        var hit = cat === 'all' || card.getAttribute('data-cat') === cat;
        card.classList.toggle('is-hidden', !hit);
        if (hit) {
          shown += 1;
          var n = card.querySelector('[data-num]');
          if (n) n.textContent = (shown < 10 ? '0' : '') + shown;
        }
      });
      pills.forEach(function (p) {
        p.setAttribute('aria-pressed', p.getAttribute('data-filter') === cat ? 'true' : 'false');
      });
      if (count) count.textContent = shown + (shown === 1 ? ' project' : ' projects');
      if (empty) empty.classList.toggle('is-visible', shown === 0);
      if (push && window.history && window.history.replaceState) {
        var url = cat === 'all' ? window.location.pathname : window.location.pathname + '#' + cat;
        window.history.replaceState(null, '', url);
      }
    }

    pills.forEach(function (p) {
      p.addEventListener('click', function () { apply(p.getAttribute('data-filter'), true); });
    });

    var initial = 'all';
    var hash = window.location.hash.replace('#', '');
    var param = new URLSearchParams(window.location.search).get('cat');
    var wanted = param || hash;
    if (wanted && pills.some(function (p) { return p.getAttribute('data-filter') === wanted; })) {
      initial = wanted;
    }
    apply(initial, false);
  }

  // ---------- header puzzle: hover, tilt, click ----------
  // Listeners live on the document (delegated), and hit-testing falls back to quadrants when the
  // piece images cannot be read into a canvas (for example when the page is opened from a file:// URL).
  (function () {
    // Header puzzle: hover, tilt, click. Listeners live on the document so they survive re-renders of the board.
    if (window.__pazlPuzzle) return; window.__pazlPuzzle = true;
    var names = { music: 'Film', fashion: 'Fashion', tech: 'Brands', art: 'Art' };
    var colors = { music: 'var(--c-music)', fashion: 'var(--c-fashion)', tech: 'var(--c-tech)', art: 'var(--c-art)' };
    var SIZE = 160, maps = {}, current = null, leaving = false, hovered = false;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function mark() { return document.querySelector('.assemble'); }
    function buildMaps(a) {
      Array.prototype.forEach.call(a.querySelectorAll('.assemble__piece'), function (img) {
        var k = img.dataset.piece; if (k in maps || !img.complete || !img.naturalWidth) return;
        try {
          var cv = document.createElement('canvas'); cv.width = SIZE; cv.height = Math.round(SIZE * 726 / 800);
          var cx = cv.getContext('2d', { willReadFrequently: true });
          cx.drawImage(img, 0, 0, cv.width, cv.height);
          maps[k] = { w: cv.width, h: cv.height, a: cx.getImageData(0, 0, cv.width, cv.height).data };
        } catch (e) { maps[k] = null; }
      });
    }
    function quadrant(x, y) { return y < 0.5 ? (x < 0.5 ? 'music' : 'art') : (x < 0.5 ? 'tech' : 'fashion'); }
    function hit(a, ev) {
      var r = a.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
      if (x < 0 || y < 0 || x > 1 || y > 1) return null;
      buildMaps(a);
      var pieces = Array.prototype.slice.call(a.querySelectorAll('.assemble__piece')), any = false;
      for (var i = pieces.length - 1; i >= 0; i--) {
        var m = maps[pieces[i].dataset.piece]; if (!m) continue; any = true;
        var px = Math.min(m.w - 1, Math.floor(x * m.w)), py = Math.min(m.h - 1, Math.floor(y * m.h));
        if (m.a[(py * m.w + px) * 4 + 3] > 40) return pieces[i].dataset.piece;
      }
      return any ? null : quadrant(x, y); // no alpha maps (e.g. images not readable): fall back to quadrants
    }
    function set(a, name) {
      if (name === current) return;
      current = name;
      var l = document.querySelector('.assemble__label'), w = l && l.querySelector('.assemble__word'), d = l && l.querySelector('.assemble__dot');
      if (name) { a.setAttribute('data-hover', name); if (l) { w.textContent = names[name] + ' — see the work'; d.style.setProperty('--dot', colors[name]); l.classList.add('is-on'); } }
      else { a.removeAttribute('data-hover'); if (l) l.classList.remove('is-on'); }
    }
    function tilt(a, ev) {
      if (reduce || leaving) return;
      var r = a.getBoundingClientRect();
      var dx = (ev.clientX - (r.left + r.width / 2)) / r.width, dy = (ev.clientY - (r.top + r.height / 2)) / r.height;
      a.style.transform = 'rotateY(' + (dx * 14).toFixed(2) + 'deg) rotateX(' + (-dy * 14).toFixed(2) + 'deg)';
    }
    function leave() {
      hovered = false; var a = mark(); if (!a) return;
      a.classList.remove('is-hover'); set(a, null); a.style.transform = '';
    }
    function go(a, name) {
      if (!name || leaving) return;
      leaving = true;
      a.classList.add('is-leaving');
      setTimeout(function () { window.location.href = 'work.html#' + name; }, reduce ? 0 : 450);
    }
    function within(ev) { return ev.target && ev.target.closest ? ev.target.closest('.assemble') : null; }
    // once the intro has played, hand control to the hover transforms
    setTimeout(function () { var a = mark(); if (a) a.classList.add('is-done'); }, reduce ? 0 : 2600);
    document.addEventListener('pointermove', function (ev) {
      if (ev.pointerType && ev.pointerType !== 'mouse') return;
      var a = within(ev);
      if (a) { hovered = true; a.classList.add('is-done'); a.classList.add('is-hover'); set(a, hit(a, ev)); tilt(a, ev); }
      else if (hovered) leave();
    });
    document.addEventListener('pointerdown', function (ev) { var a = within(ev); if (a && ev.pointerType && ev.pointerType !== 'mouse') set(a, hit(a, ev)); });
    document.addEventListener('click', function (ev) {
      var a = within(ev); if (!a) return;
      var key = ev.target.closest('.assemble__key');
      if (key) { go(a, key.dataset.piece); return; }
      go(a, hit(a, ev) || current);
    });
    document.addEventListener('focusin', function (ev) { var key = ev.target.closest && ev.target.closest('.assemble__key'); if (key) set(key.closest('.assemble'), key.dataset.piece); });
    document.addEventListener('focusout', function (ev) { var key = ev.target.closest && ev.target.closest('.assemble__key'); if (key) set(key.closest('.assemble'), null); });
  })();

})();

/* Hero: size the globe column to the height of the copy beside it, so the two read as one block. */
(function () {
  var orbit = document.querySelector('.hero__orbit'), text = document.querySelector('.hero__text');
  if (!orbit || !text || !('ResizeObserver' in window)) return;
  var last = 0, runs = 0;
  function fit() {
    if (window.innerWidth <= 820) { orbit.style.removeProperty('--globe'); last = 0; return; }
    var k = text.children; if (!k.length) return;
    var h = Math.round(k[k.length - 1].getBoundingClientRect().bottom - k[0].getBoundingClientRect().top);
    var eb = document.querySelector('.hero__eyebrow'); if (eb) h -= Math.round(eb.getBoundingClientRect().height) + 16; /* the eyebrow shares the column */
    if (Math.abs(h - last) < 2 || runs > 4) return;
    last = h; runs += 1; orbit.style.setProperty('--globe', h + 'px');
  }
  var ro = new ResizeObserver(function () { runs = 0; fit(); });
  ro.observe(text); Array.prototype.forEach.call(text.children, function (el) { ro.observe(el); });
  window.addEventListener('resize', function () { runs = 0; fit(); });
  window.addEventListener('load', function () { runs = 0; fit(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { runs = 0; fit(); }); /* Syne changes the copy's height once it lands */
  fit();
})();

/* Work index: #art, #fashion, #music (film) or #tech (brands) from the home globe narrows the timeline to that kind of work. */
(function () {
  var drops = Array.prototype.slice.call(document.querySelectorAll('.drops .drop')); if (!drops.length) return;
  var GROUPS = { art: ['Art Direction', 'Photography'], fashion: ['Fashion', 'Wardrobe'], music: ['Video'], tech: ['Collaboration', 'Merchandise', 'Activation'] };
  var NAMES = { art: 'Art', fashion: 'Fashion', music: 'Film', tech: 'Brands' };
  var count = document.querySelector('[data-count]'), total = drops.length;
  function apply() {
    var key = window.location.hash.replace('#', ''), cats = GROUPS[key], n = 0;
    drops.forEach(function (d) {
      var c = d.querySelector('[data-cat]'), hit = !cats || (c && cats.indexOf(c.getAttribute('data-cat')) > -1);
      d.hidden = !hit; if (hit) n += 1;
    });
    if (count) count.innerHTML = cats ? n + ' of ' + total + ' projects · ' + NAMES[key] + ' · <a class="ul" href="work.html">Show all</a>' : total + ' projects';
  }
  window.addEventListener('hashchange', apply); apply();
})();
