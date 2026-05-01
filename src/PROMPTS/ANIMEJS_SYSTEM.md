# ⚡ ANIME.JS ANIMATION SYSTEM
## BEC Dev Club Session Tracker — Victorian Gaslight Edition
### Replace Framer Motion entirely with Anime.js
### Performance + Victorian Artistry + Anime.js mastery

> Paste into Cursor / Bolt.new / Lovable.
> Say: "Use Anime.js for ALL animations. Remove Framer Motion completely."

---

## 📦 SETUP

```bash
npm install animejs
npm remove framer-motion   # clean house
```

```js
// src/lib/anime.js — single import point for the whole app
import anime from 'animejs'
export default anime
```

---

## 🧠 WHY ANIME.JS OVER FRAMER MOTION

```
Framer Motion:  ~180KB gzipped
Anime.js:       ~17KB gzipped   ← 10x smaller

Framer Motion:  React-coupled, re-renders on every frame
Anime.js:       Direct DOM manipulation, zero React overhead

Framer Motion:  Declarative (easier but heavier)
Anime.js:       Imperative (more control, more artistry)
```

Anime.js is what serious animation studios use for web.
It gives you timeline control, staggering, morphing, drawing —
things Framer Motion simply cannot do elegantly.

---

## 🎬 ANIMATION SYSTEM ARCHITECTURE

```
src/
├── lib/
│   └── anime.js              ← single import
├── animations/
│   ├── pageTransitions.js    ← page enter/exit
│   ├── heroAnimations.js     ← headline, subtitle, orb
│   ├── cardAnimations.js     ← stat cards, session cards
│   ├── formAnimations.js     ← inputs, progress steps
│   ├── timelineAnimations.js ← archive timeline draw
│   └── uiAnimations.js       ← toasts, modals, buttons
├── hooks/
│   ├── useAnime.js           ← reusable anime hook
│   └── useInView.js          ← IntersectionObserver hook
```

---

## 🪝 CORE HOOKS

### useAnime — run anime on mount with cleanup

```js
// src/hooks/useAnime.js
import { useEffect, useRef } from 'react'
import anime from '../lib/anime'

export function useAnime(config, deps = []) {
  const animRef = useRef(null)

  useEffect(() => {
    animRef.current = anime(config)
    return () => {
      if (animRef.current) animRef.current.pause()
    }
  }, deps)

  return animRef
}
```

### useInView — trigger anime when element enters viewport

```js
// src/hooks/useInView.js
import { useEffect, useRef, useState } from 'react'

export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)  // trigger once only
        }
      },
      { threshold: 0.15, ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}
```

### useAnimeInView — combine both

```js
// src/hooks/useAnimeInView.js
import { useEffect, useRef } from 'react'
import anime from '../lib/anime'

export function useAnimeInView(getConfig, deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          anime(getConfig(el))
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, deps)

  return ref
}
```

---

## 🏛️ ANIMATION 01 — HERO TIMELINE
### Victorian masthead reveals in sequence

The most complex animation in the app.
Uses anime.js **timeline** — the killer feature.
Everything sequences perfectly without manual delay math.

```js
// src/animations/heroAnimations.js
import anime from '../lib/anime'

export function runHeroTimeline() {
  const tl = anime.timeline({
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
    duration: 600,
  })

  // 1. Top rule lines draw in from center
  tl.add({
    targets: '.hero-rule-line',
    scaleX: [0, 1],
    transformOrigin: 'center',
    duration: 500,
    easing: 'easeOutQuart',
    delay: anime.stagger(80),
  })

  // 2. Masthead text fades in
  .add({
    targets: '.hero-masthead',
    opacity: [0, 1],
    translateY: [6, 0],
    duration: 400,
  }, '-=200')   // ← overlap: starts 200ms before previous ends

  // 3. Main headline — each word clips up
  .add({
    targets: '.hero-word',
    translateY: ['105%', '0%'],
    opacity: [0, 1],
    duration: 700,
    delay: anime.stagger(70),
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  }, '-=100')

  // 4. Italic brass line
  .add({
    targets: '.hero-italic',
    translateY: ['105%', '0%'],
    opacity: [0, 1],
    duration: 700,
    delay: anime.stagger(70),
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  }, '-=400')

  // 5. Double bottom rules draw
  .add({
    targets: '.hero-rule-bottom',
    scaleX: [0, 1],
    transformOrigin: 'left',
    duration: 600,
    delay: anime.stagger(100),
    easing: 'easeOutQuart',
  }, '-=200')

  // 6. Subtitle typewriter (handled by separate function)
  .add({
    targets: '.hero-subtitle',
    opacity: [0, 1],
    duration: 300,
    complete: () => startTypewriter('.hero-subtitle-text'),
  }, '-=100')

  // 7. CTA buttons pop in
  .add({
    targets: '.hero-cta',
    scale: [0.92, 1],
    opacity: [0, 1],
    duration: 500,
    delay: anime.stagger(80),
    easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',  // spring overshoot
  }, '-=100')

  return tl
}

// Typewriter — pure JS, no library
export function startTypewriter(selector, delay = 0) {
  const el = document.querySelector(selector)
  if (!el) return

  const text = el.dataset.text || el.textContent
  el.textContent = ''
  el.style.opacity = 1

  let i = 0
  // Blinking cursor element
  const cursor = document.createElement('span')
  cursor.className = 'typewriter-cursor'
  cursor.textContent = '|'
  el.after(cursor)

  const interval = setInterval(() => {
    el.textContent += text[i]
    i++
    if (i >= text.length) {
      clearInterval(interval)
      // Blink cursor 3 times then fade
      anime({
        targets: cursor,
        opacity: [1, 0],
        duration: 400,
        loop: 3,
        direction: 'alternate',
        complete: () => cursor.remove(),
      })
    }
  }, 26)
}
```

```jsx
// Dashboard.jsx — wire it up
import { useEffect } from 'react'
import { runHeroTimeline } from '../animations/heroAnimations'

export function Dashboard() {
  useEffect(() => {
    // Small delay to ensure DOM is painted
    const t = setTimeout(runHeroTimeline, 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div>
      {/* Masthead rules */}
      <div className="hero-rule-line h-[3px] bg-ink origin-center scale-x-0" />
      <div className="hero-rule-line h-px bg-ink mt-[3px] origin-center scale-x-0" />

      {/* Masthead label */}
      <p className="hero-masthead opacity-0 font-ui text-[10px] uppercase tracking-[0.18em] text-ink-3">
        Session Archive · BEC Dev Club
      </p>

      {/* Headline — split into word spans */}
      <h1>
        <div className="overflow-hidden">
          {"Every session.".split(' ').map((word, i) => (
            <span key={i} className="hero-word inline-block translate-y-full opacity-0 font-display text-7xl text-ink">
              {word}&nbsp;
            </span>
          ))}
        </div>
        <div className="overflow-hidden">
          {"Remembered.".split(' ').map((word, i) => (
            <span key={i} className="hero-italic inline-block translate-y-full opacity-0 font-display italic text-7xl text-brass">
              {word}&nbsp;
            </span>
          ))}
        </div>
      </h1>

      {/* Bottom rules */}
      <div className="hero-rule-bottom h-px bg-ink origin-left scale-x-0 mt-4" />
      <div className="hero-rule-bottom h-[3px] bg-ink origin-left scale-x-0 mt-[3px]" />

      {/* Typewriter subtitle */}
      <p className="hero-subtitle opacity-0 font-ui text-base text-ink-2 mt-4">
        <span
          className="hero-subtitle-text"
          data-text="A focused archive of your chapter's sessions. Local-first. Zero clutter."
        />
      </p>

      {/* CTAs */}
      <div className="flex gap-3 mt-6">
        <button className="hero-cta opacity-0 scale-95 ...">+ New Session</button>
        <button className="hero-cta opacity-0 scale-95 ...">Register</button>
      </div>
    </div>
  )
}
```

---

## 📊 ANIMATION 02 — STAT CARD COUNTER
### Number rolls up with Victorian ledger feel

```js
// src/animations/cardAnimations.js
import anime from '../lib/anime'

// Animate cards entering + numbers counting
export function animateStatCards() {
  // Cards stagger in
  anime({
    targets: '.stat-card',
    translateY: [24, 0],
    opacity: [0, 1],
    scale: [0.96, 1],
    duration: 600,
    delay: anime.stagger(100, { start: 200 }),
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  })

  // Numbers count up — with obj animation trick
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.value) || 0
    if (target === 0) return

    const obj = { value: 0 }
    anime({
      targets: obj,
      value: target,
      duration: 1400,
      delay: 400,
      easing: 'easeOutExpo',
      update: () => {
        el.textContent = String(Math.floor(obj.value)).padStart(2, '0')
      },
    })
  })
}

// Hover lift — called onMouseEnter/Leave
export function cardHoverIn(el) {
  anime({
    targets: el,
    translateY: -4,
    boxShadow: '0 8px 32px rgba(44,26,14,0.12)',
    duration: 200,
    easing: 'easeOutQuad',
  })
}

export function cardHoverOut(el) {
  anime({
    targets: el,
    translateY: 0,
    boxShadow: '0 1px 3px rgba(44,26,14,0.08), 0 4px 16px rgba(44,26,14,0.06)',
    duration: 200,
    easing: 'easeOutQuad',
  })
}
```

```jsx
// StatCard.jsx
import { useEffect, useRef } from 'react'
import { animateStatCards, cardHoverIn, cardHoverOut } from '../animations/cardAnimations'

function StatCard({ label, value, icon, sub }) {
  const cardRef = useRef(null)

  return (
    <div
      ref={cardRef}
      className="stat-card opacity-0 bg-vellum rounded-xl p-5
                 border border-[rgba(44,26,14,0.12)] shadow-lift card"
      onMouseEnter={() => cardHoverIn(cardRef.current)}
      onMouseLeave={() => cardHoverOut(cardRef.current)}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-brass">{icon}</span>
        <span className="font-ui text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-3">
          {label}
        </span>
      </div>

      <span
        className="stat-number font-mono font-bold text-5xl text-ink"
        data-value={value}
      >
        00
      </span>

      <div className="mt-4 pt-3 border-t border-[rgba(44,26,14,0.12)]">
        <p className="font-ui text-xs text-ink-3">{sub || 'No records yet'}</p>
      </div>
    </div>
  )
}

// Trigger in Dashboard after mount
useEffect(() => {
  const t = setTimeout(animateStatCards, 300)
  return () => clearTimeout(t)
}, [sessions])
```

---

## 🗂️ ANIMATION 03 — SESSION CARDS GRID
### Masonry stagger entrance + scroll reveal

```js
// src/animations/cardAnimations.js (continued)

export function animateSessionCards(containerEl) {
  const cards = containerEl.querySelectorAll('.session-card')

  anime({
    targets: cards,
    translateY: [32, 0],
    opacity: [0, 1],
    scale: [0.97, 1],
    duration: 550,
    delay: anime.stagger(60),
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  })
}

// Scroll-triggered — IntersectionObserver
export function observeSessionCards() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 500,
            easing: 'cubicBezier(0.16, 1, 0.3, 1)',
          })
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  document.querySelectorAll('.session-card').forEach(card => {
    card.style.opacity = 0
    observer.observe(card)
  })

  return () => observer.disconnect()
}
```

---

## 🔄 ANIMATION 04 — SESSION CARD FLIP (3D)
### CSS + anime.js hybrid — smooth Victorian card reveal

```js
// src/animations/cardAnimations.js (continued)

export function flipCard(frontEl, backEl, isFlipped) {
  if (!isFlipped) {
    // Flip to back
    anime({
      targets: frontEl,
      rotateY: [0, 90],
      duration: 280,
      easing: 'easeInQuad',
      complete: () => {
        frontEl.style.display = 'none'
        backEl.style.display = 'block'
        anime({
          targets: backEl,
          rotateY: [-90, 0],
          duration: 280,
          easing: 'easeOutQuad',
        })
      }
    })
  } else {
    // Flip to front
    anime({
      targets: backEl,
      rotateY: [0, 90],
      duration: 280,
      easing: 'easeInQuad',
      complete: () => {
        backEl.style.display = 'none'
        frontEl.style.display = 'block'
        anime({
          targets: frontEl,
          rotateY: [-90, 0],
          duration: 280,
          easing: 'easeOutQuad',
        })
      }
    })
  }
}
```

```jsx
// SessionCard.jsx
import { useRef, useState } from 'react'
import { flipCard, cardHoverIn, cardHoverOut } from '../animations/cardAnimations'

function SessionCard({ session }) {
  const frontRef = useRef(null)
  const backRef = useRef(null)
  const cardRef = useRef(null)
  const [flipped, setFlipped] = useState(false)

  const handleFlip = () => {
    flipCard(frontRef.current, backRef.current, flipped)
    setFlipped(f => !f)
  }

  return (
    <div
      ref={cardRef}
      className="session-card relative opacity-0 cursor-pointer"
      style={{ perspective: '1200px' }}
      onClick={handleFlip}
      onMouseEnter={() => !flipped && cardHoverIn(cardRef.current)}
      onMouseLeave={() => !flipped && cardHoverOut(cardRef.current)}
    >
      {/* FRONT */}
      <div ref={frontRef}
           className="bg-vellum rounded-xl p-5 border border-[rgba(44,26,14,0.12)] shadow-lift">
        <CornerFlourish position="top-left" />
        <CornerFlourish position="top-right" />
        {/* ... card content ... */}
        <p className="absolute bottom-3 right-4 font-ui text-[9px] text-ink-3/50 uppercase tracking-wider">
          Tap to inspect →
        </p>
      </div>

      {/* BACK */}
      <div ref={backRef}
           className="bg-ink rounded-xl p-5 absolute inset-0"
           style={{ display: 'none' }}>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-brass rounded-t-xl" />
        {/* ... back content ... */}
      </div>
    </div>
  )
}
```

---

## 📈 ANIMATION 05 — SVG LINE DRAW
### Trend line writes itself like a quill

```js
// src/animations/uiAnimations.js
import anime from '../lib/anime'

export function drawTrendLine(svgEl) {
  const path = svgEl.querySelector('.trend-path')
  if (!path) return

  const length = path.getTotalLength()

  // Set initial state
  path.style.strokeDasharray = length
  path.style.strokeDashoffset = length

  anime({
    targets: path,
    strokeDashoffset: [length, 0],
    duration: 1400,
    easing: 'easeInOutQuart',
    delay: 200,
  })

  // Data points pop in after line
  anime({
    targets: svgEl.querySelectorAll('.trend-point'),
    scale: [0, 1],
    opacity: [0, 1],
    duration: 300,
    delay: anime.stagger(80, { start: 800 }),
    easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
  })
}

// Attendance bar fill
export function animateAttendanceBar(barEl, percentage) {
  anime({
    targets: barEl,
    width: [`0%`, `${percentage}%`],
    duration: 800,
    easing: 'easeOutQuart',
    delay: 150,
  })
}
```

---

## 🗺️ ANIMATION 06 — SESSION HEATMAP
### Cells materialise from top-left like ink soaking paper

```js
// src/animations/cardAnimations.js (continued)

export function animateHeatmap(containerEl) {
  const cells = containerEl.querySelectorAll('.heatmap-cell')

  anime({
    targets: cells,
    scale: [0, 1],
    opacity: [0, 1],
    duration: 300,
    delay: anime.stagger(8, { grid: [7, 52], from: 'first' }),
    easing: 'easeOutBack',
  })
}
```

```jsx
// Heatmap.jsx
import { useEffect, useRef } from 'react'
import { animateHeatmap } from '../animations/cardAnimations'

function SessionHeatmap({ sessions }) {
  const containerRef = useRef(null)
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView && containerRef.current) {
      animateHeatmap(containerRef.current)
    }
  }, [inView])

  const cellColor = (count) =>
    count === 0 ? 'rgba(44,26,14,0.06)' :
    count === 1 ? 'rgba(184,134,11,0.25)' :
    count === 2 ? 'rgba(184,134,11,0.55)' : '#B8860B'

  return (
    <div ref={ref}>
      <div ref={containerRef} className="flex gap-1">
        {buildWeekGrid(sessions).map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                className="heatmap-cell w-3 h-3 rounded-sm scale-0 opacity-0
                           hover:ring-1 hover:ring-brass/50 cursor-pointer
                           transition-[box-shadow] duration-150"
                style={{ backgroundColor: cellColor(day.count) }}
                title={`${day.date}: ${day.count} session(s)`}
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

## ⌨️ ANIMATION 07 — COMMAND PALETTE
### Spotlight drops in with spring

```js
// src/animations/uiAnimations.js (continued)

export function openPalette(el) {
  anime.set(el, { display: 'block' })
  anime({
    targets: el,
    scale: [0.95, 1],
    opacity: [0, 1],
    translateY: [-12, 0],
    duration: 300,
    easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
  })
}

export function closePalette(el, onComplete) {
  anime({
    targets: el,
    scale: [1, 0.95],
    opacity: [1, 0],
    translateY: [0, -8],
    duration: 200,
    easing: 'easeInQuad',
    complete: () => {
      anime.set(el, { display: 'none' })
      onComplete?.()
    },
  })
}

export function animatePaletteResults(containerEl) {
  anime({
    targets: containerEl.querySelectorAll('.palette-item'),
    translateX: [-8, 0],
    opacity: [0, 1],
    duration: 200,
    delay: anime.stagger(25),
    easing: 'easeOutQuad',
  })
}
```

---

## 🍞 ANIMATION 08 — TOAST NOTIFICATIONS
### Slides up from bottom, progress bar drains

```js
// src/animations/uiAnimations.js (continued)

export function showToast(toastEl, progressEl, duration = 4500) {
  // Enter
  anime({
    targets: toastEl,
    translateY: [24, 0],
    opacity: [0, 1],
    duration: 350,
    easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
  })

  // Progress drain
  anime({
    targets: progressEl,
    width: ['100%', '0%'],
    duration: duration,
    easing: 'linear',
  })

  // Auto dismiss
  return setTimeout(() => dismissToast(toastEl), duration)
}

export function dismissToast(toastEl) {
  anime({
    targets: toastEl,
    translateY: [0, 16],
    opacity: [1, 0],
    duration: 250,
    easing: 'easeInQuad',
    complete: () => toastEl.remove(),
  })
}
```

---

## 🔄 ANIMATION 09 — PAGE TRANSITIONS
### Victorian curtain wipe between pages

```js
// src/animations/pageTransitions.js
import anime from '../lib/anime'

// A thin brass line sweeps across screen between page changes
export function pageExit(onComplete) {
  const wipe = document.createElement('div')
  wipe.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: linear-gradient(to right, #2C1A0E 0%, #B8860B 50%, #2C1A0E 100%);
    transform: translateX(-100%);
    pointer-events: none;
  `
  document.body.appendChild(wipe)

  anime({
    targets: wipe,
    translateX: ['-100%', '0%'],
    duration: 350,
    easing: 'easeInQuart',
    complete: () => {
      onComplete?.()
      anime({
        targets: wipe,
        translateX: ['0%', '100%'],
        duration: 350,
        easing: 'easeOutQuart',
        complete: () => wipe.remove(),
      })
    }
  })
}

// Stagger content in on page enter
export function pageEnter(containerEl) {
  const sections = containerEl.querySelectorAll('.page-section')
  anime({
    targets: sections,
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 500,
    delay: anime.stagger(80),
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  })
}
```

---

## 🌙 ANIMATION 10 — DARK MODE TOGGLE
### Wax seal spins, theme morphs

```js
// src/animations/uiAnimations.js (continued)

export function animateDarkToggle(iconEl, isDark) {
  // Spin icon
  anime({
    targets: iconEl,
    rotate: isDark ? [0, 180] : [180, 360],
    scale: [0.6, 1],
    duration: 400,
    easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
  })
}
```

---

## ✨ ANIMATION 11 — COMPILE & SAVE CEREMONY
### Three-state button: idle → loading → success

```js
// src/animations/uiAnimations.js (continued)

export function compileLoading(btnEl, textEl, spinnerEl) {
  // Shrink text, show spinner
  anime.timeline()
    .add({
      targets: textEl,
      opacity: [1, 0],
      translateY: [0, -8],
      duration: 200,
      easing: 'easeInQuad',
    })
    .add({
      targets: spinnerEl,
      opacity: [0, 1],
      rotate: { value: '+=360', duration: 800, loop: true, easing: 'linear' },
      duration: 200,
    })
}

export function compileSuccess(btnEl, textEl, spinnerEl, dotEl) {
  anime.timeline()
    // Stop spinner
    .add({
      targets: spinnerEl,
      opacity: [1, 0],
      duration: 150,
    })
    // Button turns green
    .add({
      targets: btnEl,
      backgroundColor: '#2D4A3E',
      duration: 300,
      easing: 'easeOutQuad',
    })
    // Success text bounces in
    .add({
      targets: textEl,
      opacity: [0, 1],
      translateY: [10, 0],
      scale: [0.8, 1],
      duration: 400,
      easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
    }, '-=100')
    // Dot pulses gold
    .add({
      targets: dotEl,
      backgroundColor: ['#B8860B', '#D4A017', '#B8860B'],
      scale: [1, 1.4, 1],
      duration: 600,
      loop: 3,
    }, '-=200')
}

// Particle burst — pure anime.js, no canvas
export function compileBurst(originEl) {
  const origin = originEl.getBoundingClientRect()
  const cx = origin.left + origin.width / 2
  const cy = origin.top + origin.height / 2

  // Spawn 20 particles
  Array.from({ length: 20 }).forEach((_, i) => {
    const p = document.createElement('div')
    const angle = (i / 20) * 360
    const dist = 60 + Math.random() * 40
    const size = 4 + Math.random() * 4
    const colors = ['#B8860B', '#D4A017', '#F2EBD9', '#8B6508']

    p.style.cssText = `
      position: fixed;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: ${colors[i % colors.length]};
      left: ${cx}px; top: ${cy}px;
      pointer-events: none;
      z-index: 9999;
    `
    document.body.appendChild(p)

    const rad = (angle * Math.PI) / 180
    anime({
      targets: p,
      translateX: Math.cos(rad) * dist,
      translateY: Math.sin(rad) * dist,
      opacity: [1, 0],
      scale: [1, 0],
      duration: 600 + Math.random() * 200,
      easing: 'easeOutExpo',
      complete: () => p.remove(),
    })
  })
}
```

---

## 📜 ANIMATION 12 — MEMBER PROFILE PANEL
### Slides in from right, Victorian reveal

```js
// src/animations/uiAnimations.js (continued)

export function openMemberPanel(panelEl, backdropEl) {
  anime.set(panelEl, { display: 'block' })
  anime.set(backdropEl, { display: 'block' })

  anime.timeline()
    .add({
      targets: backdropEl,
      opacity: [0, 1],
      duration: 200,
      easing: 'easeOutQuad',
    })
    .add({
      targets: panelEl,
      translateX: ['100%', '0%'],
      duration: 400,
      easing: 'cubicBezier(0.16, 1, 0.3, 1)',
    }, '-=150')
    // Stagger panel content in
    .add({
      targets: panelEl.querySelectorAll('.panel-section'),
      translateY: [12, 0],
      opacity: [0, 1],
      duration: 350,
      delay: anime.stagger(60),
      easing: 'easeOutQuad',
    }, '-=200')
}

export function closeMemberPanel(panelEl, backdropEl, onComplete) {
  anime.timeline()
    .add({
      targets: panelEl,
      translateX: ['0%', '100%'],
      duration: 300,
      easing: 'easeInQuart',
    })
    .add({
      targets: backdropEl,
      opacity: [1, 0],
      duration: 200,
      easing: 'easeInQuad',
      complete: () => {
        anime.set([panelEl, backdropEl], { display: 'none' })
        onComplete?.()
      }
    }, '-=100')
}
```

---

## 🔢 ANIMATION 13 — ATTENDANCE COUNTER POP
### Number pops when marked present/absent

```js
// src/animations/uiAnimations.js (continued)

export function popCount(el) {
  anime.timeline()
    .add({
      targets: el,
      scale: [1, 1.35],
      color: ['#2C1A0E', '#B8860B'],
      duration: 150,
      easing: 'easeOutBack',
    })
    .add({
      targets: el,
      scale: [1.35, 1],
      color: ['#B8860B', '#2C1A0E'],
      duration: 200,
      easing: 'easeOutQuad',
    })
}

// Attendance donut ring fill — SVG stroke animation
export function animateDonut(circleEl, percentage) {
  const r = parseFloat(circleEl.getAttribute('r') || 40)
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - percentage / 100)

  anime.set(circleEl, {
    strokeDasharray: circ,
    strokeDashoffset: circ,
  })

  anime({
    targets: circleEl,
    strokeDashoffset: [circ, offset],
    duration: 900,
    easing: 'easeOutQuart',
    delay: 200,
  })
}
```

---

## 📋 ANIMATION 14 — TIMELINE ARCHIVE VIEW
### Line draws, dots appear, cards slide in

```js
// src/animations/timelineAnimations.js
import anime from '../lib/anime'

export function animateTimeline(containerEl) {
  const line = containerEl.querySelector('.timeline-line')
  const dots = containerEl.querySelectorAll('.timeline-dot')
  const cards = containerEl.querySelectorAll('.timeline-card')

  if (!line) return

  // 1. Draw the vertical line top to bottom
  const lineHeight = line.getBoundingClientRect().height
  anime({
    targets: line,
    height: [0, lineHeight],
    duration: 1000,
    easing: 'easeOutQuart',
  })

  // 2. Dots materialise along the line
  anime({
    targets: dots,
    scale: [0, 1],
    opacity: [0, 1],
    duration: 350,
    delay: anime.stagger(120, { start: 200 }),
    easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
  })

  // 3. Cards slide in from right
  anime({
    targets: cards,
    translateX: [30, 0],
    opacity: [0, 1],
    duration: 500,
    delay: anime.stagger(100, { start: 300 }),
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  })
}
```

---

## ⭐ ANIMATION 15 — STAR RATING
### Stars fill one by one on hover

```js
// src/animations/uiAnimations.js (continued)

export function animateStarFill(stars, count) {
  // Reset all
  anime({ targets: stars, color: '#C8B89A', duration: 100 })

  // Fill up to count
  anime({
    targets: Array.from(stars).slice(0, count),
    color: '#B8860B',
    scale: [1, 1.25, 1],
    duration: 250,
    delay: anime.stagger(50),
    easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
  })
}
```

---

## 🎛️ COMPLETE ANIME.JS USAGE MAP

```
Page load
  └── runHeroTimeline()           → masthead rules, headline reveal, typewriter, CTAs

Dashboard mount
  └── animateStatCards()          → cards stagger in, numbers count up 00→XX

Archive grid
  └── observeSessionCards()       → scroll-triggered card entrance
  └── animateSessionCards()       → immediate entrance if no scroll needed

Session card click
  └── flipCard()                  → 3D front/back flip

Timeline view
  └── animateTimeline()           → line draw, dots pop, cards slide

Heatmap in view
  └── animateHeatmap()            → cells materialise left-to-right

Trend line in view
  └── drawTrendLine()             → quill-style path draw

Attendance mark
  └── popCount()                  → number pops gold
  └── animateDonut()              → SVG ring fills

Attendance bar in view
  └── animateAttendanceBar()      → bar fills on scroll

Compile & Save
  └── compileLoading()            → spinner
  └── compileSuccess()            → green, text bounce
  └── compileBurst()              → 20 brass particles

Member row click
  └── openMemberPanel()           → slide from right + content stagger
  └── closeMemberPanel()          → slide out

Command palette ⌘K
  └── openPalette()               → spring drop
  └── closePalette()              → shrink out
  └── animatePaletteResults()     → items stagger on query change

Toast
  └── showToast()                 → slide up, progress drain
  └── dismissToast()              → slide down

Page navigation
  └── pageExit()                  → brass wipe across screen
  └── pageEnter()                 → sections stagger in

Dark mode toggle
  └── animateDarkToggle()         → icon spin

Star rating hover
  └── animateStarFill()           → stars fill one by one
```

---

## ⚡ PERFORMANCE RULES FOR ANIME.JS

```js
// 1. Always animate transform and opacity — never width/height/top/left
//    EXCEPTION: width on progress bars is acceptable (short duration)

// 2. Use will-change on elements that animate frequently
el.style.willChange = 'transform, opacity'
// Remove after animation
anim.complete = () => { el.style.willChange = 'auto' }

// 3. Pause animations when tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) anime.running.forEach(a => a.pause())
  else anime.running.forEach(a => a.play())
})

// 4. Clean up on unmount
useEffect(() => {
  const anim = anime({ ... })
  return () => anim.pause()
}, [])

// 5. Use anime.stagger() not manual delays
// ✓ delay: anime.stagger(80)
// ✗ delay: (i) => i * 80   // works but stagger is optimised

// 6. Avoid animating more than 60 elements at once
// If needed, batch in groups of 20 with offset start

// 7. SVG path animations: always set strokeDasharray BEFORE animating dashoffset

// 8. For looping animations (spinner), always pause on component unmount
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Setup
- [ ] `npm install animejs` done
- [ ] `npm remove framer-motion` done
- [ ] Single import via `src/lib/anime.js`
- [ ] All animation files in `src/animations/`

### Animations wired
- [ ] Hero timeline (A01)
- [ ] Stat card counters (A02)
- [ ] Session cards grid (A03)
- [ ] Card 3D flip (A04)
- [ ] SVG trend line draw (A05)
- [ ] Heatmap materialise (A06)
- [ ] Command palette spring (A07)
- [ ] Toast slide + drain (A08)
- [ ] Page wipe transition (A09)
- [ ] Dark mode icon spin (A10)
- [ ] Compile ceremony + burst (A11)
- [ ] Member panel slide (A12)
- [ ] Attendance counter pop (A13)
- [ ] Timeline draw (A14)
- [ ] Star rating fill (A15)

### Performance verified
- [ ] Only `transform` + `opacity` animated (except progress bars)
- [ ] `will-change` set before, removed after
- [ ] Tab visibility handler pauses all animations
- [ ] All anime instances paused on component unmount
- [ ] No animation targets more than 60 elements at once
- [ ] SVG strokeDasharray set before dashoffset animation

---

*Anime.js Animation System for: BEC Dev Club Session Tracker*
*17KB vs 180KB. 10x smaller. More control. More artistry.*
*Victorian Gaslight aesthetic, buttery 60fps performance.*
