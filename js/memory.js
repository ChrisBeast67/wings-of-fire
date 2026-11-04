/* ============================================
   WINGS OF FIRE — Tribe Match memory game
   ============================================ */
(function () {
  "use strict";

  var board = document.getElementById("memBoard");
  if (!board) return;
  var movesEl = document.getElementById("memMoves");
  var pairsEl = document.getElementById("memPairs");
  var bestEl = document.getElementById("memBest");
  var msgEl = document.getElementById("memMsg");
  var btnEl = document.getElementById("memBtn");
  var liveEl = document.getElementById("memLive");

  var FACES = [
    { e: "🌊", n: "SeaWing" },
    { e: "🌿", n: "MudWing" },
    { e: "🌵", n: "SandWing" },
    { e: "🦅", n: "SkyWing" },
    { e: "🌙", n: "NightWing" },
    { e: "❄️", n: "IceWing" },
    { e: "🌧️", n: "RainWing" },
    { e: "🕸️", n: "SilkWing" },
    { e: "🐝", n: "HiveWing" },
    { e: "🏝️", n: "WildWing" }
  ];

  var BEST_KEY = "wof_tribematch_best";
  var first = null, lock = false, moves = 0, matched = 0, best = 0;

  try { best = parseInt(localStorage.getItem(BEST_KEY) || "0", 10) || 0; } catch (e) { best = 0; }
  bestEl.textContent = best || "—";

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function build() {
    board.innerHTML = "";
    first = null; lock = false; moves = 0; matched = 0;
    movesEl.textContent = "0";
    pairsEl.textContent = "0";
    var cards = shuffle(FACES.concat(FACES));
    cards.forEach(function (face, i) {
      var el = document.createElement("button");
      el.className = "mem-card";
      el.type = "button";
      el.setAttribute("data-face", face.n);
      el.setAttribute("data-emoji", face.e);
      el.setAttribute("aria-label", "Hidden card");
      el.innerHTML = '<span class="mem-front">' + face.e + '<em>' + face.n + '</em></span><span class="mem-back">🐉</span>';
      el.addEventListener("click", function () { flip(el); });
      board.appendChild(el);
    });
    msgEl.textContent = "Find all ten tribe pairs. Fewest moves wins.";
  }

  function flip(el) {
    if (lock || el.classList.contains("flipped") || el.classList.contains("done")) return;
    el.classList.add("flipped");
    el.setAttribute("aria-label", el.getAttribute("data-emoji") + " " + el.getAttribute("data-face"));
    if (!first) { first = el; return; }
    moves++;
    movesEl.textContent = moves;
    var a = first, b = el;
    if (a.getAttribute("data-face") === b.getAttribute("data-face")) {
      a.classList.add("done");
      b.classList.add("done");
      first = null;
      matched++;
      pairsEl.textContent = matched;
      if (liveEl) liveEl.textContent = "Pair found: " + b.getAttribute("data-face");
      if (matched === FACES.length) {
        var score = moves;
        if (!best || score < best) {
          best = score;
          try { localStorage.setItem(BEST_KEY, String(best)); } catch (e) {}
          bestEl.textContent = best;
          msgEl.innerHTML = "All ten tribes matched in <strong>" + moves + "</strong> moves! 🏆 New best!";
        } else {
          msgEl.innerHTML = "All ten tribes matched in <strong>" + moves + "</strong> moves. Best is " + best + ".";
        }
        if (liveEl) liveEl.textContent = "Game complete in " + moves + " moves.";
      }
    } else {
      lock = true;
      setTimeout(function () {
        a.classList.remove("flipped");
        b.classList.remove("flipped");
        a.setAttribute("aria-label", "Hidden card");
        b.setAttribute("aria-label", "Hidden card");
        lock = false;
        first = null;
      }, 800);
    }
  }

  btnEl.addEventListener("click", function () {
    build();
    msgEl.textContent = "New game! Find all ten tribe pairs. Fewest moves wins.";
  });

  build();
})();
