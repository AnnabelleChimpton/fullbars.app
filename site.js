// The dead-zone demo and the copy buttons on the setup page.
(function () {
  "use strict";
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Copy buttons on command blocks.
  var blocks = document.querySelectorAll(".cmd");
  for (var b = 0; b < blocks.length; b++) (function (block) {
    if (!navigator.clipboard) return;
    var pre = block.querySelector("pre");
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "copy"; btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy command" + (block.getAttribute("data-what") ? ": " + block.getAttribute("data-what") : ""));
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(pre.innerText.replace(/\n$/, "")).then(function () {
        btn.textContent = "Copied"; btn.setAttribute("data-done", "");
        setTimeout(function () { btn.textContent = "Copy"; btn.removeAttribute("data-done"); }, 1200);
      });
    });
    (block.querySelector(".cmd-h") || block).appendChild(btn);
  })(blocks[b]);

  // The dead-zone simulation.
  var route = document.getElementById("route");
  if (!route) return;
  var sim = document.getElementById("sim");
  var pill = document.getElementById("pill");
  var pillText = document.getElementById("pill-text");
  var outLabel = document.getElementById("out-label");
  var seeText = document.getElementById("viewers-see");
  var timer = document.getElementById("timer");
  var lanes = route.querySelectorAll("[data-link]");

  // Made-up but plausible figures, in Mb/s, one row per step.
  var script = [
    [1.8, 2.2, 1.1], [1.6, 2.4, 1.0], [1.2, 2.6, 1.3], [0.9, 2.7, 1.5], [1.3, 2.3, 1.4], [1.7, 2.1, 1.2]
  ];
  var t = 0, down = false, returning = false, seconds = 24 * 60 + 18;

  function bars(v) { return v < 0.6 ? 1 : v < 1.2 ? 2 : v < 1.8 ? 3 : 4; }
  function setLane(lane, v) {
    var meter = lane.querySelector(".meter"), val = lane.querySelector(".val"), is = meter.children;
    if (v === null) {
      lane.classList.add("down"); meter.classList.add("dashed"); val.textContent = "DOWN";
      return;
    }
    lane.classList.remove("down"); meter.classList.remove("dashed");
    var n = bars(v);
    for (var i = 0; i < is.length; i++) is[i].className = i < n ? "" : "off";
    val.textContent = v.toFixed(1);
  }
  function render() {
    var row = script[t % script.length];
    for (var i = 0; i < lanes.length; i++) setLane(lanes[i], down ? null : row[i]);
  }
  function clock() {
    var h = Math.floor(seconds / 3600), m = Math.floor(seconds / 60) % 60, s = seconds % 60;
    timer.textContent = "LIVE " + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  sim.addEventListener("click", function () {
    down = !down;
    sim.setAttribute("aria-pressed", String(down));
    route.setAttribute("data-state", down ? "down" : "live");
    if (down) {
      render();
      pill.setAttribute("data-state", "down");
      pillText.textContent = "Reconnecting";
      outLabel.textContent = "Signal lost card";
      seeText.textContent = "Viewers see your Signal lost card. Still live.";
      sim.textContent = "Back in coverage";
      announce("Every connection is down. Viewers see your Signal lost card, and Twitch stays live.");
    } else {
      // Links come back one at a time, in steps.
      var row = script[t % script.length], order = [1, 0, 2];
      returning = true;
      sim.textContent = "Drive into a dead zone";
      order.forEach(function (idx, k) {
        setTimeout(function () {
          if (down) return;
          setLane(lanes[idx], row[idx]);
          if (k === order.length - 1) returning = false;
          if (k === 0) {
            pill.setAttribute("data-state", "live");
            pillText.textContent = "Live · Great";
            outLabel.textContent = "One stream";
            seeText.textContent = "Viewers see you again.";
            announce("Back. Viewers see you again.");
          }
        }, reduced ? 0 : 400 + k * 600);
      });
    }
  });

  var live = document.createElement("p");
  live.className = "sr"; live.setAttribute("aria-live", "polite");
  route.parentNode.appendChild(live);
  pill.removeAttribute("aria-live"); pill.removeAttribute("role");
  function announce(s) { live.textContent = s; }

  if (!reduced) {
    setInterval(function () { seconds++; clock(); }, 1000);
    setInterval(function () { if (!down && !returning) { t++; render(); } }, 1600);
  }
})();
