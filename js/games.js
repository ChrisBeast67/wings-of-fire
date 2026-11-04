/* ============================================
   WINGS OF FIRE — Dragon Flight mini-game
   ============================================ */
(function () {
  "use strict";

  var canvas = document.getElementById("gameCanvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var scoreEl = document.getElementById("gameScore");
  var bestEl = document.getElementById("gameBest");
  var msgEl = document.getElementById("gameMsg");
  var btnEl = document.getElementById("gameBtn");
  var liveEl = document.getElementById("gameLive");

  var BEST_KEY = "wof_dragonflight_best";

  function loadBest() {
    try {
      var v = parseInt(localStorage.getItem(BEST_KEY) || "0", 10);
      return isNaN(v) ? 0 : v;
    } catch (e) { return 0; }
  }
  function saveBest(v) {
    try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) {}
  }

  // --- game state ---
  var W = 0, H = 0, dpr = 1;
  var bird = { x: 0, y: 0, vy: 0, r: 18, flap: 0 };
  var pipes = [];
  var score = 0, best = loadBest();
  var running = false, over = false, started = false;
  var gravity = 0.26, flapPower = -6.2, pipeGap = 178, pipeW = 62;
  var speed = 3.2, spawnTimer = 0, frame = 0, lastT = 0;
  var shake = 0;
  var overAt = 0;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(280, rect.width);
    H = Math.max(320, rect.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!started) {
      bird.x = W * 0.28;
      bird.y = H / 2;
    }
  }

  function reset() {
    bird.x = W * 0.28;
    bird.y = H / 2;
    bird.vy = 0;
    bird.flap = 0;
    pipes = [];
    score = 0;
    speed = 3.2;
    spawnTimer = 0;
    shake = 0;
    over = false;
    started = false;
    running = false;
    setOverlay(true);
    updateHUD();
    draw();
  }

  function updateHUD() {
    scoreEl.textContent = score;
    bestEl.textContent = best;
  }

  function say(text, color) {
    msgEl.textContent = text;
    msgEl.style.color = color || "var(--muted)";
  }

  function setOverlay(show) {
    msgEl.style.opacity = show ? "1" : "0";
    msgEl.style.transition = "opacity .3s ease";
  }

  function start() {
    if (over) reset();
    started = true;
    running = true;
    bird.vy = flapPower * 0.75;
    say("Flap! Space, click or tap to fly.", "var(--sky)");
    setOverlay(false);
    btnEl.textContent = "Restart";
    lastT = performance.now();
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  function flap() {
    if (over) {
      // ignore frantic tapping right after a crash
      if (performance.now() - overAt < 700) return;
      reset();
      start();
      bird.vy = flapPower;
      bird.flap = 1;
      return;
    }
    if (!running) { start(); }
    bird.vy = flapPower;
    bird.flap = 1;
  }

  function gameOver() {
    running = false;
    over = true;
    overAt = performance.now();
    shake = 12;
    if (score > best) {
      best = score;
      saveBest(best);
      say("New best flight! 🏆 " + best, "var(--gold)");
    } else {
      say("Down! Score " + score + " — best is " + best + ".", "var(--ember)");
    }
    btnEl.textContent = "Play again";
    setOverlay(true);
    updateHUD();
    if (liveEl) liveEl.textContent = "Game over. Score " + score + ". Best " + best + ".";
  }

  function spawnPipe() {
    var margin = 60;
    var gap = Math.max(126, pipeGap - Math.min(score, 12) * 2.6);
    var top = margin + Math.random() * Math.max(40, (H - gap - margin * 2));
    pipes.push({ x: W + 40, top: top, gap: gap, passed: false });
  }

  function update() {
    bird.vy += gravity;
    bird.y += bird.vy;
    bird.flap *= 0.86;
    if (bird.y < bird.r) { bird.y = bird.r; bird.vy = 0; }
    if (bird.y > H - bird.r) { bird.y = H - bird.r; bird.vy = 0; gameOver(); return; }
    if (bird.y < bird.r) { bird.y = bird.r; bird.vy = Math.max(bird.vy, 0); }

    spawnTimer += 1;
    if (spawnTimer > 100) { spawnTimer = 0; spawnPipe(); }
    speed += 0.0016;

    for (var i = pipes.length - 1; i >= 0; i--) {
      var p = pipes[i];
      p.x -= speed;
      if (!p.passed && p.x + pipeW < bird.x) {
        p.passed = true;
        score++;
        updateHUD();
        if (liveEl) liveEl.textContent = "Score " + score;
      }
      if (p.x + pipeW < -60) pipes.splice(i, 1);
      // collision
      if (bird.x + bird.r - 6 > p.x && bird.x - bird.r + 6 < p.x + pipeW) {
        if (bird.y - bird.r < p.top || bird.y + bird.r > p.top + p.gap) { gameOver(); return; }
      }
    }
    if (shake > 0) shake *= 0.86;
  }

  // --- drawing ---
  function drawPipe(p) {
    var grad = ctx.createLinearGradient(p.x, 0, p.x + pipeW, 0);
    grad.addColorStop(0, "#2a6b3d");
    grad.addColorStop(0.5, "#3f9b58");
    grad.addColorStop(1, "#21512f");
    // top
    ctx.fillStyle = grad;
    ctx.fillRect(p.x, 0, pipeW, p.top);
    ctx.fillRect(p.x, p.top + p.gap, pipeW, H - (p.top + p.gap));
    // caps
    ctx.fillStyle = "#54c471";
    ctx.fillRect(p.x - 7, p.top - 22, pipeW + 14, 22);
    ctx.fillRect(p.x - 7, p.top + p.gap, pipeW + 14, 22);
    ctx.strokeStyle = "rgba(0,0,0,.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x, 0, pipeW, p.top);
    ctx.strokeRect(p.x, p.top + p.gap, pipeW, H - (p.top + p.gap));
  }

  function drawBird() {
    var x = bird.x, y = bird.y;
    ctx.save();
    ctx.translate(x, y);
    var tilt = Math.max(-0.5, Math.min(0.9, bird.vy / 9));
    ctx.rotate(tilt);
    // wings
    var wing = 6 + (1 - bird.flap) * 10;
    ctx.fillStyle = "#c9922f";
    ctx.beginPath();
    ctx.ellipse(-6, -6, 16, wing, -0.35, 0, Math.PI * 2);
    ctx.fill();
    // body
    var g = ctx.createLinearGradient(0, -18, 0, 18);
    g.addColorStop(0, "#ffb44a");
    g.addColorStop(0.55, "#f07d1a");
    g.addColorStop(1, "#c14c07");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.r + 4, bird.r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
    // belly
    ctx.fillStyle = "rgba(255,236,190,.75)";
    ctx.beginPath();
    ctx.ellipse(2, 6, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(9, -5, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#20141a";
    ctx.beginPath();
    ctx.arc(11, -5, 2.8, 0, Math.PI * 2);
    ctx.fill();
    // snout
    ctx.fillStyle = "#ffb44a";
    ctx.beginPath();
    ctx.moveTo(bird.r + 2, -2);
    ctx.lineTo(bird.r + 13, 2);
    ctx.lineTo(bird.r + 2, 6);
    ctx.closePath();
    ctx.fill();
    // horn
    ctx.strokeStyle = "#7a4a12";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-4, -16);
    ctx.lineTo(-8, -26);
    ctx.stroke();
    ctx.restore();
  }

  function drawSky() {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#1b1430");
    g.addColorStop(0.55, "#3a1f3d");
    g.addColorStop(1, "#7a3b21");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // stars
    ctx.fillStyle = "rgba(255,255,255,.55)";
    for (var i = 0; i < 40; i++) {
      var sx = (i * 97) % W;
      var sy = ((i * 53) % Math.floor(H * 0.55));
      ctx.fillRect(sx, sy, 2, 2);
    }
    // sun
    ctx.fillStyle = "rgba(255,194,71,.35)";
    ctx.beginPath();
    ctx.arc(W * 0.78, H * 0.24, 46, 0, Math.PI * 2);
    ctx.fill();
    // ground
    ctx.fillStyle = "rgba(12,8,16,.55)";
    ctx.fillRect(0, H - 26, W, 26);
  }

  function draw() {
    ctx.save();
    if (shake > 0.5) {
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    }
    drawSky();
    for (var i = 0; i < pipes.length; i++) drawPipe(pipes[i]);
    drawBird();
    ctx.restore();
  }

  var rafId = null;
  function loop(t) {
    if (!lastT) lastT = t;
    var dt = Math.min(40, t - lastT);
    lastT = t;
    if (running) {
      // fixed-ish stepping
      var steps = Math.max(1, Math.round(dt / 16));
      for (var s = 0; s < steps && running; s++) update();
    }
    draw();
    frame++;
    rafId = requestAnimationFrame(loop);
  }

  // --- input ---
  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
      if (document.activeElement === btnEl) return;
      e.preventDefault();
      flap();
    }
  });
  canvas.addEventListener("mousedown", function (e) { e.preventDefault(); flap(); });
  canvas.addEventListener("touchstart", function (e) { e.preventDefault(); flap(); }, { passive: false });
  btnEl.addEventListener("click", function () {
    if (over) { reset(); start(); }
    else if (!running) { start(); }
    else { flap(); }
  });

  window.addEventListener("resize", function () {
    resize();
    draw();
  });

  // Small debug/state hook (also handy for automated tests)
  window.__wofGame = {
    get bird() { return bird; },
    get pipes() { return pipes; },
    get score() { return score; },
    get running() { return running; },
    get over() { return over; },
    flap: flap
  };

  resize();
  reset();
  rafId = requestAnimationFrame(loop);
  updateHUD();
})();
