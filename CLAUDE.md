# Adimara Site — Project Instructions for Claude Code

> *Snap-scroll site for Lyra / Adimara, the speculative-mythical world of Spectralmoon Studio.
> 3 panels, GSAP-driven snap, Vite + Tailwind v4 + GSAP core stack.
> User is non-technical. Briefly explain what each command/change does.
> Use Plan Mode for big changes (Shift+Tab). Pause for approval at each major step.*

---

## What this site is

A 3-panel snap-scroll hero site that introduces Lyra and her world (Adimara). Each panel is a full-viewport slide; one wheel-tick / swipe / keypress = one immediate transition (NOT continuous scrub).

Reference HTML demo: `reference.html` (the source spec — read it first).

---

## Stack (LOCKED)

- **Build tool:** Vite (latest stable)
- **Styling:** Tailwind CSS v4 (use `@import "tailwindcss"` syntax)
- **Animation:** GSAP core (no ScrollTrigger needed)
- **Fonts:** Fraunces (display, Google Fonts) + Inter Tight (UI, Google Fonts)
- **No framework:** vanilla JS, no React, no Vue
- **Deploy target:** Vercel OR existing GitHub Pages repo (TBD)

---

## File structure (target)

```
adimara-site/
├── index.html            (Vite entry)
├── src/
│   ├── main.js           (snap mechanics + per-layer animations)
│   ├── style.css         (Tailwind import + custom CSS for what Tailwind can't do)
│   └── panels.js         (panel data — copy, asset paths)
├── public/
│   └── images/           (PNG assets — drop generated images here)
├── reference.html        (the source spec — DO NOT MODIFY, read for reference)
├── CLAUDE.md             (this file)
├── package.json
├── vite.config.js
└── tailwind.config.js    (if needed for v4)
```

---

## Snap transition (LOCKED — do not change)

| Param | Value |
|---|---|
| **DURATION** | 0.75s |
| **EASE** | `power2.out` |
| **Scroll DOWN** | outgoing panel `yPercent -30, scale 0.95, opacity 0.4` + incoming `yPercent 100→0` |
| **Scroll UP** | reverse |
| **Input lock** | true during transition |
| **Wheel threshold** | 5px deltaY |
| **Touch swipe threshold** | 50px |
| **Inputs** | wheel + touch + arrow keys + Space + PageUp/Down + click on progress dots |

**Do NOT change snap timing values** unless explicitly asked.

---

## The 3 panels (LOCKED copy)

| # | Headline | Tagline | Visual register |
|---|---|---|---|
| **1 — Longing / Departure** | **home.** | Every blade of grass, every stone — they had always known her. | Lyra alone walking up a honey-sage hillside path |
| **2 — Stillness** | **stillness.** | Under the tree, she finally heard herself. | Lyra alone on rocky outcrop with sacred tree |
| **3 — Recognition / Reunion** | **recognition.** | There was no moment of meeting. There was only remembering. | Lyra and her mate together on the hilltop |

All headlines: lowercase, italic, Fraunces 800.
All taglines: Fraunces regular, ~26px max.

---

## Per-layer animations (LOCKED for first build)

For now (Phase 1 prototype), no per-layer parallax — just the snap mechanic + headline/tagline opacity + yPercent on enter.

### Future enhancement (Phase 2 — after assets land)

Each panel will have layered images:
- Background layer (full bleed)
- Foreground figure layer (Lyra cutout PNG)
- Optional focal object layer (Sternum Vault crystal, sacred tree, etc.)

When implemented, each layer animates with its own entrance + idle scale tween (parallel to the snap):

| Layer type | Entrance | Idle |
|---|---|---|
| Background | opacity 0→1, 1.4-1.6s, power3.out | scale 1→1.15, 8-12s, none |
| Foreground figure | yPercent 30→0, opacity 0→1, 1.2s, delay 0.2s, power3.out | (no scale) |
| Focal object | opacity 0→1, 1.4s, power3.out | scale 0.95→1.18, 7-10s, power3.out |

Use TWO parallel tweens at position 0 — one for entrance (short, snappy), one for idle scale (long, continuous).

---

## Color palette (LOCKED — Adimara warm-only)

CSS custom properties (already in `reference.html`, mirror these):

```css
--sand-cream: #f5ecdc;
--honey: #d9b67a;
--amber-gold: #c89248;
--brass: #9b6b3d;
--twilight-rose: #e6a89a;
--dusty-violet: #b6a6c4;
--dust-gold: #f0d7a0;
--espresso: #2a201a;       /* outlines / depth, NEVER pure black */
--cochineal: #a8302c;      /* accent only — Spectralmoon Sigil moments */
--bone-white: #fbf8f1;     /* highlights, NOT pure white */
--sage-tint: #a8a98c;      /* subtle cool note in Andean ichu grass */
```

**Forbidden:** any cool-temperature dominance (no cyan, no blue, no purple as primary). Espresso instead of pure black. Bone-white instead of pure white.

---

## Typography (LOCKED)

- **Display:** Fraunces (italic 800 for headlines, regular for taglines)
- **UI:** Inter Tight (300-700 range)
- **Headline size:** clamp(64px, 12vw, 200px), lowercase, line-height 0.95, letter-spacing -0.02em
- **Tagline size:** clamp(18px, 1.8vw, 26px), line-height 1.5
- **UI text size:** 11-14px uppercase 0.22em letter-spacing tracked

---

## Brand voice — for any new copy

- Sublime, mythic, embodied
- Short sentences, declarative
- Verbs: remember, listen, walk, recognize, return
- No marketing-speak. No exclamations.

Reference taglines for tone calibration:
- *"She didn't set out to find answers. She set out to remember."*
- *"Not an arrival. A homecoming."*
- *"Every blade of grass, every stone — they had always known her."*

---

## Phased build plan

### Phase 1 — Project init
1. `npm create vite@latest . -- --template vanilla`
2. Install Tailwind v4 + GSAP: `npm install tailwindcss @tailwindcss/vite gsap`
3. Wire Tailwind into `vite.config.js` per Tailwind v4 docs
4. Verify `npm run dev` starts on `localhost:5173`
5. **PAUSE — show user the dev server is running before continuing**

### Phase 2 — HTML
1. Port `reference.html` structure into `index.html`:
   - `<head>` with Google Fonts + Tailwind import
   - 3 `<section class="panel">` blocks with locked copy
   - Top nav (Spectralmoon Studio brand + Atlas/Lyra/About links)
   - Side indicators
   - Progress dots (3 dots, right edge)
   - Footer (brand + IG + contact)
2. **PAUSE — show user the static HTML rendered before adding CSS**

### Phase 3 — CSS
1. Move CSS custom properties (palette + duration) into `src/style.css` as `:root` + Tailwind `@theme`
2. Port the panel styles, gradients, typography
3. Use Tailwind utility classes where natural; fall back to custom CSS for anything Tailwind can't do (like the gradient panels)
4. **PAUSE — show user the styled (still static) site**

### Phase 4 — Snap JS
1. Port the snap mechanics from `reference.html` `<script>` into `src/main.js`
2. Wire wheel + touch + keyboard + dot-click inputs
3. Lock input during transition
4. **PAUSE — show user the working snap mechanic, all 3 inputs**

### Phase 5 — Per-layer animations (DEFERRED until images land)
- See "Future enhancement" section above
- Implement once user has dropped real PNGs in `public/images/`

### Phase 6 — Deploy
- Build for production: `npm run build`
- Deploy to Vercel (preferred) or push to existing GitHub Pages repo
- Confirm domain settings, HTTPS

---

## Coordination with the user (non-technical)

- The user is **non-technical** but creatively sharp
- **Use Plan Mode for big prompts (Shift+Tab)** — show the plan first, get approval, then execute
- Briefly explain what each command does in plain English ("npm install pulls down a library called X — we use it for Y")
- Pause and show output after each major step
- For visual changes, take a screenshot or describe the change so she can verify
- **Never** rename / restructure / refactor without asking first
- If something breaks, explain what broke + the simplest fix path

---

## Image asset workflow

User generates images in:
- **Higgsfield** (when up) — character work via Soul ID
- **Lovart** (now primary) — agent + Nano Banana Pro for character + reference work
- **Midjourney** (backgrounds + atmosphere)

User downloads the final picks → drops them into `public/images/` with naming:
- `panel-1-bg.png` (full landscape)
- `panel-1-lyra.png` (foreground cutout, transparent BG)
- `panel-2-bg.png`, `panel-2-lyra.png`
- `panel-3-bg.png`, `panel-3-couple.png`

Wait for the user to confirm assets are in place before referencing them in HTML.

---

## Update log

- **2026-05-06** — Project scaffolded. `reference.html` written as Phase 1 prototype. `CLAUDE.md` initialized with full spec. Awaiting `npm` init + Vite project setup in Claude Code.
