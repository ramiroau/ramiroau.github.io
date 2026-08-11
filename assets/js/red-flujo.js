/* ---------------------------------------------------------------------------
   red-flujo.js — diagrama de flujo de dos etapas (Sankey/aluvial) para el
   micrositio de redes. Drives both the department-to-court figure and the cross-field
   seniority figure; they differ only in how ribbons are coloured.

   Colour modes:
     single   one hue, opacity carries nothing but overlap (dept -> court,
              where 13 source categories would blow past the ~7-class limit
              at which adjacent classes stop being distinguishable)
     ordinal  a validated single-hue 5-step ramp keyed to source rank
              (seniority, where the source IS ordered and colour should say so)
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  // The partial that injects this may emit it more than once on a page
  // (one call per figure). Registering twice would double-bind every
  // handler, so the second copy is a no-op.
  window.__netViewer = window.__netViewer || {};
  if (window.__netViewer.flujo) { return; }
  window.__netViewer.flujo = true;

  var FIELD_VAR = {
    "Academia": "--red-academia",
    "Judicatura": "--red-judicatura",
    "Abogacía": "--red-abogacia"
  };
  var RANK_VARS = ["--red-rango-1", "--red-rango-2", "--red-rango-3",
                   "--red-rango-4", "--red-rango-5"];

  function cssVar(el, n) {
    return getComputedStyle(el).getPropertyValue(n).trim() || "#888";
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function render(root) {
    var dataEl = root.querySelector('script[type="application/json"]');
    if (!dataEl) return;
    var data = JSON.parse(dataEl.textContent);

    var plot = root.querySelector(".red-plot");
    // Cleared on every redraw — the tooltip must live outside it.
    var canvas = root.querySelector(".red-canvas");
    var tip = root.querySelector(".red-tip");
    var colorMode = root.dataset.color || "single";

    var svgNS = "http://www.w3.org/2000/svg";
    var W = 900;
    var PAD_X = 8, NODE_W = 13, GAP = 5, TOP = 34, BOT = 20;

    // Ribbon order follows total volume so the heaviest flows sit at the top
    // and the eye lands on them first.
    function layout(links) {
      var stage0 = data.nodes.filter(function (n) { return n.stage === 0; });
      var stage1 = data.nodes.filter(function (n) { return n.stage === 1; });

      var tot = {};
      links.forEach(function (l) {
        tot[l.source] = (tot[l.source] || 0) + l.weight;
        tot[l.target] = (tot[l.target] || 0) + l.weight;
      });

      stage0 = stage0.filter(function (n) { return tot[n.id]; });
      stage1 = stage1.filter(function (n) { return tot[n.id]; });
      var order = function (a, b) { return (tot[b.id] || 0) - (tot[a.id] || 0); };
      stage0.sort(order); stage1.sort(order);

      var sum0 = stage0.reduce(function (s, n) { return s + tot[n.id]; }, 0);
      var sum1 = stage1.reduce(function (s, n) { return s + tot[n.id]; }, 0);
      var maxSum = Math.max(sum0, sum1) || 1;
      var maxCount = Math.max(stage0.length, stage1.length);

      // Height is driven by how many rows must fit legibly, not by a constant.
      // LABEL_SP is the floor: every node needs that much vertical room for
      // its own text, whatever its band height works out to.
      var LABEL_SP = 12.5;
      var H = Math.max(300, TOP + BOT + maxCount * (LABEL_SP + 4) + 30);
      var avail = H - TOP - BOT - (maxCount - 1) * GAP;
      var unit = avail / maxSum;

      var pos = {};
      [stage0, stage1].forEach(function (col, ci) {
        var y = TOP;
        col.forEach(function (n) {
          var h = Math.max(2.5, (tot[n.id] || 0) * unit);
          pos[n.id] = {
            node: n, x: ci === 0 ? PAD_X : W - PAD_X - NODE_W,
            y: y, h: h, total: tot[n.id] || 0, stage: ci,
            offIn: 0, offOut: 0
          };
          y += h + GAP;
        });

        // Separate the LABELS without moving the bands. Thin bands would
        // otherwise stack their text on top of itself at the bottom of the
        // column, which is where the long court names all end up.
        var rows = col.map(function (n) { return pos[n.id]; });
        rows.forEach(function (p) { p.ly = p.y + p.h / 2; });
        for (var i = 1; i < rows.length; i++) {
          if (rows[i].ly - rows[i - 1].ly < LABEL_SP) {
            rows[i].ly = rows[i - 1].ly + LABEL_SP;
          }
        }
        // Reverse pass: if separation pushed the last label past the bottom,
        // walk back up so the column stays inside the frame.
        var overflow = rows.length ? rows[rows.length - 1].ly - (H - BOT) : 0;
        if (overflow > 0) {
          for (var j = rows.length - 1; j >= 0; j--) {
            rows[j].ly -= overflow;
            if (j > 0 && rows[j].ly - rows[j - 1].ly >= LABEL_SP) break;
          }
        }
      });
      return { pos: pos, H: H, stage0: stage0, stage1: stage1 };
    }

    function ribbonColor(l, i) {
      if (colorMode === "ordinal") {
        // Source ids look like "a1".."a5"; fall back to position if not.
        var m = /(\d+)\s*$/.exec(l.source);
        var idx = m ? Math.min(4, Math.max(0, parseInt(m[1], 10) - 1)) : i % 5;
        return cssVar(root, RANK_VARS[idx]);
      }
      return cssVar(root, "--red-flujo");
    }

    function draw() {
      var minW = 0;
      var slider = root.querySelector(".red-minw");
      if (slider) minW = parseInt(slider.value, 10);
      var links = data.links.filter(function (l) { return l.weight >= minW; })
        .slice().sort(function (a, b) { return b.weight - a.weight; });

      var L = layout(links);
      var pos = L.pos, H = L.H;

      canvas.textContent = "";
      var svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", (data.meta && data.meta.title) || "Diagrama de flujo");
      canvas.appendChild(svg);

      var layer = document.createElementNS(svgNS, "g");
      layer.setAttribute("class", "red-layer");
      svg.appendChild(layer);

      var gBand = document.createElementNS(svgNS, "g");
      var gNode = document.createElementNS(svgNS, "g");
      var gText = document.createElementNS(svgNS, "g");
      layer.appendChild(gBand); layer.appendChild(gNode); layer.appendChild(gText);

      // Stage headings
      (data.stages || []).forEach(function (s, i) {
        var t = document.createElementNS(svgNS, "text");
        t.setAttribute("class", "red-stage-label");
        t.setAttribute("x", i === 0 ? PAD_X : W - PAD_X);
        t.setAttribute("y", 16);
        t.setAttribute("text-anchor", i === 0 ? "start" : "end");
        t.textContent = s;
        gText.appendChild(t);
      });

      var unit = null;
      links.forEach(function (l, i) {
        var s = pos[l.source], t = pos[l.target];
        if (!s || !t) return;
        if (unit === null) unit = s.h / s.total;
        var hs = (l.weight / s.total) * s.h;
        var ht = (l.weight / t.total) * t.h;
        var y0 = s.y + s.offOut, y1 = t.y + t.offIn;
        s.offOut += hs; t.offIn += ht;

        var x0 = s.x + NODE_W, x1 = t.x;
        var mx = (x0 + x1) / 2;
        var d = "M" + x0 + "," + y0 +
          "C" + mx + "," + y0 + " " + mx + "," + y1 + " " + x1 + "," + y1 +
          "L" + x1 + "," + (y1 + ht) +
          "C" + mx + "," + (y1 + ht) + " " + mx + "," + (y0 + hs) + " " + x0 + "," + (y0 + hs) + "Z";

        var p = document.createElementNS(svgNS, "path");
        p.setAttribute("d", d);
        p.setAttribute("fill", ribbonColor(l, i));
        // In ordinal mode the colour IS the encoding, so keep it near the
        // validated value; heavy transparency would flatten the five steps
        // into indistinguishable greys. In single mode the hue carries no
        // meaning, so it can stay light and let overlaps read.
        p.setAttribute("fill-opacity", colorMode === "ordinal" ? 0.72 : 0.42);
        p.setAttribute("class", "red-band");
        p.setAttribute("tabindex", "0");
        p.setAttribute("role", "listitem");
        p.setAttribute("aria-label",
          s.node.label + " a " + t.node.label + ", " + l.weight + " personas");

        function on(e) {
          Array.prototype.forEach.call(gBand.children, function (o) {
            o.classList.toggle("red-dim", o !== p);
          });
          p.setAttribute("fill-opacity", colorMode === "ordinal" ? 0.95 : 0.78);
          tip.innerHTML = "<b>" + esc(s.node.label) + " → " + esc(t.node.label) + "</b><dl>" +
            "<dt>Personas</dt><dd>" + l.weight.toLocaleString("es-AR") + "</dd>" +
            "<dt>Proporción del origen</dt><dd>" +
            Math.round((l.weight / s.total) * 100) + "%</dd></dl>";
          tip.dataset.show = "1";
          if (e && e.clientX) move(e);
          else {
            var pr = plot.getBoundingClientRect();
            tip.style.left = (mx / W) * pr.width + "px";
            tip.style.top = ((y0 / H) * pr.height) + "px";
          }
        }
        function move(e) {
          var pr = plot.getBoundingClientRect();
          var x = e.clientX - pr.left, y = e.clientY - pr.top;
          var w = tip.offsetWidth || 250;
          var flip = x + w + 22 > pr.width;
          tip.dataset.side = flip ? "left" : "right";
          tip.style.left = (flip ? x - w - 14 : x + 14) + "px";
          tip.style.top = Math.max(2, Math.min(y - 12, pr.height - (tip.offsetHeight || 90) - 4)) + "px";
        }
        function off() {
          Array.prototype.forEach.call(gBand.children, function (o) { o.classList.remove("red-dim"); });
          p.setAttribute("fill-opacity", colorMode === "ordinal" ? 0.72 : 0.42);
          tip.dataset.show = "0";
        }
        p.addEventListener("mouseenter", on);
        p.addEventListener("mousemove", move);
        p.addEventListener("focus", on);
        p.addEventListener("mouseleave", off);
        p.addEventListener("blur", off);
        gBand.appendChild(p);
      });

      // Stage nodes + direct labels. Both stages are small enough (28 and 10
      // nodes) that every node can carry its label without collision.
      Object.keys(pos).forEach(function (id) {
        var p = pos[id];
        var r = document.createElementNS(svgNS, "rect");
        r.setAttribute("x", p.x); r.setAttribute("y", p.y.toFixed(1));
        r.setAttribute("width", NODE_W); r.setAttribute("height", p.h.toFixed(1));
        r.setAttribute("rx", 2);
        r.setAttribute("fill", cssVar(root, FIELD_VAR[p.node.field] || "--red-muted"));
        gNode.appendChild(r);

        var t = document.createElementNS(svgNS, "text");
        t.setAttribute("class", "red-label");
        var inside = p.stage === 0;
        t.setAttribute("x", inside ? p.x + NODE_W + 6 : p.x - 6);
        t.setAttribute("y", ((p.ly !== undefined ? p.ly : p.y + p.h / 2) + 3.5).toFixed(1));
        t.setAttribute("text-anchor", inside ? "start" : "end");
        var lab = p.node.label;
        if (lab.length > 46) lab = lab.slice(0, 44) + "…";
        t.textContent = lab + "  (" + p.total.toLocaleString("es-AR") + ")";
        gText.appendChild(t);
      });

      var cnt = root.querySelector(".red-count");
      if (cnt) cnt.textContent = links.length + " vínculos";

      if (window.redZoom) {
        window.redZoom.attach({
          svg: svg, layer: layer, root: root, width: W, height: H
        });
      }
    }

    var slider = root.querySelector(".red-minw");
    if (slider) {
      slider.addEventListener("input", function () {
        var out = root.querySelector(".red-minw-out");
        if (out) out.textContent = slider.value;
        draw();
      });
    }

    buildTable(root, data);
    wireToggle(root);
    draw();
  }

  function buildTable(root, data) {
    var wrap = root.querySelector(".red-table-wrap");
    if (!wrap) return;
    var byId = {};
    data.nodes.forEach(function (n) { byId[n.id] = n; });
    var rows = data.links.slice().sort(function (a, b) { return b.weight - a.weight; });
    var html = '<table class="red-table"><caption>' +
      esc((data.meta && data.meta.title) || "Flujos") +
      " — los " + rows.length + " vínculos, ordenados por tamaño.</caption><thead><tr>" +
      "<th scope=\"col\">" + esc((data.stages || [])[0] || "Origen") + "</th>" +
      "<th scope=\"col\">" + esc((data.stages || [])[1] || "Destino") + "</th>" +
      "<th scope=\"col\" class=\"num\">Personas</th></tr></thead><tbody>";
    rows.forEach(function (r) {
      html += "<tr><td>" + esc((byId[r.source] || {}).label || r.source) + "</td>" +
        "<td>" + esc((byId[r.target] || {}).label || r.target) + "</td>" +
        '<td class="num">' + r.weight.toLocaleString("es-AR") + "</td></tr>";
    });
    wrap.innerHTML = html + "</tbody></table>";
  }

  function wireToggle(root) {
    var btns = root.querySelectorAll(".red-toggle button");
    var plot = root.querySelector(".red-plot");
    var table = root.querySelector(".red-table-wrap");
    var legend = root.querySelector(".red-legend");
    var zoombar = root.querySelector(".red-zoombar");
    if (!btns.length) return;
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("click", function () {
        var view = b.dataset.view;
        Array.prototype.forEach.call(btns, function (o) {
          o.setAttribute("aria-pressed", String(o === b));
        });
        plot.hidden = view !== "chart";
        if (table) table.hidden = view !== "table";
        if (legend) legend.hidden = view !== "chart";
        if (zoombar) zoombar.hidden = view !== "chart";
      });
    });
  }

  function init() {
    document.querySelectorAll(".red-root[data-viz='flujo']").forEach(render);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
