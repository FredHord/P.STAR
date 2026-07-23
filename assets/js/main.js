(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo && reduceMotion) {
    heroVideo.removeAttribute("autoplay");
    heroVideo.removeAttribute("loop");
    heroVideo.pause();
  }

  // Cursor parallax on the hero: media drifts with the pointer, title
  // drifts gently against it. Fine pointers only; skipped for
  // prefers-reduced-motion.
  var hero = document.querySelector(".hero");
  var heroTitle = document.querySelector(".hero__title");
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  if (hero && heroVideo && finePointer && !reduceMotion) {
    hero.classList.add("hero--parallax");

    var MEDIA_SHIFT = 24;
    var TITLE_SHIFT = -10;
    var targetX = 0;
    var targetY = 0;
    var curX = 0;
    var curY = 0;
    var rafId = null;

    var tick = function () {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      heroVideo.style.transform =
        "scale(1.08) translate(" + curX * MEDIA_SHIFT + "px, " + curY * MEDIA_SHIFT + "px)";
      if (heroTitle) {
        heroTitle.style.transform =
          "translate(" + curX * TITLE_SHIFT + "px, " + curY * TITLE_SHIFT + "px)";
      }
      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    var queue = function () {
      if (rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    };

    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
      queue();
    });

    hero.addEventListener("mouseleave", function () {
      targetX = 0;
      targetY = 0;
      queue();
    });
  }

  var reveals = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();
