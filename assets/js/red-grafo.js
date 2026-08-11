/* ---------------------------------------------------------------------------
   red-grafo.js — visor de red (force-directed) para las redes de
   co-afiliación del campo jurídico. No dependencies, no CDN: the page embeds its JSON in a
   <script type="application/json"> tag and this reads it from there.

   Scale: the organizational projection is 351 nodes / 478 links and the
   catedra projection 362 / 685. Both are sparse and hub-and-spoke (median
   degree 1, max 117), so a plain O(n^2) repulsion is fine — roughly 65k pair
   operations per tick, which settles in well under a second.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  // The partial that injects this may emit it more than once on a page
  // (one call per figure). Registering twice would double-bind every
  // handler, so the second copy is a no-op.
  window.__netViewer = window.__netViewer || {};
  if (window.__netViewer.grafo) { return; }
  window.__netViewer.grafo = true;

  var FIELD_VAR = {
    "Academia": "--red-academia",
    "Judicatura": "--red-judicatura",
    "Abogacía": "--red-abogacia"
  };

  function cssVar(el, name) {
    return getComputedStyle(el).getPropertyValue(name).trim() || "#888";
  }

  function fieldColor(root, field) {
    return cssVar(root, FIELD_VAR[field] || "--red-muted");
  }

  /* --- Layout ------------------------------------------------------------ */

  // These graphs are overwhelmingly hub-and-spoke: in the organizational
  // projection 287 of 351 nodes have degree 1, hanging off a department. A
  // plain force simulation spends its whole budget fighting that — the
  // satellites get flung outward by repulsion with only one spring holding
  // them, and two stragglers are enough to squash the fit.
  //
  // So lay it out the way the data actually is. Force-simulate the CORE (the
  // ~60 nodes with more than one tie), then hang each satellite on an arc
  // around its own hub, pointing away from the centre. Deterministic, fast,
  // and it shows the real structure instead of hiding it in a blob.

  function seeded(seedVal) {
    var seed = seedVal >>> 0;
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function partition(nodes, links) {
    var deg = {}, nbrs = {};
    links.forEach(function (l) {
      deg[l.source] = (deg[l.source] || 0) + 1;
      deg[l.target] = (deg[l.target] || 0) + 1;
      (nbrs[l.source] = nbrs[l.source] || []).push(l.target);
      (nbrs[l.target] = nbrs[l.target] || []).push(l.source);
    });
    var core = [], leaves = [];
    nodes.forEach(function (n) {
      var d = deg[n.id] || 0;
      // A degree-1 node whose only neighbour is also degree-1 has nothing to
      // orbit, so it joins the core and gets simulated normally.
      var only = d === 1 ? (nbrs[n.id] || [])[0] : null;
      if (d >= 2 || d === 0 || (only && (deg[only] || 0) < 2)) core.push(n);
      else { n._hub = only; leaves.push(n); }
    });
    return { core: core, leaves: leaves, deg: deg };
  }

  function simulateCore(core, links, W, H, ticks) {
    var i, j, n = core.length, rnd = seeded(20260810);
    var inCore = {};
    core.forEach(function (d) { inCore[d.id] = d; });

    for (i = 0; i < n; i++) {
      var a = (i / Math.max(1, n)) * Math.PI * 2;
      var r = 0.30 * Math.min(W, H) * (0.55 + 0.45 * rnd());
      core[i].x = W / 2 + Math.cos(a) * r;
      core[i].y = H / 2 + Math.sin(a) * r;
      core[i].vx = 0; core[i].vy = 0;
      core[i].mass = 1 + Math.sqrt(core[i]._size || 1) / 5;
    }

    var edges = [];
    links.forEach(function (l) {
      var s = inCore[l.source], t = inCore[l.target];
      if (s && t) edges.push({ s: s, t: t, w: l.weight });
    });

    // Hubs need room for their satellite rings, so repulsion scales with the
    // ring radius each node will later claim.
    var alpha = 1, decay = Math.pow(0.02, 1 / ticks);

    for (var step = 0; step < ticks; step++) {
      for (i = 0; i < n; i++) {
        var ni = core[i];
        for (j = i + 1; j < n; j++) {
          var nj = core[j];
          var dx = nj.x - ni.x, dy = nj.y - ni.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 1) { dx = rnd() - 0.5; dy = rnd() - 0.5; d2 = 1; }
          var want = (ni._ring || 20) + (nj._ring || 20);
          var f = (want * want * 3.2) / d2;
          if (f > 60) f = 60;
          var d = Math.sqrt(d2);
          var fx = (dx / d) * f, fy = (dy / d) * f;
          ni.vx -= fx / ni.mass; ni.vy -= fy / ni.mass;
          nj.vx += fx / nj.mass; nj.vy += fy / nj.mass;
        }
      }
      for (i = 0; i < edges.length; i++) {
        var e = edges[i];
        var ex = e.t.x - e.s.x, ey = e.t.y - e.s.y;
        var el = Math.sqrt(ex * ex + ey * ey) || 0.01;
        // Rest length keeps both satellite rings clear of each other.
        var target = (e.s._ring || 20) + (e.t._ring || 20) + 40;
        var k = 0.05 * (1 + Math.log(1 + e.w) / 4);
        var force = (el - target) * k;
        var ux = (ex / el) * force, uy = (ey / el) * force;
        e.s.vx += ux / e.s.mass; e.s.vy += uy / e.s.mass;
        e.t.vx -= ux / e.t.mass; e.t.vy -= uy / e.t.mass;
      }
      for (i = 0; i < n; i++) {
        var p = core[i];
        p.vx += (W / 2 - p.x) * 0.012;
        p.vy += (H / 2 - p.y) * 0.012;
        p.x += p.vx * alpha; p.y += p.vy * alpha;
        p.vx *= 0.80; p.vy *= 0.80;
      }
      alpha *= decay;
    }
  }

  // Ring radius a hub must reserve for its satellites, so the core sim can
  // keep hubs far enough apart for the rings not to collide.
  function reserveRings(core, leaves) {
    var byHub = {};
    leaves.forEach(function (l) { (byHub[l._hub] = byHub[l._hub] || []).push(l); });
    core.forEach(function (h) {
      var kids = byHub[h.id] || [];
      h._kids = kids;
      if (!kids.length) { h._ring = h.r + 8; return; }
      // Enough circumference for every satellite at ~13px spacing, capped so
      // one huge hub cannot dominate the frame.
      var need = (kids.length * 13) / (Math.PI * 1.55);
      h._ring = Math.min(150, Math.max(h.r + 22, need));
    });
    return byHub;
  }

  function placeLeaves(core, W, H) {
    var cx = W / 2, cy = H / 2;
    core.forEach(function (h) {
      var kids = h._kids || [];
      if (!kids.length) return;
      // Fan the satellites outward, away from the graph centre, so they never
      // sit on top of the core.
      var base = Math.atan2(h.y - cy, h.x - cx);
      if (!isFinite(base)) base = 0;
      var span = Math.PI * 1.55;
      var perRing = Math.max(6, Math.ceil(kids.length / Math.ceil(kids.length / 26)));
      kids.sort(function (a, b) { return b._size - a._size; });
      kids.forEach(function (k, i) {
        var ring = Math.floor(i / perRing);
        var idx = i % perRing;
        var count = Math.min(perRing, kids.length - ring * perRing);
        var t = count === 1 ? 0.5 : idx / (count - 1);
        var ang = base - span / 2 + t * span;
        var rad = h._ring + ring * 17;
        k.x = h.x + Math.cos(ang) * rad;
        k.y = h.y + Math.sin(ang) * rad;
      });
    });
  }

  // padBottom is larger than pad: the zoom widget is parked in the
  // bottom-right corner of the plot and must not sit on top of marks.
  function fit(nodes, W, H, pad, padBottom) {
    padBottom = padBottom || pad;
    var xs = nodes.map(function (d) { return d.x; });
    var ys = nodes.map(function (d) { return d.y; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var availW = W - pad * 2, availH = H - pad - padBottom;
    var s = Math.min(availW / Math.max(1, x1 - x0), availH / Math.max(1, y1 - y0));
    nodes.forEach(function (d) {
      d.x = pad + (d.x - x0) * s + (availW - (x1 - x0) * s) / 2;
      d.y = pad + (d.y - y0) * s + (availH - (y1 - y0) * s) / 2;
      d.r = Math.max(2.6, d.r * Math.min(1, s * 1.12));
    });
  }

  /* --- Render ------------------------------------------------------------ */

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
    // The canvas is wiped on every redraw; the tooltip must NOT live inside
    // it or it is detached from the DOM the first time the graph re-renders.
    var canvas = root.querySelector(".red-canvas");
    var tip = root.querySelector(".red-tip");
    var sizeKey = root.dataset.sizeKey || "members";
    var labelCount = parseInt(root.dataset.labels || "14", 10);

    var W = 900, H = parseInt(root.dataset.height || "620", 10);

    var nodes = data.nodes.map(function (d) {
      var o = {}; for (var k in d) o[k] = d[k];
      o._size = d[sizeKey] || 0;
      return o;
    });

    // Radius by member count. sqrt keeps area proportional to the count, so a
    // department with 4x the members reads as 4x the ink, not 4x the width.
    var maxSize = Math.max.apply(null, nodes.map(function (d) { return d._size; })) || 1;
    nodes.forEach(function (d) {
      d._r0 = 3.4 + 17 * Math.sqrt(d._size / maxSize);
      d.r = d._r0;
    });

    var minW = 1;
    var slider = root.querySelector(".red-minw");
    if (slider) minW = parseInt(slider.value, 10);

    var svgNS = "http://www.w3.org/2000/svg";
    var svg, gLink, gNode, gLabel, byId;

    function draw() {
      var links = data.links.filter(function (l) { return l.weight >= minW; });

      // Drop nodes that no surviving link touches, so raising the threshold
      // does not leave a field of orphan dots.
      var keep = {};
      links.forEach(function (l) { keep[l.source] = 1; keep[l.target] = 1; });
      var shown = nodes.filter(function (d) { return keep[d.id]; });

      // Re-layout on every threshold change: raising it turns hubs into
      // leaves and vice versa, so the partition is not stable across values.
      shown.forEach(function (d) { d.r = d._r0; });
      var part = partition(shown, links);
      reserveRings(part.core, part.leaves);
      simulateCore(part.core, links, W, H, 420);
      placeLeaves(part.core, W, H);
      fit(shown, W, H, 30, 34);
      byId = {};
      shown.forEach(function (d) { byId[d.id] = d; });

      canvas.textContent = "";
      svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", (data.meta && data.meta.title) || "Diagrama de red");
      canvas.appendChild(svg);

      // Everything zoomable hangs off one layer, which red-zoom transforms.
      var layer = document.createElementNS(svgNS, "g");
      layer.setAttribute("class", "red-layer");
      svg.appendChild(layer);

      gLink = document.createElementNS(svgNS, "g");
      gNode = document.createElementNS(svgNS, "g");
      gLabel = document.createElementNS(svgNS, "g");
      layer.appendChild(gLink); layer.appendChild(gNode); layer.appendChild(gLabel);

      var maxW = Math.max.apply(null, links.map(function (l) { return l.weight; })) || 1;

      links.forEach(function (l) {
        var s = byId[l.source], t = byId[l.target];
        if (!s || !t || !keep[s.id] || !keep[t.id]) return;
        var ln = document.createElementNS(svgNS, "line");
        ln.setAttribute("x1", s.x.toFixed(1)); ln.setAttribute("y1", s.y.toFixed(1));
        ln.setAttribute("x2", t.x.toFixed(1)); ln.setAttribute("y2", t.y.toFixed(1));
        // Thin marks: hairline for a single shared person, 4px at the maximum.
        ln.setAttribute("stroke-width", (0.5 + 3.5 * Math.sqrt(l.weight / maxW)).toFixed(2));
        ln.setAttribute("stroke-opacity", 0.32);
        ln.setAttribute("class", "red-link");
        ln.setAttribute("vector-effect", "non-scaling-stroke");
        ln.dataset.s = l.source; ln.dataset.t = l.target;
        gLink.appendChild(ln);
      });

      shown.forEach(function (d) {
        var g = document.createElementNS(svgNS, "g");
        g.setAttribute("class", "red-node");
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "listitem");
        g.setAttribute("aria-label", d.label + ", " + d.field + ", " + d._size + " miembros");

        // Invisible hit circle: >=24px target even for the smallest dots.
        var hit = document.createElementNS(svgNS, "circle");
        hit.setAttribute("cx", d.x.toFixed(1)); hit.setAttribute("cy", d.y.toFixed(1));
        hit.setAttribute("r", Math.max(12, d.r + 4).toFixed(1));
        hit.setAttribute("fill", "transparent");
        g.appendChild(hit);

        var c = document.createElementNS(svgNS, "circle");
        c.setAttribute("class", "mark");
        c.setAttribute("cx", d.x.toFixed(1)); c.setAttribute("cy", d.y.toFixed(1));
        c.setAttribute("r", d.r.toFixed(1));
        c.setAttribute("fill", fieldColor(root, d.field));
        c.setAttribute("fill-opacity", 0.85);
        c.setAttribute("vector-effect", "non-scaling-stroke");
        g.appendChild(c);

        g.addEventListener("mouseenter", function (e) { showTip(d, e); highlight(d); });
        g.addEventListener("focus", function () { showTip(d, null); highlight(d); });
        g.addEventListener("mousemove", function (e) { moveTip(e); });
        g.addEventListener("mouseleave", clear);
        g.addEventListener("blur", clear);
        gNode.appendChild(g);
        d._el = g;
      });

      // Selective direct labels: the largest nodes only, and a label is
      // dropped rather than allowed to collide with one already placed. A
      // label on every node is the classic network-chart failure.
      var placed = [];
      shown.slice().sort(function (a, b) { return b._size - a._size; })
        .forEach(function (d) {
          if (placed.length >= labelCount) return;
          var txt = d.label.length > 32 ? d.label.slice(0, 30) + "…" : d.label;
          var w = txt.length * 5.1, h = 11;
          var x = d.x - w / 2, y = d.y - d.r - 4 - h;
          var hit = placed.some(function (b) {
            return !(x + w < b.x || b.x + b.w < x || y + h < b.y || b.y + b.h < y);
          });
          if (hit) return;
          placed.push({ x: x, y: y, w: w, h: h });
          var t = document.createElementNS(svgNS, "text");
          t.setAttribute("class", "red-label");
          t.setAttribute("x", d.x.toFixed(1));
          t.setAttribute("y", (d.y - d.r - 4).toFixed(1));
          t.setAttribute("text-anchor", "middle");
          t.textContent = txt;
          gLabel.appendChild(t);
        });

      var cnt = root.querySelector(".red-count");
      if (cnt) cnt.textContent = shown.length + " nodos · " + links.length + " vínculos";

      if (window.redZoom) {
        window.redZoom.attach({
          svg: svg, layer: layer, root: root, width: W, height: H
        });
      }
    }

    function highlight(d) {
      var nbr = {}; nbr[d.id] = 1;
      Array.prototype.forEach.call(gLink.children, function (ln) {
        var on = ln.dataset.s === d.id || ln.dataset.t === d.id;
        ln.classList.toggle("red-dim", !on);
        if (on) { nbr[ln.dataset.s] = 1; nbr[ln.dataset.t] = 1; }
      });
      Array.prototype.forEach.call(gNode.children, function (g) {
        var lbl = g.getAttribute("aria-label") || "";
        g.classList.toggle("red-dim", false);
      });
      nodes.forEach(function (n) {
        if (n._el) n._el.classList.toggle("red-dim", !nbr[n.id]);
      });
      Array.prototype.forEach.call(gLabel.children, function (t) { t.classList.add("red-dim"); });
    }

    function clear() {
      if (!gLink) return;
      Array.prototype.forEach.call(gLink.children, function (l) { l.classList.remove("red-dim"); });
      nodes.forEach(function (n) { if (n._el) n._el.classList.remove("red-dim"); });
      Array.prototype.forEach.call(gLabel.children, function (t) { t.classList.remove("red-dim"); });
      tip.dataset.show = "0";
    }

    function showTip(d, e) {
      var swatch = '<span class="red-tip__dot" style="background:' +
        fieldColor(root, d.field) + '"></span>';
      var rows = "<dt>Campo</dt><dd>" + swatch + esc(d.field) + "</dd>" +
        "<dt>Miembros</dt><dd>" + d._size.toLocaleString("es-AR") + "</dd>" +
        "<dt>Vínculos</dt><dd>" + d.degree + "</dd>";
      if (typeof d.betweenness === "number") {
        rows += "<dt>Intermediación</dt><dd>" + d.betweenness.toFixed(3) + "</dd>";
      }
      tip.innerHTML = "<b>" + esc(d.label) + "</b><dl>" + rows + "</dl>";
      tip.dataset.show = "1";
      if (e) moveTip(e);
      else {
        var pr = plot.getBoundingClientRect();
        tip.dataset.side = "right";
        tip.style.left = Math.min((d.x / W) * pr.width + 14, pr.width - 260) + "px";
        tip.style.top = Math.max(2, (d.y / H) * pr.height - 12) + "px";
      }
    }

    function moveTip(e) {
      var pr = plot.getBoundingClientRect();
      var x = e.clientX - pr.left, y = e.clientY - pr.top;
      var w = tip.offsetWidth || 250;
      var flip = x + w + 22 > pr.width;
      tip.dataset.side = flip ? "left" : "right";
      tip.style.left = (flip ? x - w - 14 : x + 14) + "px";
      tip.style.top = Math.max(2, Math.min(y - 12, pr.height - (tip.offsetHeight || 90) - 4)) + "px";
    }

    if (slider) {
      slider.addEventListener("input", function () {
        minW = parseInt(slider.value, 10);
        var out = root.querySelector(".red-minw-out");
        if (out) out.textContent = minW;
        draw();
      });
    }

    buildTable(root, data, sizeKey);
    wireToggle(root);
    draw();
  }

  /* --- Table view (the WCAG-clean twin every figure must have) ----------- */

  function buildTable(root, data, sizeKey) {
    var wrap = root.querySelector(".red-table-wrap");
    if (!wrap) return;
    var rows = data.nodes.slice().sort(function (a, b) {
      return (b[sizeKey] || 0) - (a[sizeKey] || 0);
    });
    var hasBt = rows.some(function (r) { return typeof r.betweenness === "number"; });
    var html = '<table class="red-table"><caption>' +
      esc((data.meta && data.meta.title) || "Red") +
      " — las " + rows.length + " organizaciones, ordenadas por tamaño.</caption><thead><tr>" +
      "<th scope=\"col\">Organización</th><th scope=\"col\">Campo</th>" +
      "<th scope=\"col\" class=\"num\">Miembros</th><th scope=\"col\" class=\"num\">Vínculos</th>" +
      (hasBt ? "<th scope=\"col\" class=\"num\">Intermediación</th>" : "") +
      "</tr></thead><tbody>";
    rows.forEach(function (r) {
      var v = FIELD_VAR[r.field] || "--red-muted";
      html += "<tr><td>" + esc(r.label) + "</td>" +
        '<td class="field"><span class="dot" style="background:var(' + v + ')"></span>' + esc(r.field) + "</td>" +
        '<td class="num">' + (r[sizeKey] || 0).toLocaleString("es-AR") + "</td>" +
        '<td class="num">' + r.degree + "</td>" +
        (hasBt ? '<td class="num">' + (r.betweenness || 0).toFixed(3) + "</td>" : "") +
        "</tr>";
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
    document.querySelectorAll(".red-root[data-viz='grafo']").forEach(render);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
