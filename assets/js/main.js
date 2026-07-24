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

  // Hover-to-play hero: on devices with a mouse the footage holds a
  // static frame until the cursor enters the hero, then plays and
  // drifts with the pointer (title counter-drifts for depth). Freezes
  // and recenters on leave. Touch devices keep the autoplay loop;
  // prefers-reduced-motion keeps everything still.
  var hero = document.querySelector(".hero");
  var heroTitle = document.querySelector(".hero__title");
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  if (hero && heroVideo && finePointer && !reduceMotion) {
    hero.classList.add("hero--parallax");

    heroVideo.removeAttribute("autoplay");
    heroVideo.pause();
    heroVideo.addEventListener("loadeddata", function () {
      if (!hero.matches(":hover")) {
        heroVideo.pause();
      }
    });

    var MEDIA_SHIFT = 60;
    var TITLE_SHIFT = -20;
    var targetX = 0;
    var targetY = 0;
    var curX = 0;
    var curY = 0;
    var rafId = null;

    var tick = function () {
      curX += (targetX - curX) * 0.1;
      curY += (targetY - curY) * 0.1;
      heroVideo.style.transform =
        "scale(1.12) translate(" + curX * MEDIA_SHIFT + "px, " + curY * MEDIA_SHIFT + "px)";
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

    hero.addEventListener("mouseenter", function () {
      heroVideo.play();
    });

    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
      queue();
    });

    hero.addEventListener("mouseleave", function () {
      heroVideo.pause();
      targetX = 0;
      targetY = 0;
      queue();
    });
  }

  // Waiting-list form. No backend is wired up yet: submissions are
  // acknowledged in the UI only. Point WAITLIST_ENDPOINT at a form
  // service (Formspree, Buttondown, Mailchimp...) to start collecting.
  var WAITLIST_ENDPOINT = "";
  var waitlistForm = document.getElementById("waitlistForm");
  var waitlistDone = document.getElementById("waitlistDone");

  if (waitlistForm && waitlistDone) {
    waitlistForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("waitlistEmail");
      if (!email.value || email.validity.typeMismatch || email.value.indexOf("@") < 1) {
        email.focus();
        return;
      }
      var finish = function () {
        waitlistForm.hidden = true;
        waitlistDone.hidden = false;
      };
      if (WAITLIST_ENDPOINT) {
        fetch(WAITLIST_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email: email.value })
        }).then(finish, finish);
      } else {
        finish();
      }
    });
  }

  var reveals = document.querySelectorAll(".reveal, .slide");

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
