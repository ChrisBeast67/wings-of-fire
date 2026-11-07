# 🐉 Wings of Fire — Fan Site

A fan website about Tui T. Sutherland's **Wings of Fire** series, built by Percy ⚡ for The Beast.

## Pages
- `index.html` — Hero, the four arcs, tribe overview, the five dragonets, "Why you'll love it", a "Start reading" guide, the author, and a "Which tribe are you?" picker
- `books.html` — Every book in reading order: 16 main books, 2 Legends, 5 Winglets, companion books, special editions and screen adaptations, plus a "Where to start" guide
- `dragons.html` — All 12 known dragon tribes + the Dungeon Isle and Court of Refuge, the world of Pyrrhia/Pantala, and "Why the tribes matter"
- `characters.html` — Dragonets, Arc 2/3/4 characters, queens, villains, Winglet/Legend characters, and "Why these characters work"
- `history.html` — The full history of Pyrrhia: nine sourced eras from the Scorching (0 AS) to The Hybrid Prince, with a vertical timeline and the AS (After Scorching) calendar explained
- `sneak-peek.html` — A spoiler-light look at what's next: the Forgotten Isles Prophecy in full, the new Arc 4 dragons, every book and adaptation still to come, and the carved warning from the back of *The Hybrid Prince*
- `quiz.html` — 16-question interactive quiz with scoring and rank titles
- `tribe-quiz.html` — "Which tribe are you?" personality quiz (11 questions, 11 tribes), plus a sneak peek of Arc 4
- `about-me.html` — The maker's own about-me page, with the Google Doc embedded inline plus a direct link and an "Open the document" button

## Tech
Pure static HTML / CSS / vanilla JS. No build step, no dependencies. Open `index.html` in a browser and it works.

## Structure
```
css/style.css    — shared styles (dark ash + ember/gold theme)
js/main.js       — scroll-reveal effect (shared across pages)
js/quiz.js       — lore quiz data + logic (external + cache-busted, so a stale
                   inline script can never wedge the quiz on a cached page)
js/tribequiz.js  — tribe quiz data + logic (also external + cache-busted)
```

Both quiz pages ship a `<noscript>` fallback and a 2.5-second watchdog that swaps the
"Loading…" state for a hard-refresh instruction if the script fails to load.

## Local preview
```bash
cd wings-of-fire
python3 -m http.server 8000
# then open http://localhost:8000
```

## Live site
https://chrisbeast67.github.io/wings-of-fire

---
*Unofficial fan site. Wings of Fire is written by Tui T. Sutherland and published by Scholastic. All book content belongs to its authors.*
