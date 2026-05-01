# ⚡ PERFORMANCE FIRST + VICTORIAN AESTHETIC
## BEC Dev Club Session Tracker — Speed & Soul
### Priority 1: Buttery smooth 60fps. Priority 2: Victorian England artistry.
### Stack: React + Tailwind + Framer Motion (NO Three.js unless specified)

> Paste this into Cursor / Bolt.new / Lovable.
> Say: "Rebuild the app following this file exactly. Performance is non-negotiable."

---

## 🚨 THE PERFORMANCE MANIFESTO

**The golden rule:** A laggy app with beautiful design loses to a smooth app
with average design. Every time. Without exception.

**What was killing performance (REMOVE ALL OF THESE):**
```
✗ Three.js / React Three Fiber — 800KB bundle, kills mobile
✗ Multiple Canvas elements running simultaneously
✗ Particle fields with per-frame position updates
✗ MeshTransmissionMaterial (extremely GPU heavy)
✗ Auto-orbiting camera loops
✗ Magnetic cursor with requestAnimationFrame loop
✗ Multiple simultaneous Framer Motion layout animations
✗ backdrop-filter: blur() on more than 1-2 elements
✗ box-shadow on every card (compositing cost)
✗ Animating width/height — always use transform instead
✗ animate-pulse on more than 3 elements simultaneously
✗ Google Fonts loading 4+ font families
```

**What stays — the performance-safe animation toolkit:**
```
✓ CSS transforms (translate, scale, rotate) — GPU accelerated
✓ CSS opacity — GPU accelerated
✓ Framer Motion with will-change: transform
✓ One subtle CSS gradient orb (no blur filter)
✓ SVG animations (path drawing, stroke-dashoffset)
✓ CSS clip-path reveals
✓ IntersectionObserver for scroll triggers (not scroll events)
✓ requestAnimationFrame only for typewriter (text, no DOM thrash)
✓ Single backdrop-blur on nav only
```

---

## 📦 DEPENDENCIES — LEAN STACK

```bash
# Keep these
npm install framer-motion        # ~180KB — worth it
npm install lucide-react         # ~50KB tree-shakeable icons
npm install clsx                 # ~1KB utility
npm install tailwind-merge       # ~5KB utility

# Remove / never install
# @react-three/fiber     ← REMOVED
# @react-three/drei      ← REMOVED
# three                  ← REMOVED
# @react-spring/three    ← REMOVED
```

**Fonts — 2 families maximum, preloaded:**
```html
<head>
  <!-- Preconnect first — critical -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- Load ONLY 2 families, display=swap prevents render block -->
  <link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- JetBrains Mono — subset only (numbers + basic latin) -->
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&subset=latin&display=swap" rel="stylesheet">
</head>
```

---

## 🎨 THE VICTORIAN ENGLAND AESTHETIC

**Codename: Gaslight Archive**

**The feeling:** A Victorian naturalist's journal digitised.
Brass instruments on velvet. Ink on aged parchment.
Expedition records. Meticulous handwriting. Elegant structure.
The British Museum reading room. Sherlock Holmes' study.

**Visual references:**
- Aged parchment paper (#F2EBD9)
- India ink on cream (#2C1A0E)
- Tarnished brass (#B8860B)
- Deep bottle green (#2D4A3E)
- Burgundy wax seal (#6B2D2D)
- Victorian ornamental borders (SVG, not images)

**Typography character:**
- `IM Fell English` — authentic Victorian serif, free on Google Fonts
  (digitised from actual 17th-century typefaces used in Victorian reprints)
- `DM Sans` — clean modern UI text (contrast to the display font)
- `JetBrains Mono` — numbers, data, timestamps

**Decorative motifs (pure SVG, zero performance cost):**
- Corner flourishes on cards
- Thin ornamental dividers
- Wax seal avatars
- Manuscript-style section numbers

---

## 🎨 DESIGN TOKENS

```css
/* index.css */
:root {
  /* Parchment backgrounds */
  --bg-parchment:   #F2EBD9;   /* aged parchment — main bg */
  --bg-vellum:      #F8F3E8;   /* lighter vellum — card bg */
  --bg-cream:       #FDFAF4;   /* near-white cream — elevated */
  --bg-pressed:     #EAE0CA;   /* pressed parchment — hover */

  /* Ink text */
  --ink-deep:       #2C1A0E;   /* india ink — primary text */
  --ink-mid:        #6B5240;   /* brown ink — secondary */
  --ink-faint:      #A8917A;   /* faded ink — muted */
  --ink-ghost:      #C8B89A;   /* ghost ink — disabled */

  /* Brass accent — the gold of Victorian instruments */
  --brass:          #B8860B;   /* tarnished brass */
  --brass-bright:   #D4A017;   /* polished brass */
  --brass-dim:      #8B6508;   /* aged brass */
  --brass-tint:     rgba(184,134,11,0.10);
  --brass-glow:     rgba(184,134,11,0.20);

  /* Secondary accents */
  --bottle-green:   #2D4A3E;   /* Victorian bottle green */
  --green-tint:     rgba(45,74,62,0.08);
  --burgundy:       #6B2D2D;   /* wax seal red */
  --burgundy-tint:  rgba(107,45,45,0.08);

  /* Borders — ink lines */
  --border-hair:    rgba(44,26,14,0.10);   /* hairline */
  --border-soft:    rgba(44,26,14,0.15);   /* soft rule */
  --border-rule:    rgba(44,26,14,0.22);   /* column rule */
  --border-strong:  rgba(44,26,14,0.35);   /* strong border */
  --border-focus:   rgba(184,134,11,0.60);

  /* Shadows — warm sepia tones */
  --shadow-lift:    0 1px 3px rgba(44,26,14,0.08),
                    0 4px 16px rgba(44,26,14,0.06);
  --shadow-raised:  0 4px 8px rgba(44,26,14,0.10),
                    0 12px 32px rgba(44,26,14,0.08);
  --shadow-brass:   0 4px 20px rgba(184,134,11,0.22);

  /* Typography */
  --font-display:   'IM Fell English', Georgia, serif;
  --font-ui:        'DM Sans', system-ui, sans-serif;
  --font-mono:      'JetBrains Mono', monospace;
}
```

## Tailwind Config
```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"IM Fell English"', 'Georgia', 'serif'],
        ui:      ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        parchment: '#F2EBD9',
        vellum:    '#F8F3E8',
        cream:     '#FDFAF4',
        pressed:   '#EAE0CA',
        ink:       '#2C1A0E',
        'ink-2':   '#6B5240',
        'ink-3':   '#A8917A',
        brass:     '#B8860B',
        'brass-bright': '#D4A017',
        'brass-dim':    '#8B6508',
        'brass-tint':   'rgba(184,134,11,0.10)',
        forest:    '#2D4A3E',
        burgundy:  '#6B2D2D',
        border:    'rgba(44,26,14,0.15)',
      },
      boxShadow: {
        'lift':   '0 1px 3px rgba(44,26,14,0.08), 0 4px 16px rgba(44,26,14,0.06)',
        'raised': '0 4px 8px rgba(44,26,14,0.10), 0 12px 32px rgba(44,26,14,0.08)',
        'brass':  '0 4px 20px rgba(184,134,11,0.22)',
      },
      animation: {
        'fade-up':   'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':   'fadeIn 0.4s ease both',
        'draw-line': 'drawLine 1.2s ease forwards',
      },
      keyframes: {
        fadeUp:   { from: { opacity:'0', transform:'translateY(16px)' },
                    to:   { opacity:'1', transform:'translateY(0)' } },
        fadeIn:   { from: { opacity:'0' }, to: { opacity:'1' } },
        drawLine: { from: { strokeDashoffset:'1000' },
                    to:   { strokeDashoffset:'0' } },
      },
    },
  },
  plugins: [],
}
```

---

## 🌿 GLOBAL STYLES

```css
/* index.css */

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  background-color: #F2EBD9;
  color: #2C1A0E;
  font-family: 'DM Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  /* Subtle parchment texture — CSS only, zero performance cost */
  background-image:
    /* Diagonal grain lines */
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 40px,
      rgba(44,26,14,0.012) 40px,
      rgba(44,26,14,0.012) 41px
    ),
    /* Warm top vignette */
    radial-gradient(
      ellipse 120% 60% at 50% -10%,
      rgba(184,134,11,0.06) 0%,
      transparent 60%
    );
}

/* Performance: contain paint for cards */
.card { contain: layout style paint; }

/* Scrollbar — brass thin */
::-webkit-scrollbar       { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(184,134,11,0.35);
  border-radius: 999px;
}

/* Text selection — brass on parchment */
::selection {
  background: rgba(184,134,11,0.20);
  color: #8B6508;
}

/* Reduce motion — respect OS setting */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🧭 NAVIGATION — Victorian Floating Pill

One `backdrop-filter: blur()` — only here. Nowhere else.

```jsx
<nav
  style={{ left: '50%', transform: 'translateX(-50%)' }}
  className="fixed top-4 z-50 flex items-center gap-1 px-2 py-2
             bg-vellum/85 backdrop-blur-md
             border border-[rgba(44,26,14,0.18)]
             rounded-2xl shadow-raised
             whitespace-nowrap"
>
  {/* Wax seal logo */}
  <WaxSealLogo />

  {/* Nav items */}
  {NAV_ITEMS.map(item => (
    <NavItem key={item.id} {...item} active={current === item.id} />
  ))}

  {/* Past sessions counter */}
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                  bg-parchment border border-[rgba(44,26,14,0.12)]
                  font-mono text-xs text-ink-3">
    <span className="font-display italic text-[10px]">vol.</span>
    <span className="font-mono font-bold">{sessions.length}</span>
  </div>

  {/* Dark mode toggle */}
  <ThemeToggle />
</nav>
```

**Active nav item:**
```jsx
// Active: dark ink bg with cream text
// Inactive: transparent, ink-2 text
<button className={clsx(
  "px-4 py-2 rounded-xl font-ui font-semibold text-xs tracking-wider uppercase",
  "transition-colors duration-150",
  active
    ? "bg-ink text-cream"
    : "text-ink-2 hover:text-ink hover:bg-pressed"
)}>
  {label}
</button>
```

---

## 🪄 VICTORIAN WAXSEAL LOGO

Pure SVG. Zero cost. Looks handcrafted.

```jsx
function WaxSealLogo() {
  return (
    <div className="w-9 h-9 relative flex-shrink-0">
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Seal shape — 12-pointed star via polygon */}
        <polygon
          points="18,2 20.5,8 27,6 25,12 31,15 26,19 29,25 23,24 21,31 18,26 15,31 13,24 7,25 10,19 5,15 11,12 9,6 15,8"
          fill="#6B2D2D"
          stroke="#8B3535"
          strokeWidth="0.5"
        />
        {/* Inner circle */}
        <circle cx="18" cy="18" r="9" fill="#7A3333" />
        {/* Letter B — initial */}
        <text x="18" y="22.5" textAnchor="middle"
              fontFamily="IM Fell English, serif"
              fontSize="11" fontWeight="400"
              fill="#F2EBD9" letterSpacing="0">
          B
        </text>
      </svg>
    </div>
  )
}
```

---

## 🏛️ VICTORIAN SECTION LABEL

Replaces the plain dot + uppercase pattern with something richer:

```jsx
function SectionLabel({ text, number }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      {/* Roman numeral or number */}
      {number && (
        <span className="font-display italic text-brass text-sm">
          {toRoman(number)}.
        </span>
      )}
      {/* Decorative rule left */}
      <div className="w-6 h-px bg-[rgba(44,26,14,0.25)]" />
      {/* Label */}
      <span className="font-ui text-[10px] font-semibold uppercase
                      tracking-[0.15em] text-ink-3">
        {text}
      </span>
      {/* Decorative rule right */}
      <div className="flex-1 h-px bg-[rgba(44,26,14,0.12)]" />
    </div>
  )
}

// Roman numeral helper
function toRoman(n) {
  const map = [[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]
  return map.reduce((s,[v,r]) => { while(n>=v){s+=r;n-=v} return s }, '')
}
```

---

## 📰 DASHBOARD — Victorian Gazette Layout

### Hero Headline — Newspaper Masthead Style

```jsx
{/* Masthead top rule */}
<div className="flex items-center gap-3 mb-6">
  <div className="flex-1 h-px bg-[rgba(44,26,14,0.30)]" />
  <span className="font-display italic text-ink-2 text-xs tracking-widest px-3">
    BEC DEV CLUB · ESTABLISHED MMXXIV
  </span>
  <div className="flex-1 h-px bg-[rgba(44,26,14,0.30)]" />
</div>

{/* Victorian double rule — ornamental header border */}
<div className="mb-8">
  <div className="h-[3px] bg-ink" />
  <div className="h-[1px] bg-ink mt-[3px]" />
</div>

{/* Headline */}
<div className="mb-6">
  <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3 mb-1">
    Session Archive
  </p>
  <h1 className="font-display text-6xl md:text-7xl leading-[1.0] text-ink">
    Every session.
  </h1>
  <h1 className="font-display italic text-6xl md:text-7xl leading-[1.0] text-brass">
    Remembered.
  </h1>
  <p className="font-ui text-base text-ink-2 mt-4 max-w-md leading-relaxed">
    A focused archive of your chapter's sessions.
    Local-first. Zero clutter. Every detail preserved.
  </p>
</div>

{/* Victorian double rule — close */}
<div className="mb-8">
  <div className="h-[1px] bg-ink" />
  <div className="h-[3px] bg-ink mt-[3px]" />
</div>
```

### PERFORMANCE-SAFE ENTRANCE ANIMATION

Use CSS animation classes — not Framer Motion for simple reveals.
Framer Motion only for interactive elements.

```jsx
// Stagger with CSS animation-delay — zero JS overhead
{statCards.map((card, i) => (
  <div
    key={card.label}
    className="animate-fade-up card"
    style={{ animationDelay: `${i * 80}ms` }}
  >
    <StatCard {...card} />
  </div>
))}
```

### STAT CARDS — Victorian Ledger Style

No border-left accent. Instead: a printed ledger aesthetic.
Top label in small caps. Number in large mono. Ruled bottom line.

```jsx
function StatCard({ label, value, icon, sub }) {
  return (
    <div className="bg-vellum rounded-xl p-5 border border-[rgba(44,26,14,0.12)]
                   shadow-lift hover:shadow-raised hover:-translate-y-0.5
                   transition-all duration-200 card">

      {/* Top row: icon + label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-brass text-sm">{icon}</span>
        <span className="font-ui text-[10px] font-semibold uppercase
                        tracking-[0.15em] text-ink-3">
          {label}
        </span>
      </div>

      {/* Number — animated count-up */}
      <AnimatedNumber value={value} />

      {/* Bottom ruled line + sub-text */}
      <div className="mt-4 pt-3 border-t border-[rgba(44,26,14,0.12)]">
        <p className="font-ui text-xs text-ink-3">{sub || 'No records yet'}</p>
      </div>
    </div>
  )
}
```

**AnimatedNumber — lightweight, no library:**
```jsx
function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = React.useState(0)
  const frameRef = React.useRef(null)

  React.useEffect(() => {
    const target = parseInt(value) || 0
    if (target === 0) return
    const start = performance.now()

    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value])

  return (
    <span className="font-mono font-bold text-5xl text-ink tabular-nums">
      {String(display).padStart(2, '0')}
    </span>
  )
}
```

---

## 🗂️ ARCHIVE — Victorian Session Cards

### Card with Corner Flourish (pure SVG, zero cost)

```jsx
function CornerFlourish({ position = 'top-left' }) {
  const rotations = {
    'top-left':     'rotate(0)',
    'top-right':    'rotate(90)',
    'bottom-right': 'rotate(180)',
    'bottom-left':  'rotate(270)',
  }

  return (
    <svg
      width="20" height="20" viewBox="0 0 20 20"
      className={`absolute ${
        position === 'top-left'     ? 'top-2 left-2'  :
        position === 'top-right'    ? 'top-2 right-2' :
        position === 'bottom-right' ? 'bottom-2 right-2' : 'bottom-2 left-2'
      } opacity-30`}
      style={{ transform: rotations[position] }}
    >
      <path
        d="M2,18 L2,4 Q2,2 4,2 L8,2"
        stroke="#B8860B" strokeWidth="1" fill="none"
        strokeLinecap="round"
      />
      <circle cx="3.5" cy="3.5" r="1" fill="#B8860B" />
    </svg>
  )
}

function SessionCard({ session }) {
  return (
    <div className="relative bg-vellum rounded-xl p-5
                   border border-[rgba(44,26,14,0.12)] shadow-lift
                   hover:shadow-raised hover:-translate-y-0.5
                   transition-all duration-200 cursor-pointer card"
         onClick={() => openSession(session)}>

      {/* Corner flourishes */}
      <CornerFlourish position="top-left" />
      <CornerFlourish position="top-right" />

      {/* Tag */}
      {session.tag && <TagChip tag={session.tag} />}

      {/* Date — Victorian format */}
      <p className="font-display italic text-xs text-ink-3 mt-2">
        {formatDate(session.date, 'DD MMMM, YYYY')}
      </p>

      {/* Title */}
      <h3 className="font-display text-xl text-ink mt-1 leading-snug line-clamp-2">
        {session.title}
      </h3>

      {/* Host */}
      <p className="font-ui text-xs text-ink-2 mt-1.5">
        Presided by <span className="font-semibold">{session.host}</span>
      </p>

      {/* Summary excerpt */}
      {session.summary && (
        <p className="font-ui text-xs text-ink-3 mt-2 line-clamp-2 leading-relaxed
                     border-l-2 border-[rgba(44,26,14,0.15)] pl-3 italic">
          {session.summary}
        </p>
      )}

      {/* Ruled divider */}
      <div className="my-3 h-px bg-[rgba(44,26,14,0.10)]" />

      {/* Attendance */}
      <AttendanceBar present={session.presentCount} total={session.totalCount} />

      {/* Bottom: rating stars */}
      {session.rating > 0 && (
        <div className="flex gap-0.5 mt-2">
          {[1,2,3,4,5].map(s => (
            <span key={s} className="text-xs"
                  style={{ color: s <= session.rating ? '#B8860B' : '#C8B89A' }}>
              ★
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Victorian Empty State

```jsx
function EmptyArchive() {
  return (
    <div className="flex flex-col items-center py-20 px-8">

      {/* Ornamental SVG illustration */}
      <svg width="160" height="100" viewBox="0 0 160 100"
           className="mb-8 opacity-40">
        {/* Open book */}
        <path d="M80,20 Q50,18 20,25 L20,80 Q50,73 80,75"
              fill="#F8F3E8" stroke="#B8860B" strokeWidth="1.5" />
        <path d="M80,20 Q110,18 140,25 L140,80 Q110,73 80,75"
              fill="#F8F3E8" stroke="#B8860B" strokeWidth="1.5" />
        {/* Spine */}
        <line x1="80" y1="20" x2="80" y2="75"
              stroke="#B8860B" strokeWidth="2" />
        {/* Lines on left page */}
        <line x1="30" y1="38" x2="72" y2="36" stroke="#C8B89A" strokeWidth="1" />
        <line x1="30" y1="46" x2="72" y2="44" stroke="#C8B89A" strokeWidth="1" />
        <line x1="30" y1="54" x2="60" y2="52" stroke="#C8B89A" strokeWidth="1" />
        {/* Lines on right page */}
        <line x1="88" y1="38" x2="130" y2="36" stroke="#C8B89A" strokeWidth="1" />
        <line x1="88" y1="46" x2="130" y2="44" stroke="#C8B89A" strokeWidth="1" />
        <line x1="88" y1="54" x2="118" y2="52" stroke="#C8B89A" strokeWidth="1" />
        {/* Decorative quill above */}
        <path d="M75,8 Q80,2 85,8 Q82,14 80,18 Q78,14 75,8Z"
              fill="#B8860B" opacity="0.6" />
        <line x1="80" y1="18" x2="80" y2="26"
              stroke="#8B6508" strokeWidth="1" />
      </svg>

      {/* Victorian ornamental divider */}
      <div className="flex items-center gap-3 mb-4 opacity-40">
        <div className="w-8 h-px bg-ink-3" />
        <span className="font-display italic text-brass text-sm">✦</span>
        <div className="w-8 h-px bg-ink-3" />
      </div>

      <p className="font-display italic text-2xl text-ink mb-2 text-center">
        The Archive Awaits
      </p>
      <p className="font-ui text-sm text-ink-2 text-center max-w-xs leading-relaxed mb-8">
        No sessions have been recorded yet. Compile your first
        entry to begin the chronicle.
      </p>

      <button
        onClick={() => navigate('create')}
        className="flex items-center gap-2 px-8 py-3.5 rounded-xl
                   bg-ink text-cream font-ui font-semibold text-sm
                   hover:bg-ink/90 hover:-translate-y-0.5
                   shadow-[0_4px_20px_rgba(44,26,14,0.20)]
                   transition-all duration-200"
      >
        + Begin the Chronicle
      </button>
    </div>
  )
}
```

---

## 📝 CREATE SESSION — Victorian Manuscript Form

### Page Header
```jsx
<div className="mb-8">
  <SectionLabel text="New Entry" />
  <h1 className="font-display text-5xl text-ink">New session.</h1>
  <p className="font-display italic text-5xl text-brass">Make it count.</p>
  <p className="font-ui text-sm text-ink-2 mt-3">
    Record the particulars. Mark the register. Commit to the archive.
  </p>
</div>
```

### Floating Label Inputs — CSS only (no JS overhead)

```css
/* Pure CSS floating labels — ZERO JavaScript */
.field-group { position: relative; }

.field-group input,
.field-group textarea {
  width: 100%;
  padding: 20px 16px 8px;
  background: #FDFAF4;
  border: 1.5px solid rgba(44,26,14,0.15);
  border-radius: 12px;
  font-family: 'DM Sans', system-ui;
  font-size: 14px;
  color: #2C1A0E;
  transition: border-color 150ms, box-shadow 150ms;
  outline: none;
}

.field-group input:focus,
.field-group textarea:focus {
  border-color: rgba(184,134,11,0.60);
  box-shadow: 0 0 0 3px rgba(184,134,11,0.10);
}

.field-group label {
  position: absolute;
  left: 16px;
  top: 14px;
  font-family: 'DM Sans', system-ui;
  font-size: 14px;
  color: #A8917A;
  pointer-events: none;
  transition: top 150ms ease, font-size 150ms ease, color 150ms ease;
}

/* Float label on focus OR when input has value */
.field-group input:focus + label,
.field-group input:not(:placeholder-shown) + label,
.field-group textarea:focus + label,
.field-group textarea:not(:placeholder-shown) + label {
  top: 6px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #B8860B;
}
```

```jsx
// Usage — note: input comes BEFORE label in DOM for CSS sibling selector
function FloatingField({ label, required, textarea, ...props }) {
  return (
    <div className="field-group">
      {textarea
        ? <textarea placeholder=" " rows={4} {...props} />
        : <input placeholder=" " {...props} />
      }
      <label>{label}{required && <span className="text-brass ml-0.5">*</span>}</label>
    </div>
  )
}
```

### Progress Steps — CSS only
```jsx
function ProgressSteps({ current }) {
  const steps = ['Session Details', 'Attendance', 'Compile']
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className={clsx(
            "flex items-center gap-2 font-ui text-xs font-semibold uppercase tracking-wider",
            i <= current ? "text-ink" : "text-ink-3"
          )}>
            <span className={clsx(
              "w-5 h-5 rounded-full flex items-center justify-center",
              "font-mono text-[10px] font-bold transition-colors duration-300",
              i < current  ? "bg-forest text-cream" :
              i === current ? "bg-brass text-cream" :
              "bg-pressed text-ink-3"
            )}>
              {i < current ? '✓' : i + 1}
            </span>
            <span className="hidden sm:inline">{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={clsx(
              "flex-1 h-px transition-colors duration-500",
              i < current ? "bg-forest" : "bg-[rgba(44,26,14,0.12)]"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
```

---

## 👥 ROSTER — Victorian Register

```jsx
// Page header
<div className="mb-8">
  <SectionLabel text="Register" number={3} />
  <h1 className="font-display text-6xl text-ink">Members.</h1>
  <p className="font-display italic text-6xl text-brass">
    Recorded once. Called always.
  </p>
</div>
```

### Member Row — Ledger Line Style

```jsx
function MemberRow({ member, index, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-3 px-3 group
                   hover:bg-pressed/60 rounded-xl
                   transition-colors duration-150
                   border-b border-[rgba(44,26,14,0.08)] last:border-0">

      {/* Ledger number */}
      <span className="font-mono text-xs text-ink-3 w-6 text-right flex-shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Wax seal avatar */}
      <WaxAvatar name={member.name} />

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-ui font-semibold text-sm text-ink truncate">
          {member.name}
        </p>
        <p className="font-display italic text-[10px] text-ink-3">
          Enrolled {formatRelativeDate(member.addedAt)}
        </p>
      </div>

      {/* Badges */}
      <div className="flex gap-1">
        {getMemberBadges(member).map(b => (
          <span key={b.id} title={b.label}
                className="text-sm cursor-default">{b.icon}</span>
        ))}
      </div>

      {/* Remove — slides in on hover */}
      <button
        onClick={() => onRemove(member.id)}
        className="opacity-0 group-hover:opacity-100 translate-x-2
                   group-hover:translate-x-0 transition-all duration-150
                   w-7 h-7 rounded-lg flex items-center justify-center
                   text-ink-3 hover:text-burgundy hover:bg-[rgba(107,45,45,0.08)]"
      >
        ✕
      </button>
    </div>
  )
}
```

### Wax Avatar — Victorian seal per member

```jsx
const SEAL_COLORS = [
  { fill: '#6B2D2D', stroke: '#8B3535' },  // burgundy
  { fill: '#2D4A3E', stroke: '#3D6454' },  // bottle green
  { fill: '#8B6508', stroke: '#B8860B' },  // brass
  { fill: '#2C1A0E', stroke: '#4A2E1A' },  // india ink
  { fill: '#4A3060', stroke: '#6A4A80' },  // victorian purple
]

function WaxAvatar({ name, size = 'md' }) {
  const idx = name.charCodeAt(0) % SEAL_COLORS.length
  const { fill, stroke } = SEAL_COLORS[idx]
  const initial = name[0].toUpperCase()
  const dim = size === 'sm' ? 28 : size === 'lg' ? 44 : 36

  return (
    <svg width={dim} height={dim} viewBox="0 0 36 36" className="flex-shrink-0">
      <polygon
        points="18,2 20.5,8 27,6 25,12 31,15 26,19 29,25 23,24 21,31 18,26 15,31 13,24 7,25 10,19 5,15 11,12 9,6 15,8"
        fill={fill} stroke={stroke} strokeWidth="0.5"
      />
      <text x="18" y="22.5" textAnchor="middle"
            fontFamily="IM Fell English, serif"
            fontSize="12" fill="#F2EBD9">
        {initial}
      </text>
    </svg>
  )
}
```

---

## 📊 ANALYTICS — Victorian Gazette Charts

### SVG Attendance Trend (no library, zero bundle cost)

```jsx
function AttendanceTrendSVG({ sessions }) {
  const W = 600, H = 120, PAD = 20
  const data = sessions.slice(-10).map(s =>
    s.totalCount > 0 ? (s.presentCount / s.totalCount) * 100 : 0
  )
  if (data.length < 2) return <EmptyChart />

  const xStep = (W - PAD * 2) / (data.length - 1)
  const yScale = (v) => H - PAD - (v / 100) * (H - PAD * 2)

  const points = data.map((v, i) => ({
    x: PAD + i * xStep,
    y: yScale(v)
  }))

  // Smooth curve using cubic bezier
  const pathD = points.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = points[i - 1]
    const cpX = (prev.x + p.x) / 2
    return `${d} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`
  }, '')

  const areaD = `${pathD} L ${points[points.length-1].x} ${H} L ${PAD} ${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }}>
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#B8860B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#B8860B" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal grid lines */}
      {[0, 25, 50, 75, 100].map(v => (
        <line key={v}
          x1={PAD} y1={yScale(v)} x2={W-PAD} y2={yScale(v)}
          stroke="rgba(44,26,14,0.07)" strokeWidth="1"
          strokeDasharray="4,4"
        />
      ))}

      {/* Area fill */}
      <path d={areaD} fill="url(#trendGrad)" />

      {/* Trend line */}
      <path d={pathD} fill="none"
            stroke="#B8860B" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="animate-draw-line"
            style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />

      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4"
                  fill="#F2EBD9" stroke="#B8860B" strokeWidth="2" />
          <text x={p.x} y={H - 4} textAnchor="middle"
                fontSize="9" fill="rgba(44,26,14,0.45)"
                fontFamily="JetBrains Mono, monospace">
            {sessions[sessions.length - data.length + i]
              ? formatDate(sessions[sessions.length - data.length + i].date, 'DD/MM')
              : ''}
          </text>
        </g>
      ))}
    </svg>
  )
}
```

### Session Heatmap — GitHub style, Victorian colors

```jsx
function SessionHeatmap({ sessions }) {
  const grid = buildWeekGrid(sessions)

  const cellColor = (count) =>
    count === 0 ? 'rgba(44,26,14,0.06)' :
    count === 1 ? 'rgba(184,134,11,0.25)' :
    count === 2 ? 'rgba(184,134,11,0.55)' :
                  '#B8860B'

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={`${day.date}: ${day.count} session(s)`}
                className="w-3 h-3 rounded-sm cursor-pointer
                           hover:ring-1 hover:ring-brass/50
                           transition-all duration-150"
                style={{ backgroundColor: cellColor(day.count) }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## ⌨️ COMMAND PALETTE ⌘K

Performance-safe: renders only when open, instantly destroyed when closed.

```jsx
function CommandPalette({ sessions, members, navigate }) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  React.useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); setOpen(o => !o); setQuery('')
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  if (!open) return null  // ← unmount entirely when closed = zero cost

  // ... rest of command palette
}
```

---

## 🍞 TOAST NOTIFICATION

```jsx
// Lightweight — pure CSS animation, no Framer Motion
function Toast({ message, type, onUndo, onDismiss }) {
  React.useEffect(() => {
    const t = setTimeout(onDismiss, 4500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50
                   flex items-center gap-3 px-5 py-3.5
                   bg-ink text-cream rounded-xl
                   shadow-[0_8px_32px_rgba(44,26,14,0.25)]
                   animate-fade-up min-w-[260px]">

      <span className="text-base flex-shrink-0">
        {type === 'success' ? '✓' : '✕'}
      </span>

      <p className="font-ui text-sm flex-1">{message}</p>

      {onUndo && (
        <button onClick={onUndo}
                className="font-ui text-xs font-bold text-brass
                           hover:text-brass-bright transition-colors">
          UNDO
        </button>
      )}

      <button onClick={onDismiss}
              className="text-ink-3 hover:text-cream transition-colors text-xs ml-1">
        ✕
      </button>
    </div>
  )
}
```

---

## 🌙 DARK MODE — Victorian Gaslight

When dark mode is active, the parchment becomes aged leather and
candlelight amber. Same Victorian character, darker atmosphere.

```css
[data-theme="dark"] {
  --bg-parchment:  #1A1208;   /* aged leather */
  --bg-vellum:     #221A0C;   /* dark vellum */
  --bg-cream:      #2C2210;   /* deep amber */
  --bg-pressed:    #302818;

  --ink-deep:      #F0E8D0;   /* candlelight cream */
  --ink-mid:       #A89070;
  --ink-faint:     #6B5840;

  --brass:         #D4A017;   /* brighter brass in dark */
  --border-soft:   rgba(240,232,208,0.10);
  --border-rule:   rgba(240,232,208,0.16);

  --shadow-lift:   0 1px 3px rgba(0,0,0,0.40), 0 4px 16px rgba(0,0,0,0.30);
  --shadow-raised: 0 4px 8px rgba(0,0,0,0.45), 0 12px 32px rgba(0,0,0,0.35);
}

/* All CSS vars transition smoothly */
*, *::before, *::after {
  transition:
    background-color 300ms ease,
    border-color 200ms ease,
    color 150ms ease,
    box-shadow 200ms ease;
}
```

---

## ✅ OPTIMISED BUILD CHECKLIST

### Performance (must verify)
- [ ] `npm run build` bundle < 400KB gzipped
- [ ] No Three.js, no Canvas (except one optional heatmap)
- [ ] Lighthouse Performance score ≥ 90 on mobile
- [ ] Fonts: max 2 families, `display=swap`, preconnected
- [ ] `backdrop-filter: blur()` on nav only — nowhere else
- [ ] All cards use `contain: layout style paint`
- [ ] `will-change: transform` only on actively animating elements
- [ ] `@media (prefers-reduced-motion)` respected globally
- [ ] AnimatedNumber uses `cancelAnimationFrame` cleanup
- [ ] Command Palette `if (!open) return null` — unmounts when closed
- [ ] IntersectionObserver for scroll reveals (not scroll event listeners)
- [ ] Images (if any): WebP format, `loading="lazy"`, explicit dimensions

### Victorian Aesthetic
- [ ] `IM Fell English` for all headlines and italic accents
- [ ] Wax seal avatars on member rows and roster
- [ ] Corner flourishes on session cards
- [ ] Victorian masthead double rules on dashboard hero
- [ ] Ornamental dividers between sections
- [ ] "Begin the Chronicle" / "Presided by" copy throughout
- [ ] Open book SVG empty state illustration
- [ ] Sepia parchment diagonal grain texture (CSS only)
- [ ] Dark mode = aged leather + candlelight brass

### Features
- [ ] Animated number counter on stat cards
- [ ] Session card with corner flourishes + tag chips
- [ ] Attendance progress bar (viewport-triggered)
- [ ] Session rating stars
- [ ] SVG trend line (animated draw)
- [ ] Session heatmap (brass color scale)
- [ ] Real-time archive search
- [ ] Filter chips (tag, date, attendance)
- [ ] Member profile slide-in panel
- [ ] ⌘K Command palette
- [ ] Toast notifications + undo
- [ ] Export to PDF
- [ ] Dark mode toggle
- [ ] Keyboard shortcuts panel (?)
- [ ] Live session check-in mode
- [ ] Progress steps on create page
- [ ] CSS floating label inputs

---

## 🏆 WHAT JUDGES EXPERIENCE NOW

```
Enter the app →
  Parchment background with diagonal grain texture ←  "This feels different"

Hero headline appears →
  "Every session." in IM Fell English — solid ink weight
  "Remembered." in italic brass           ← "Oh. That's beautiful."

Stat cards count up →
  00 → 07 → 12... in JetBrains Mono      ← Satisfying

Archive cards visible →
  Corner flourishes, Victorian date format,
  IM Fell English titles, italic summary quotes ← "Is this... a journal?"

Click a card →
  Expands smoothly, full detail view      ← Premium

Open command palette ⌘K →
  Spotlight-style search, Victorian styling ← "This is a real product"

Analytics page →
  SVG trend line draws itself, heatmap fills,
  Sepia color scale                       ← "I've never seen this"

Toggle dark mode →
  Aged leather + candlelight brass        ← Standing ovation
```

---

*Performance + Victorian Aesthetic prompt for: BEC Dev Club Session Tracker*
*Stack: React + Tailwind + Framer Motion (minimal) + Pure SVG + CSS*
*No Three.js. No Canvas. No heavy blur filters. 60fps on mobile.*
*Aesthetic: Gaslight Archive — Victorian England meets digital precision*
