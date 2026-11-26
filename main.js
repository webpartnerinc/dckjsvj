/* ============================================================
   N B G NANAYAKKARA & CO — main.js
   Counters · 3D tilt · scroll reveal · nav state
   ============================================================ */
(function () {
  "use strict";

  /* JS is active: undo the no-js fallbacks */
  document.documentElement.classList.remove("no-js");

  /* ---------- header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- animated counters ---------- */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-target") || "0");
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var duration = parseInt(el.getAttribute("data-duration") || "1800", 10);
    var start = null;

    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var val = target * easeOutCubic(p);
      el.textContent = val.toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  }

  var counters = document.querySelectorAll("[data-target]");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            runCounter(e.target);
            co.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = parseFloat(el.getAttribute("data-target")).toFixed(
        parseInt(el.getAttribute("data-decimals") || "0", 10)
      );
    });
  }

  /* ---------- 3D tilt effect ---------- */
  var canHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (canHover) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var strength = parseFloat(card.getAttribute("data-tilt")) || 8;
      var raf = null;

      function move(ev) {
        var r = card.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width;
        var py = (ev.clientY - r.top) / r.height;
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var rx = (0.5 - py) * strength;
          var ry = (px - 0.5) * strength;
          card.style.transform =
            "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
          raf = null;
        });
      }

      function reset() {
        card.style.transform = "";
      }

      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", reset);
    });
  }

  /* ---------- contact form → WhatsApp composer ---------- */
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var v = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };
      var name = v("f-name");
      var phone = v("f-phone");
      var service = v("f-service");
      var msg = v("f-message");

      var text = encodeURIComponent(
        "Hello N B G Nanayakkara & Co,\n\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Service needed: " + service + "\n" +
        "Message: " + msg
      );

      var wa = "https://wa.me/94773038540?text=" + text;
      window.open(wa, "_blank", "noopener");

      var note = document.getElementById("form-note");
      if (note) {
        note.innerHTML =
          "Thank you, " + name.replace(/[<>&]/g, "") +
          "! WhatsApp is opening with your enquiry ready to send. " +
          "If it did not open, call us on " +
          "<a href=\"tel:+94773038540\" style=\"color:#74A377\">077 303 8540</a>.";
      }
      form.reset();
    });
  }

  /* ---------- current year in footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
