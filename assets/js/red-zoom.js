/* ---------------------------------------------------------------------------
   red-zoom.js — pan and zoom for the network figures.

   Shared by red-grafo.js and red-flujo.js. Works by transforming a single
   <g> inside the SVG rather than rewriting the viewBox, so hit areas, focus
   rings and the tooltip anchoring all follow the marks for free.

   Interaction:
     wheel / trackpad pinch   zoom about the pointer
     drag                     pan
     + / - / 0 buttons        zoom in, out, reset
     double click             reset
     keyboard                 the buttons are real buttons and tabbable

   Marks are counter-scaled where it matters: strokes and label text keep
   their on-screen size as you zoom in, so a zoomed graph reads like a map,
   not like a magnified image.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  window.__netViewer = window.__netViewer || {};
  if (window.__netViewer.zoom) { return; }
  window.__netViewer.zoom = true;

  var MIN = 1, MAX = 12;

  function attach(opts) {
    var svg = opts.svg;              // <svg>
    var layer = opts.layer;          // <g> holding everything zoomable
    var root = opts.root;            // .red-root, for the buttons
    var W = opts.width, H = opts.height;
    var onChange = opts.onChange || function () {};

    var k = 1, tx = 0, ty = 0;
    var dragging = false, moved = false, sx = 0, sy = 0, stx = 0, sty = 0;

    function clamp() {
      k = Math.max(MIN, Math.min(MAX, k));
      // Never let the content leave the frame entirely.
      var maxX = 0, minX = W - W * k;
      var maxY = 0, minY = H - H * k;
      tx = Math.max(minX, Math.min(maxX, tx));
      ty = Math.max(minY, Math.min(maxY, ty));
    }

    function apply() {
      clamp();
      layer.setAttribute("transform", "translate(" + tx + "," + ty + ") scale(" + k + ")");
      // Counter-scale so line weight and type stay constant on screen.
      layer.style.setProperty("--red-k", k);
      onChange(k);
      var out = root.querySelector(".red-zoom-level");
      if (out) out.textContent = Math.round(k * 100) + "%";
      var rst = root.querySelector('[data-zoom="reset"]');
      if (rst) rst.disabled = (k === 1 && tx === 0 && ty === 0);
    }

    // Convert a client point to SVG user units, so zoom stays anchored under
    // the pointer instead of jumping to the centre.
    function toUser(clientX, clientY) {
      var r = svg.getBoundingClientRect();
      return {
        x: ((clientX - r.left) / r.width) * W,
        y: ((clientY - r.top) / r.height) * H
      };
    }

    function zoomAt(factor, cx, cy) {
      var before = k;
      k = k * factor;
      clamp();
      var applied = k / before;
      tx = cx - (cx - tx) * applied;
      ty = cy - (cy - ty) * applied;
      apply();
    }

    svg.addEventListener("wheel", function (e) {
      // Only take over the wheel once the user is actually zooming; a plain
      // scroll should still move the page.
      if (!e.ctrlKey && Math.abs(e.deltaY) < 8) return;
      e.preventDefault();
      var p = toUser(e.clientX, e.clientY);
      zoomAt(Math.pow(0.9985, e.deltaY * (e.ctrlKey ? 4 : 1)), p.x, p.y);
    }, { passive: false });

    svg.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      dragging = true; moved = false;
      sx = e.clientX; sy = e.clientY; stx = tx; sty = ty;
      svg.setPointerCapture(e.pointerId);
      svg.classList.add("is-panning");
    });

    svg.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var r = svg.getBoundingClientRect();
      var dx = ((e.clientX - sx) / r.width) * W;
      var dy = ((e.clientY - sy) / r.height) * H;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) moved = true;
      tx = stx + dx; ty = sty + dy;
      apply();
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      svg.classList.remove("is-panning");
      try { svg.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    svg.addEventListener("pointerup", endDrag);
    svg.addEventListener("pointercancel", endDrag);

    svg.addEventListener("dblclick", function (e) {
      e.preventDefault();
      k = 1; tx = 0; ty = 0; apply();
    });

    var btns = root.querySelectorAll("[data-zoom]");
    Array.prototype.forEach.call(btns, function (b) {
      b.onclick = function () {
        var a = b.dataset.zoom;
        if (a === "reset") { k = 1; tx = 0; ty = 0; apply(); }
        else zoomAt(a === "in" ? 1.45 : 1 / 1.45, W / 2, H / 2);
      };
    });

    apply();
    return {
      // True while a drag is in progress, so click handlers can ignore the
      // pointerup that ends a pan.
      panned: function () { return moved; }
    };
  }

  window.redZoom = { attach: attach };
})();
