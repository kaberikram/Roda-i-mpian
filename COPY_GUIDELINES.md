# Copy guidelines for UX / content (FinSpin — Roda i-mpian)

Brief for whoever writes or reviews **puzzle content**, **hints**, **tutorial copy**, and related UI strings. Technical limits come from the current app implementation; “recommended” lengths are comfort targets on small phones, not hard validation.

---

## Product context

- Casual **word game** inspired by *Roda Impian*; theme is **money and everyday finance** (finance theme; scoring uses neutral **points**, not real currency).
- Tone: **friendly, light, encouraging** — fun first, plain-language learning second (see post-round **definition** + **action tip**).
- Three rounds per game; difficulty label is **Easy / Medium / Hard** (driven by content `diff`, not by copy length).

---

## Where content lives (primary: `src/data/terms.json`)

Each puzzle is one JSON object:

| Field | Role | Shown when |
|-------|------|------------|
| **`term`** | The answer (puzzle phrase) | Letter board; result headline; Solve check |
| **`cat`** | Short category label | Game screen pill; result card badge |
| **`diff`** | `1` Easy, `2` Medium, `3` Hard | Pill next to category |
| **`hint`** | Clue under the board (not the answer) | During the round |
| **`def`** | Short definition | Result screen after solving the round |
| **`tip`** | Actionable “try this” takeaway | Result screen in green **ACTION TIP** box |

---

## `term` — puzzle phrase (answer)

**Technical rules**

- Use **A–Z only** for letters. Spaces are allowed for **multiple words**; each **word becomes its own row** of tiles.
- The app compares answers in **upper case** (Solve flow normalizes). Prefer storing `term` in **UPPERCASE** for consistency.
- No digits or punctuation in `term` unless you change game code (current logic focuses on letters + spaces).

**Length & layout (important for designers)**

- Tile width is computed so the **longest word in a single row** fits the screen; on very long words, tiles and font **shrink** (font can go down to ~**10px**).
- **Recommended (comfort):**
  - **≤ 12 letters** per word, **1–2 words** total for most puzzles.
  - **≤ 18 letters** per word as a softer upper bound before rows feel cramped.
- **Stress / avoid if possible:** a single row much beyond ~**20 letters**, or **3+ long words**, unless you accept tiny tiles.

**Content note**

- The hint must **not** spell or trivially giveaway the answer; it should nudge meaning without leaking exact spelling.

---

## `hint` — in-round clue

**Where it appears:** Below the puzzle, ~**15px**, medium weight, with a leading **💡** (prepended in code — **do not** duplicate the emoji in JSON).

**Purpose:** Orient the player (meaning / domain) **without** replacing guessing.

**Recommended length**

- **~35–70 characters** (about **1–2 short lines** on a narrow phone).
- **Comfort max ~110 characters** before wrapping dominates the middle of the screen.

**Style**

- Prefer **clear, conversational** Malay or English aligned with product tone (today’s deck is mostly **English**).

---

## `cat` — category pill

**Where:** Next to difficulty on the game screen; badge on result card.

**Recommended length**

- **~10–28 characters** (single line pill; long labels may feel cramped).

**Examples:** `Personal Finance`, `Investing`, `Economics` — short nouns/phrases.

---

## `def` — definition (post-round)

**Where:** Result screen body under the term; ~**14px**, comfortable reading width inside a card (~**280px** usable width on small layouts).

**Purpose:** One concise **concept explainer**, not encyclopedic.

**Recommended length**

- **~220–520 characters** (roughly **2–5 sentences**).
- Prefer **plain language**, one concrete image or analogy; avoid jargon unless you define it briefly.

---

## `tip` — action tip

**Where:** Result card, green box labelled **ACTION TIP** (~**13px** body).

**Purpose:** One **specific**, **do-able** suggestion (local finance examples fit well).

**Recommended length**

- **~120–280 characters** (about **1–3 sentences**).
- Labels “ACTION TIP” is fixed in code — your copy should sound like advice, not a second definition.

---

## Solve / keyboard (engineering limits)

- Solve entry is typed with on-screen letters + spaces only; drafts cap at **120 characters** (`SOLVE_DRAFT_MAX` in code). Puzzle `term` + spaces should stay **under that** unless you raise the limit in code.

---

## Other copy surfaces (for alignment / future edits)

| Location | Purpose | Notes |
|----------|---------|--------|
| [`src/screens/HomeScreen.jsx`](src/screens/HomeScreen.jsx) (`HOME_WELCOME`) | Host blurb before playing | Single paragraph welcoming + framing the loop |
| [`src/screens/InstructionsScreen.jsx`](src/screens/InstructionsScreen.jsx) (`STEPS`) | 3-step tutorial | Carousel body + CTAs (“Next”, etc.) |
| [`src/screens/GameScreen.jsx`](src/screens/GameScreen.jsx) | Round-one dock hint | “Spin below…” (first spin onboarding) |
| [`src/screens/EndScreen.jsx`](src/screens/EndScreen.jsx) | Final celebration | Includes “You learned 3 finance terms!” (hard-coded to three rounds today) |
| [`src/screens/ResultScreen.jsx`](src/screens/ResultScreen.jsx) | Round complete | Fixed labels: “Round N Complete!”, “This round”, “Total”, “ACTION TIP”, CTAs |

---

## Dynamic / system messages (reference for tone)

Strings from gameplay (not JSON) — if you refactor copy, search the codebase for these ideas:

| Message idea | Typical trigger |
|--------------|-----------------|
| Spin the wheel to start! | Opening (no prefilled letters) |
| Pick a letter | Landed points on wheel — guessing phase |
| BUST / round points cleared | Wheel segment |
| Letter correct / × count | Successful guess |
| No letter / back to wheel | Wrong letter |
| Wrong Solve — back to wheel | Failed Solve |
| Brilliant — solved | Completed puzzle |
| No spins left · round over | Out of spins |
| Puzzle complete — what a start! | Rare: full pre-fill edge case |

These are candidate **tone checks** alongside your glossary (e.g. “loss” vs “BUST”, points formatting).

---

## Wheel labels (`src/data/wheelSegments.json`)

- Segment **labels** appear on wheel UI (short text: e.g. `500`, `BUST`).
- Not ideal for prose; treat as **SKU-style** amounts + risk cue. Editing affects balance and readability on the rim.

---

## Handoff checklist for the UX writer

- [ ] All `term` entries uppercase; letters + spaces only; length per guidelines.
- [ ] `hint`: no answer leakage; emoji only via game (💡 prefix).
- [ ] `cat` short enough for pills.
- [ ] `def` + `tip` differentiated (explain vs actionable).
- [ ] Tone consistent with the finance-learning context where examples are used.
- [ ] Spot-check longest phrase on **~320px wide** viewport after edits.

---

*Source of truth for puzzle rows:* [`src/data/terms.json`](src/data/terms.json) · *Layout math for tiles:* [`src/utils/layout.js`](src/utils/layout.js).
