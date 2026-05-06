# Adimara Site

Spectralmoon Studio — *Where the Stars Remember*. 3-panel snap-scroll hero site.

---

## Run it locally (2 commands)

Open Terminal in this folder, then:

```bash
npm install   # only needed first time (already done if Claude Code did Phase 1)
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

---

## Drop in your images

Save your generated PNGs into `public/images/` with these exact names:

```
public/images/
├── panel-1-bg.png    # Adimara hillside background (Lyra walking — wider scene)
├── panel-1-fg.png    # Lyra cutout (transparent BG, Lyra walking)
├── panel-2-bg.png    # Adimara Eden city + 3 moons (the one that came out amazing)
├── panel-2-fg.png    # Lyra + tree cutout (transparent BG)
├── panel-3-bg.png    # Hilltop background (couple together — wider scene)
└── panel-3-fg.png    # Lyra + mate cutout (transparent BG)
```

When you save a file there, refresh the browser. No rebuild needed.

If a file is missing, the panel falls back to the gradient placeholder (still looks polished).

---

## Structure

- `index.html` — entry point, 3 panel sections + nav + footer
- `src/main.js` — snap-scroll mechanics + GSAP entrance animations
- `src/style.css` — Tailwind v4 import + Adimara design tokens + custom CSS
- `reference.html` — original prototype (do not modify, kept as spec reference)
- `CLAUDE.md` — full project spec for Claude Code sessions
- `public/images/` — your PNG assets land here

---

## Build for production

```bash
npm run build
npm run preview   # to test the production build locally
```

The built site goes into `dist/`. Deploy that folder to Vercel, Netlify, or your existing GitHub Pages repo.

---

## Snap mechanics

- **Wheel:** one tick = one panel
- **Touch:** swipe 50px = one panel
- **Keyboard:** Arrow Up/Down, Space, PageUp/PageDown
- **Click:** the 3 dots on the right edge

Transition: 0.75s, `power2.out` easing. Locked per spec.
