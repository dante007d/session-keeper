# Premium Theme System — Master Prompt for Any LLM

> Copy-paste this entire prompt into any LLM or AI coding tool (Bolt, Lovable, v0, Cursor, ChatGPT, Gemini, etc.) to generate a premium web app with a fully working theme selector.

---

## SYSTEM CONTEXT

You are a senior UI engineer and design systems architect. Your code is production-grade, visually exceptional, and never generic. You build UIs that feel like they were designed at Apple, Linear, or Anthropic — not assembled from a component library.

---

## THE TASK

Build a **Theme Selector UI section** for a web application. It must:

1. Display all 7 themes below as selectable cards
2. Apply the selected theme **globally and instantly** to the entire app
3. Persist the selection to `localStorage`
4. Be fully responsive (mobile + desktop)
5. Include a **live preview panel** that shows real UI components (nav, button, card, input, badge) rendered in the active theme
6. Animate theme transitions smoothly (150–200ms)

---

## THE 7 THEMES

Implement every theme as a complete CSS variable token set. Each theme must define ALL of the following tokens:

```
--bg-primary       → main page background
--bg-surface       → card / panel background
--bg-elevated      → elevated surface (modals, dropdowns)
--text-primary     → main readable text
--text-secondary   → muted/label text
--text-hint        → placeholder / disabled text
--accent           → primary CTA, active states, links
--accent-hover     → accent on hover
--accent-fg        → text color on top of accent background
--border           → default border color
--border-strong    → hover / focused border
--radius-sm        → 4px default for inputs
--radius-md        → 8px default for cards
--radius-lg        → 16px for large panels
--font-display     → heading font stack
--font-body        → body / UI font stack
--font-mono        → monospace font stack
--shadow           → default shadow (or "none")
--transition       → default ease curve and duration
```

---

### THEME 1 — Obsidian Glass
*Premium dark. Apple macOS depth with frosted glass panels.*

```css
[data-theme="obsidian"] {
  --bg-primary:    #0d0d12;
  --bg-surface:    rgba(255,255,255,0.05);
  --bg-elevated:   rgba(255,255,255,0.09);
  --text-primary:  #f0f0f5;
  --text-secondary:#9090a8;
  --text-hint:     #55556a;
  --accent:        #6e7eff;
  --accent-hover:  #8b9aff;
  --accent-fg:     #ffffff;
  --border:        rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.18);
  --radius-sm:     6px;
  --radius-md:     12px;
  --radius-lg:     20px;
  --font-display:  'Sohne', 'Helvetica Neue', sans-serif;
  --font-body:     'Sohne', system-ui, sans-serif;
  --font-mono:     'Geist Mono', 'Fira Code', monospace;
  --shadow:        0 8px 32px rgba(0,0,0,0.6);
  --transition:    all 0.18s cubic-bezier(0.4,0,0.2,1);
}
```

**Visual rules:**
- Apply `backdrop-filter: blur(20px)` to all surface elements
- Panels have 1px borders using `--border`
- Add a very subtle noise grain texture: `background-image: url("data:image/svg+xml,...")`
- CTAs glow: `box-shadow: 0 0 24px rgba(110,126,255,0.4)`
- Typography: tight letter-spacing on headings (`-0.03em`), large optical size

---

### THEME 2 — Chalk & Signal
*Ultra-minimal. Nothing Phone UI meets brutalist grid.*

```css
[data-theme="chalk"] {
  --bg-primary:    #ffffff;
  --bg-surface:    #f5f5f5;
  --bg-elevated:   #ebebeb;
  --text-primary:  #111111;
  --text-secondary:#666666;
  --text-hint:     #aaaaaa;
  --accent:        #111111;
  --accent-hover:  #333333;
  --accent-fg:     #ffffff;
  --border:        #e0e0e0;
  --border-strong: #111111;
  --radius-sm:     2px;
  --radius-md:     4px;
  --radius-lg:     6px;
  --font-display:  'DM Sans', 'Helvetica Neue', sans-serif;
  --font-body:     'DM Sans', system-ui, sans-serif;
  --font-mono:     'Fragment Mono', 'Courier New', monospace;
  --shadow:        none;
  --transition:    all 0.1s linear;
}
```

**Visual rules:**
- Zero gradients. Zero shadows. Zero rounded corners above `--radius-lg`
- All interactions are instant (0.1s linear) — no easing
- Borders are `1px solid var(--border)` — pixel-perfect hairlines
- Active states invert: black bg, white text (flip, don't color)
- Typography: use tight leading (1.2), slightly condensed — bold headings, light body
- Red `#ff3b30` is reserved exclusively for destructive/error states

---

### THEME 3 — Vantablack Terminal
*Military cipher. Green phosphor. Like NORAD built a SaaS product.*

```css
[data-theme="terminal"] {
  --bg-primary:    #050a05;
  --bg-surface:    #0a1208;
  --bg-elevated:   #112211;
  --text-primary:  #c8ffc0;
  --text-secondary:#80b870;
  --text-hint:     #3a5a34;
  --accent:        #39ff14;
  --accent-hover:  #5fff40;
  --accent-fg:     #020802;
  --border:        rgba(57,255,20,0.15);
  --border-strong: rgba(57,255,20,0.4);
  --radius-sm:     2px;
  --radius-md:     2px;
  --radius-lg:     4px;
  --font-display:  'Orbitron', 'Share Tech Mono', monospace;
  --font-body:     'Share Tech Mono', 'Courier New', monospace;
  --font-mono:     'Share Tech Mono', monospace;
  --shadow:        0 0 20px rgba(57,255,20,0.15);
  --transition:    all 0.05s steps(3);
}
```

**Visual rules:**
- Everything is monospace — no sans-serif anywhere
- Add CRT scanline overlay: repeating horizontal lines at 2px intervals, 3% opacity
- Cursor blink animation on all active/focused elements
- Text appears via typewriter animation on load (character by character)
- All borders glow: `box-shadow: 0 0 8px rgba(57,255,20,0.3)` on hover
- Numbers and data values are bright accent; labels are `--text-secondary`
- Transition is stepped (`steps(3)`) — digital, not smooth

---

### THEME 4 — Void Ultraviolet
*Deep space. The Claude API meets a concept car studio.*

```css
[data-theme="void"] {
  --bg-primary:    #0e0618;
  --bg-surface:    #1a0a2e;
  --bg-elevated:   #2d1060;
  --text-primary:  #f5d0fe;
  --text-secondary:#c084fc;
  --text-hint:     #7c3aed;
  --accent:        #e879f9;
  --accent-hover:  #f0abfc;
  --accent-fg:     #0e0618;
  --border:        rgba(192,132,252,0.15);
  --border-strong: rgba(232,121,249,0.4);
  --radius-sm:     8px;
  --radius-md:     14px;
  --radius-lg:     24px;
  --font-display:  'Neue Haas Unica', 'Helvetica Neue', sans-serif;
  --font-body:     'Neue Haas Unica', system-ui, sans-serif;
  --font-mono:     'Space Mono', monospace;
  --shadow:        0 4px 40px rgba(232,121,249,0.2);
  --transition:    all 0.22s cubic-bezier(0.34,1.56,0.64,1);
}
```

**Visual rules:**
- Background: animated gradient mesh — slow-moving aurora of purples and violets
- CTAs have a plasma halo: `box-shadow: 0 0 32px rgba(232,121,249,0.5)`
- `backdrop-filter: blur(16px) saturate(180%)` on all surface panels
- Transition uses spring overshoot (`cubic-bezier(0.34,1.56,0.64,1)`) — feels alive
- Typography: airy tracking (`0.04em`) on body, tight negative tracking on display
- Stars/particle background on `--bg-primary` (pure CSS or canvas — your choice)

---

### THEME 5 — Warm Parchment
*Editorial luxury. Stripe meets a leather-bound journal.*

```css
[data-theme="parchment"] {
  --bg-primary:    #fdf6ed;
  --bg-surface:    #f5e8d4;
  --bg-elevated:   #ecddc4;
  --text-primary:  #2c1a0e;
  --text-secondary:#7a5030;
  --text-hint:     #b8906a;
  --accent:        #c1440e;
  --accent-hover:  #a03308;
  --accent-fg:     #ffffff;
  --border:        rgba(139,94,60,0.2);
  --border-strong: rgba(139,94,60,0.5);
  --radius-sm:     4px;
  --radius-md:     8px;
  --radius-lg:     14px;
  --font-display:  'Canela', 'Playfair Display', Georgia, serif;
  --font-body:     'Untitled Sans', 'DM Sans', system-ui, sans-serif;
  --font-mono:     'iA Writer Mono', 'Courier New', monospace;
  --shadow:        0 2px 12px rgba(44,26,14,0.12);
  --transition:    all 0.3s cubic-bezier(0.25,0.1,0.25,1);
}
```

**Visual rules:**
- Subtle paper grain texture (SVG noise filter or CSS `filter: url(#noise)`)
- Headings use serif font (`--font-display`); all UI uses sans (`--font-body`)
- Warm drop shadows (brown-tinted, not black)
- Images and cards have a slight warm sepia overlay (`mix-blend-mode: multiply`)
- Slow, deliberate transitions (0.3s) — like turning a page
- Ink-bleed hover: borders gently widen on hover rather than changing color

---

### THEME 6 — Arctic Oxide
*Cold precision. Bloomberg terminal if it got redesigned by Figma.*

```css
[data-theme="arctic"] {
  --bg-primary:    #eef3f8;
  --bg-surface:    #dce8f0;
  --bg-elevated:   #ffffff;
  --text-primary:  #001a3d;
  --text-secondary:#3a5a7a;
  --text-hint:     #7a9ab8;
  --accent:        #0050b3;
  --accent-hover:  #003d8a;
  --accent-fg:     #ffffff;
  --border:        #b8ccdc;
  --border-strong: #0050b3;
  --radius-sm:     4px;
  --radius-md:     6px;
  --radius-lg:     10px;
  --font-display:  'IBM Plex Sans', system-ui, sans-serif;
  --font-body:     'IBM Plex Sans', system-ui, sans-serif;
  --font-mono:     'IBM Plex Mono', monospace;
  --shadow:        0 1px 4px rgba(0,26,61,0.1);
  --transition:    all 0.15s ease-out;
}
```

**Visual rules:**
- Data tables with alternating row tints (`--bg-surface` / `--bg-elevated`)
- Compact density — tighter padding than other themes (0.5× multiplier)
- Monochromatic; the only color accent is `--accent` cobalt blue
- Focus rings: `outline: 2px solid var(--accent)` — no glow, clinical precision
- Numbers in monospace font always, even in body copy

---

### THEME 7 — LIGHT IVORY (Light)
*The benchmark. What Apple.com would look like as an app.*

```css
[data-theme="apple"] {
  --bg-primary:    #f5f5f7;
  --bg-surface:    #ffffff;
  --bg-elevated:   #ffffff;
  --text-primary:  #1d1d1f;
  --text-secondary:#6e6e73;
  --text-hint:     #aeaeb2;
  --accent:        #0071e3;
  --accent-hover:  #0077ed;
  --accent-fg:     #ffffff;
  --border:        rgba(0,0,0,0.08);
  --border-strong: rgba(0,0,0,0.18);
  --radius-sm:     8px;
  --radius-md:     12px;
  --radius-lg:     18px;
  --font-display:  'SF Pro Display', -apple-system, 'Helvetica Neue', sans-serif;
  --font-body:     'SF Pro Text', -apple-system, 'Helvetica Neue', sans-serif;
  --font-mono:     'SF Mono', 'Fira Code', monospace;
  --shadow:        0 2px 20px rgba(0,0,0,0.08);
  --transition:    all 0.2s cubic-bezier(0.4,0,0.2,1);
}
```

**Visual rules:**
- `-apple-system` font stack — renders native SF Pro on macOS/iOS
- Backgrounds are `#f5f5f7` (Apple's exact page gray) — never pure white at page level
- Cards are white with `--shadow` — subtle lift, no harsh borders
- Large, generous whitespace — minimum `2rem` vertical rhythm between sections
- CTAs are pill-shaped (`border-radius: 980px`) in Apple blue `#0071e3`
- Hover states are gentle: `opacity: 0.85` on CTAs, background lightens on surfaces
- Text uses Apple's exact type scale: 56px hero → 28px section title → 17px body → 12px caption
- Smooth scroll behaviors throughout; section entrances use `opacity` + `translateY(20px)` reveal

---

## THEME SELECTOR COMPONENT SPEC

Build the following component:

### Structure
```
ThemeSelector
├── SectionHeader ("Choose your theme")
├── ThemeGrid (2-col on mobile, 4-col on desktop)
│   └── ThemeCard × 7
│       ├── PreviewSwatch (mini UI mockup)
│       ├── ThemeName
│       ├── ThemeTagline
│       └── ActiveIndicator (checkmark ring when selected)
└── LivePreviewPanel
    ├── PreviewNav (logo + nav links + CTA button)
    ├── PreviewCard (title + body text + badge + secondary button)
    └── PreviewInput (text input + submit button)
```

### ThemeCard behavior
- On click: apply theme instantly via `document.documentElement.setAttribute('data-theme', id)`
- Active card: ring border using `--accent`, checkmark icon in top-right corner
- Hover: lift with `--shadow`, scale `1.02`
- The `PreviewSwatch` inside each card must render in THAT card's theme colors — not the global active theme

### ThemeCard PreviewSwatch
Render a 160×100px mini UI mockup inside each card showing:
- A colored top bar (accent color)
- Two gray text lines (surface + text colors)
- One accent-colored button pill

### LivePreviewPanel
- Updates in real-time as themes are switched
- Animate the transition: fade out → swap tokens → fade in (150ms)
- Show at least: a navigation bar, a hero text block, one card, and one form input

### Persistence
```js
// On mount
const saved = localStorage.getItem('app-theme') || 'apple';
document.documentElement.setAttribute('data-theme', saved);

// On selection
function applyTheme(id) {
  document.documentElement.setAttribute('data-theme', id);
  localStorage.setItem('app-theme', id);
}
```

---

## GLOBAL RULES FOR ALL THEMES

1. **No hardcoded colors anywhere** — every color must reference a CSS variable
2. **Font loading**: Use Google Fonts or system fallbacks. Load only what renders — no FOUT
3. **Transitions**: Apply `transition: var(--transition)` to `background-color`, `color`, `border-color`, `box-shadow` on all interactive elements
4. **Accessibility**: Every theme must pass WCAG AA contrast (4.5:1 text, 3:1 UI components)
5. **Dark/Light awareness**: Themes 1, 3, 4 are dark. Themes 2, 5, 6, 7 are light. The `prefers-color-scheme` media query should default to the appropriate variant
6. **No theme bleeds into another** — each `[data-theme]` scope must fully override every token

---

## DELIVERABLE CHECKLIST

- [ ] All 7 themes implemented as CSS token sets
- [ ] Theme selector UI section with 7 selectable cards
- [ ] Each card shows a mini preview in its own theme colors
- [ ] Live preview panel updates on selection
- [ ] Active theme persisted to localStorage
- [ ] Smooth transition animation between themes
- [ ] Responsive layout (mobile + desktop)
- [ ] No hardcoded colors — 100% CSS variable driven
- [ ] Fonts loaded correctly (Google Fonts CDN or system stack)
- [ ] Works in latest Chrome, Firefox, and Safari

---

*Generated by Claude for use with any LLM or AI coding tool.*
