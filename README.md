# FinSpin — Roda Impian

**FinSpin** is a playful word game inspired by *Roda Impian*, the Malaysian TV classic where players spin a wheel and guess letters to solve puzzles. Here, the spotlight is on **money and everyday finance** — budgeting, saving, investing, and ideas that help you think clearly about your financial life.

## What you’re doing

You get a short phrase or term to uncover, letter by letter. You **spin the wheel** to land on a dollar amount, then pick **letters** on the QWERTY keyboard to earn money for each correct match (vowels work the same way). After enough spins in a round, **Solve** unlocks so you can guess the full phrase. Finish the puzzle before you run out of spins, stack your earnings across three rounds, and try to beat your own best score and time.

Between rounds, the game can share a **plain-language definition** and a **practical tip** tied to the word you just solved — so it’s meant to feel like fun first, with a little learning slipped in along the way.

## Who it’s for

Anyone who enjoys quick, casual puzzles and doesn’t mind picking up a useful idea about money while they play. No finance background needed.

## What it feels like

Bright colors, satisfying spins, little sound touches, and a pace that fits a coffee break or a commute. It’s meant to be lighthearted — a small “brain gym” with a money-and-life theme, not a lecture.

---

## Local dev

Built with [Vite](https://vitejs.dev) + React 18.

```sh
npm install
npm run dev      # start dev server with HMR
npm run build    # produce static bundle in dist/
npm run preview  # serve the built bundle
```

The `dist/` folder is a static drop-in — host it on any static server.

## Project layout

```
src/
  audio/        Web Audio SFX engine
  components/   Presentational React components (Wheel, Keyboard, HUD, …)
  constants/    Game tunables (max rounds, storage keys, …)
  data/         Term pool and wheel segments (JSON)
  hooks/        useGameRound, useScreenTint, useElementWidth
  screens/      Home / Game / Result / End
  styles/       CSS split by concern (base, animations, buttons, …)
  utils/        Pure helpers (color math, formatting, layout, randomness)
```

---

*FinSpin — Roda Impian*
