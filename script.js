/* Jupiter Pressure Cleaning: menu, dropdown, open badge, lightbox, quote form, reveal, year */
(function () {
  document.documentElement.classList.remove("no-js");

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Services dropdown
  document.querySelectorAll(".dropdown").forEach(function (dd) {
    var btn = dd.querySelector(".dropdown-toggle");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!dd.contains(e.target)) { dd.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
    dd.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { dd.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); }
    });
  });

  // Open now badge (Mon to Sat, 8 AM to 5 PM Eastern)
  try {
    var parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var day = get("weekday"), h = parseInt(get("hour"), 10) % 24, m = parseInt(get("minute"), 10);
    var mins = h * 60 + m;
    var open = day !== "Sun" && mins >= 480 && mins < 1020;
    document.querySelectorAll("[data-open-badge]").forEach(function (el) {
      el.classList.toggle("is-open", open);
      el.textContent = open ? "Open now until 5 PM" : (day === "Sat" && mins >= 1020) || day === "Sun" ? "Closed, back Monday at 8 AM" : "Closed, opens at 8 AM";
    });
  } catch (e) { /* badge keeps its static text */ }

  // Lightbox
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var box = document.querySelector(".lightbox");
  if (items.length && box) {
    var img = box.querySelector("img"), count = box.querySelector(".lightbox-count"), idx = 0, last = null;
    var show = function (i) {
      idx = (i + items.length) % items.length;
      var src = items[idx].getAttribute("data-full"), alt = items[idx].querySelector("img").getAttribute("alt");
      img.src = src; img.alt = alt;
      count.textContent = "Photo " + (idx + 1) + " of " + items.length;
    };
    var openBox = function (i) { last = document.activeElement; show(i); box.classList.add("open"); box.querySelector(".lightbox-close").focus(); document.body.style.overflow = "hidden"; };
    var closeBox = function () { box.classList.remove("open"); document.body.style.overflow = ""; if (last) last.focus(); };
    items.forEach(function (it, i) { it.addEventListener("click", function () { openBox(i); }); });
    box.querySelector(".lightbox-close").addEventListener("click", closeBox);
    box.querySelector(".lightbox-prev").addEventListener("click", function () { show(idx - 1); });
    box.querySelector(".lightbox-next").addEventListener("click", function () { show(idx + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) closeBox(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") closeBox();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  // Quote form: ?service= prefill, then hand off as a text message to (561) 529-1356
  var form = document.getElementById("quote-form");
  if (form) {
    var svc = new URLSearchParams(window.location.search).get("service");
    if (svc) {
      var box2 = form.querySelector('input[name="service"][value="' + svc.replace(/[^a-z-]/g, "") + '"]');
      if (box2) box2.checked = true;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var fd = new FormData(form);
      var services = fd.getAll("service").map(function (v) {
        var el = form.querySelector('input[name="service"][value="' + v + '"]');
        return el ? el.getAttribute("data-label") : v;
      });
      var lines = [
        "Quote request from the website",
        "Name: " + fd.get("name"),
        "Phone: " + fd.get("phone"),
        "Town: " + fd.get("town"),
        "Services: " + (services.length ? services.join(", ") : "Not sure yet"),
        fd.get("details") ? "Details: " + fd.get("details") : ""
      ].filter(Boolean);
      var body = encodeURIComponent(lines.join("\n"));
      var status = form.querySelector(".form-status");
      if (status) status.textContent = "Opening your messages app. Add photos of the area before you hit send.";
      window.location.href = "sms:+15615291356?&body=" + body;
    });
  }

  // Reveal on scroll
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Year
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
