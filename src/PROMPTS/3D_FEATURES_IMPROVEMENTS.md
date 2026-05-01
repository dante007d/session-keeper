# 🌐 3D FEATURES + NEW IMPROVEMENTS
## BEC Dev Club Session Tracker — Dimension Expansion
### Stack: React + Tailwind + Framer Motion + Three.js / React Three Fiber
### Goal: The only club tracker on earth with actual 3D. Win by dimension.

> Paste this into Cursor / Bolt.new / Lovable as a continuation prompt.
> Say: "Add everything in this file to the existing app. Do not remove prior features."

---

## 📦 NEW DEPENDENCIES

```bash
npm install @react-three/fiber @react-three/drei three
npm install @react-spring/three
npm install react-spring
```

---

## 🧠 THE 3D PHILOSOPHY

**Rule 1:** 3D is atmosphere, not gimmick.
Every 3D element must serve the UX — not just impress.
If removing it hurts the experience, it belongs. If not, cut it.

**Rule 2:** Performance first.
All 3D runs in isolated `<Canvas>` containers.
Never block the main thread. Use `Suspense` + `lazy` everywhere.

**Rule 3:** Seamless integration.
3D elements blend with the 2D UI — they don't feel like a demo.
Shared color tokens. Same typography. Same spacing grid.

**The three places 3D lives in this app:**
1. **Dashboard Hero** — floating 3D orbs / particles behind the headline
2. **Archive** — session cards that flip in 3D on click
3. **Analytics** — 3D bar chart rising from the floor

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3D FEATURE 01 — PARTICLE FIELD
# Dashboard hero background
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Floating particles drift behind the hero headline.
They react to mouse movement — magnetic repulsion when cursor is near.
Warm amber tone. Subtle. Like dust in a sunlit room.

```jsx
// components/ParticleField.jsx
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Particles({ count = 120 }) {
  const mesh = useRef()
  const mouse = useRef([0, 0])
  const { size } = useThree()

  // Build initial positions — scattered across hero area
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14   // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6    // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4    // z
      vel[i * 3]     = (Math.random() - 0.5) * 0.003
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003
      vel[i * 3 + 2] = 0
    }
    return [pos, vel]
  }, [count])

  // Track mouse in 3D space
  useThree(({ gl }) => {
    gl.domElement.addEventListener('mousemove', (e) => {
      mouse.current = [
        (e.clientX / size.width  - 0.5) * 14,
        -(e.clientY / size.height - 0.5) * 6,
      ]
    })
  })

  useFrame(() => {
    const pos = mesh.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      // Drift
      pos[i*3]     += velocities[i*3]
      pos[i*3 + 1] += velocities[i*3 + 1]

      // Boundary bounce
      if (Math.abs(pos[i*3])     > 7)  velocities[i*3]     *= -1
      if (Math.abs(pos[i*3 + 1]) > 3)  velocities[i*3 + 1] *= -1

      // Mouse repulsion — particles shy away from cursor
      const dx = pos[i*3]     - mouse.current[0]
      const dy = pos[i*3 + 1] - mouse.current[1]
      const dist = Math.sqrt(dx*dx + dy*dy)
      if (dist < 2.0) {
        const force = (2.0 - dist) / 2.0 * 0.008
        pos[i*3]     += (dx / dist) * force
        pos[i*3 + 1] += (dy / dist) * force
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#E8A020"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  )
}

export function ParticleField() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0"
         style={{ height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Particles count={120} />
      </Canvas>
    </div>
  )
}
```

**Usage in Dashboard hero section:**
```jsx
// Wrap hero in relative container
<section className="relative overflow-hidden min-h-[340px]">
  <ParticleField />
  <div className="relative z-10">
    {/* headline, stat cards, CTAs */}
  </div>
</section>
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3D FEATURE 02 — SESSION CARD FLIP
# Archive — click to reveal back face
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session cards in the archive FLIP in 3D when clicked.
Front: preview (title, date, attendance bar).
Back: full details (summary, host, volunteers, export button).

This is physically satisfying and surprising.
No other club tracker on earth will have this.

```jsx
// components/FlipCard.jsx
import { motion } from 'framer-motion'

function FlipCard({ session }) {
  const [flipped, setFlipped] = React.useState(false)

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: '1200px', height: '200px' }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
          type: 'tween'
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >

        {/* FRONT FACE */}
        <div
          className="absolute inset-0 bg-card rounded-2xl p-5 border border-border
                     shadow-card backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Tag chip */}
          {session.tag && <TagChip tag={session.tag} />}

          {/* Date */}
          <p className="font-ui text-[10px] uppercase tracking-widest text-ink-muted mt-2">
            {formatDate(session.date, 'MMM DD, YYYY')}
          </p>

          {/* Title */}
          <h3 className="font-ui font-bold text-lg text-ink mt-1 line-clamp-2">
            {session.title}
          </h3>

          {/* Host */}
          <p className="font-ui text-xs text-ink-secondary mt-1">
            Hosted by {session.host}
          </p>

          {/* Attendance bar */}
          <AttendanceBar present={session.presentCount} total={session.totalCount} />

          {/* Flip hint */}
          <p className="absolute bottom-4 right-5 font-ui text-[9px]
                       uppercase tracking-widest text-ink-muted/60">
            Tap for details →
          </p>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 bg-ink rounded-2xl p-5
                     shadow-card backface-hidden overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Amber accent bar top */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold rounded-t-2xl" />

          <p className="font-ui text-[10px] uppercase tracking-widest text-cream-2 mb-1">
            Session Details
          </p>
          <h3 className="font-ui font-bold text-base text-cream line-clamp-1 mb-3">
            {session.title}
          </h3>

          {/* Summary */}
          <p className="font-ui text-xs text-cream-2 line-clamp-3 mb-3 leading-relaxed">
            {session.summary || 'No summary recorded.'}
          </p>

          {/* Stats row */}
          <div className="flex gap-4 mb-4">
            <div>
              <p className="font-mono font-bold text-lg text-gold">{session.presentCount}</p>
              <p className="font-ui text-[9px] text-cream-2 uppercase tracking-wider">Present</p>
            </div>
            <div>
              <p className="font-mono font-bold text-lg text-red-400">{session.absentCount}</p>
              <p className="font-ui text-[9px] text-cream-2 uppercase tracking-wider">Absent</p>
            </div>
            <div>
              <p className="font-mono font-bold text-lg text-cream">{session.totalCount}</p>
              <p className="font-ui text-[9px] text-cream-2 uppercase tracking-wider">Total</p>
            </div>
          </div>

          {/* Export button */}
          <button
            onClick={(e) => { e.stopPropagation(); exportSessionPDF(session) }}
            className="absolute bottom-4 right-5
                       font-ui text-[10px] font-bold uppercase tracking-wider
                       text-gold hover:text-gold-bright transition-colors"
          >
            Export PDF ↗
          </button>
        </div>
      </motion.div>
    </div>
  )
}
```

Add CSS globally:
```css
.backface-hidden { -webkit-backface-visibility: hidden; backface-visibility: hidden; }
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3D FEATURE 03 — RISING BAR CHART
# Analytics page — Three.js bar chart
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A genuine 3D bar chart where bars rise from the floor on page load.
Each bar is a rounded Box geometry. Camera orbits slowly.
Bars are colored by attendance rate: green → amber → red.
Hovering a bar shows a floating label above it.

```jsx
// components/Chart3D.jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, RoundedBox, OrbitControls } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { useState, useRef } from 'react'

// Single bar
function Bar3D({ x, height, color, label, value, index }) {
  const [hovered, setHovered] = useState(false)
  const maxH = 3

  // Spring animation — rises from 0 to target height on mount
  const { scale } = useSpring({
    scale: height,
    from: { scale: 0 },
    delay: index * 120,
    config: { tension: 180, friction: 18 }
  })

  return (
    <group position={[x, 0, 0]}>
      {/* Bar — rises from floor */}
      <animated.mesh
        position-y={scale.to(s => s / 2)}
        scale-y={scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[0.6, 1, 0.6]} />
        <meshStandardMaterial
          color={hovered ? '#E8A020' : color}
          roughness={0.3}
          metalness={0.1}
        />
      </animated.mesh>

      {/* Floor label */}
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.18}
        color="#A09890"
        anchorX="center"
        anchorY="top"
        font="/fonts/JetBrainsMono-Regular.ttf"
      >
        {label}
      </Text>

      {/* Hover value label — floats above bar */}
      {hovered && (
        <Text
          position={[0, height + 0.3, 0]}
          fontSize={0.22}
          color="#E8A020"
          anchorX="center"
          anchorY="bottom"
          font="/fonts/JetBrainsMono-Bold.ttf"
        >
          {value}%
        </Text>
      )}
    </group>
  )
}

// Camera auto-orbit (slow, gentle)
function AutoOrbit() {
  const { camera } = useThree()
  const angle = useRef(0)

  useFrame((_, delta) => {
    angle.current += delta * 0.08   // very slow rotation
    camera.position.x = Math.sin(angle.current) * 10
    camera.position.z = Math.cos(angle.current) * 10
    camera.lookAt(0, 1.5, 0)
  })
  return null
}

// Floor grid
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#FAF7F2" opacity={0.6} transparent />
    </mesh>
  )
}

export function AttendanceChart3D({ sessions }) {
  // Build last 6 sessions data
  const data = sessions.slice(-6).map(s => ({
    label: formatDate(s.date, 'MMM DD'),
    value: s.totalCount > 0 ? Math.round(s.presentCount / s.totalCount * 100) : 0,
    color: (s.presentCount / s.totalCount) >= 0.8 ? '#2D9E6B'
         : (s.presentCount / s.totalCount) >= 0.5 ? '#E8A020'
         : '#D95B5B'
  }))

  const maxVal = Math.max(...data.map(d => d.value), 1)

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden bg-base border border-border">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, 6, -4]} intensity={0.3} color="#E8A020" />

        <Floor />

        {data.map((d, i) => (
          <Bar3D
            key={i}
            x={(i - (data.length - 1) / 2) * 1.2}
            height={(d.value / maxVal) * 3}
            color={d.color}
            label={d.label}
            value={d.value}
            index={i}
          />
        ))}

        <AutoOrbit />
      </Canvas>
    </div>
  )
}
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3D FEATURE 04 — FLOATING ORBS
# Decorative — dashboard background
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Three translucent spheres float behind the stat cards.
They drift slowly, cast soft light on each other.
Inspired by Apple Vision Pro spatial UI.

```jsx
// components/FloatingOrbs.jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { useRef } from 'react'

function Orb({ position, size, speed, phase }) {
  const mesh = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    mesh.current.position.y = position[1] + Math.sin(t * speed + phase) * 0.3
    mesh.current.position.x = position[0] + Math.cos(t * speed * 0.7 + phase) * 0.2
    mesh.current.rotation.x = t * 0.1
    mesh.current.rotation.z = t * 0.08
  })

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[size, 64, 64]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={0.5}
        roughness={0.05}
        transmission={0.95}
        ior={1.4}
        chromaticAberration={0.04}
        anisotropy={0.2}
        color="#E8A020"
        opacity={0.15}
        transparent
      />
    </mesh>
  )
}

export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0"
         style={{ height: 320 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={0.8} color="#E8A020" />
        <pointLight position={[-4, -2, 2]} intensity={0.4} color="#ffffff" />

        <Orb position={[-3, 0.5, -1]} size={1.2} speed={0.3} phase={0} />
        <Orb position={[3, -0.3, -0.5]} size={0.8} speed={0.4} phase={2} />
        <Orb position={[0, 0.8, -2]} size={1.6} speed={0.2} phase={4} />
      </Canvas>
    </div>
  )
}
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3D FEATURE 05 — ATTENDANCE GLOBE
# Analytics — member attendance sphere
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A wireframe sphere where each member is a glowing point on its surface.
Points pulse when the member has high attendance.
The globe rotates slowly. Hovering a point shows the member name.
This is the most conceptually powerful visual in the entire app.

```jsx
// components/AttendanceGlobe.jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function MemberPoint({ position, member, attendanceRate }) {
  const [hovered, setHovered] = useState(false)
  const mesh = useRef()
  const pulse = useRef(Math.random() * Math.PI * 2)

  const color = attendanceRate >= 0.8 ? '#2D9E6B'
              : attendanceRate >= 0.5 ? '#E8A020'
              : '#D95B5B'

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const scale = 1 + Math.sin(t * 2 + pulse.current) * 0.3 * attendanceRate
    mesh.current.scale.setScalar(scale)
  })

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 0.8}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {hovered && (
        <Html center distanceFactor={8}>
          <div className="bg-ink/90 text-cream rounded-lg px-3 py-2 text-xs
                         font-ui font-semibold whitespace-nowrap pointer-events-none
                         shadow-lg backdrop-blur-sm">
            {member.name}
            <span className="ml-2 font-mono text-gold">
              {Math.round(attendanceRate * 100)}%
            </span>
          </div>
        </Html>
      )}
    </group>
  )
}

// Spread members evenly on sphere surface using Fibonacci lattice
function fibonacciSphere(count, radius) {
  const points = []
  const phi = Math.PI * (3 - Math.sqrt(5))  // golden angle
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = phi * i
    points.push(new THREE.Vector3(
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius
    ))
  }
  return points
}

function GlobeScene({ members, sessions }) {
  const globeRef = useRef()
  const radius = 2.2

  // Member attendance rates
  const memberRates = useMemo(() =>
    members.map(m => ({
      ...m,
      rate: sessions.length > 0
        ? sessions.filter(s =>
            s.attendance.find(a => a.memberId === m.id && a.status === 'present')
          ).length / sessions.length
        : 0
    }))
  , [members, sessions])

  // Fibonacci positions on sphere
  const positions = useMemo(
    () => fibonacciSphere(members.length, radius),
    [members.length]
  )

  // Auto-rotate globe
  useFrame((_, delta) => {
    globeRef.current.rotation.y += delta * 0.15
  })

  return (
    <group ref={globeRef}>
      {/* Wireframe sphere */}
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color="#E8A020"
          wireframe
          opacity={0.08}
          transparent
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[radius * 0.98, 32, 32]} />
        <meshStandardMaterial
          color="#FAF7F2"
          opacity={0.03}
          transparent
          side={THREE.BackSide}
        />
      </mesh>

      {/* Member points */}
      {memberRates.map((member, i) => (
        <MemberPoint
          key={member.id}
          position={positions[i]}
          member={member}
          attendanceRate={member.rate}
        />
      ))}
    </group>
  )
}

export function AttendanceGlobe({ members, sessions }) {
  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-base border border-border">
      {/* Label */}
      <div className="absolute top-4 left-5 z-10">
        <SectionLabel text="MEMBER SPHERE" />
        <p className="font-ui text-xs text-ink-secondary mt-0.5">
          Each point is a member — pulsing by attendance
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-5 z-10 flex gap-3">
        {[
          { color: '#2D9E6B', label: 'High (80%+)' },
          { color: '#E8A020', label: 'Mid (50–79%)' },
          { color: '#D95B5B', label: 'Low (<50%)' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-ui text-[9px] text-ink-muted uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>

      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#E8A020" />
        <pointLight position={[-5, -3, -5]} intensity={0.4} color="#ffffff" />

        <Suspense fallback={null}>
          <GlobeScene members={members} sessions={sessions} />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3D FEATURE 06 — MORPHING LOGO
# Nav — the B logo animates in 3D
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The "B" avatar in the nav is not a flat circle.
It's a small 3D rendered icosahedron that slowly rotates.
On hover it spins fast. Tiny, premium, impossible to miss.

```jsx
// components/Logo3D.jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { useRef, useState } from 'react'

function LogoMesh({ hovered }) {
  const mesh = useRef()

  useFrame((_, delta) => {
    mesh.current.rotation.x += delta * (hovered ? 1.5 : 0.3)
    mesh.current.rotation.y += delta * (hovered ? 2.0 : 0.4)
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[0.7, 1]} />
      <MeshDistortMaterial
        color="#E8A020"
        distort={0.15}
        speed={2}
        roughness={0.1}
        metalness={0.4}
      />
    </mesh>
  )
}

export function Logo3D() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="w-9 h-9 rounded-full overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-2, -1, 1]} intensity={0.4} color="#E8A020" />
        <LogoMesh hovered={hovered} />
      </Canvas>
    </div>
  )
}
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# NEW IMPROVEMENT 01
# COMMAND PALETTE (⌘K)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Press ⌘K (Ctrl+K on Windows) to open a Spotlight-style
command palette. Type to navigate the app, create sessions,
find members, jump to analytics. Like Linear or Vercel's UI.

This alone will make judges think: "Who built this?"

```jsx
// components/CommandPalette.jsx
function CommandPalette({ sessions, members, onNavigate }) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const inputRef = React.useRef(null)

  // Keyboard shortcut
  React.useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
        setQuery('')
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  // Build commands
  const commands = [
    { id: 'new-session',  label: 'Create new session', icon: '+',  action: () => onNavigate('create'),    group: 'Actions'  },
    { id: 'dashboard',    label: 'Go to Dashboard',    icon: '⊞',  action: () => onNavigate('dashboard'), group: 'Navigate' },
    { id: 'roster',       label: 'Go to Roster',       icon: '👥', action: () => onNavigate('roster'),    group: 'Navigate' },
    { id: 'analytics',    label: 'Go to Analytics',    icon: '📊', action: () => onNavigate('analytics'), group: 'Navigate' },
    { id: 'dark-mode',    label: 'Toggle Dark Mode',   icon: '☾',  action: toggleDarkMode,                group: 'Settings' },
    ...sessions.slice(0, 5).map(s => ({
      id: s.id,
      label: s.title,
      icon: '📋',
      action: () => onNavigate('session', s.id),
      group: 'Recent Sessions',
      sub: formatDate(s.date),
    })),
    ...members.slice(0, 5).map(m => ({
      id: m.id,
      label: m.name,
      icon: '👤',
      action: () => openMemberProfile(m),
      group: 'Members',
    })),
  ]

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands

  // Group by category
  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = []
    acc[cmd.group].push(cmd)
    return acc
  }, {})

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-[100]"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101]
                       w-full max-w-xl bg-card rounded-2xl
                       shadow-[0_24px_80px_rgba(0,0,0,0.20)]
                       border border-border overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <span className="text-ink-muted text-base">⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search commands, sessions, members..."
                className="flex-1 bg-transparent font-ui text-sm text-ink
                           placeholder:text-ink-muted focus:outline-none"
              />
              <kbd className="font-mono text-[10px] text-ink-muted bg-base
                             px-1.5 py-0.5 rounded border border-border">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {Object.entries(grouped).map(([group, cmds]) => (
                <div key={group}>
                  <p className="px-5 py-2 font-ui text-[9px] font-bold
                               uppercase tracking-widest text-ink-muted">
                    {group}
                  </p>
                  {cmds.map(cmd => (
                    <button
                      key={cmd.id}
                      onClick={() => { cmd.action(); setOpen(false) }}
                      className="w-full flex items-center gap-3 px-5 py-2.5
                                 hover:bg-gold-light group transition-colors duration-100"
                    >
                      <span className="w-7 h-7 rounded-lg bg-base
                                      flex items-center justify-center text-sm
                                      group-hover:bg-gold group-hover:text-white
                                      transition-all duration-150">
                        {cmd.icon}
                      </span>
                      <div className="flex-1 text-left">
                        <p className="font-ui text-sm text-ink group-hover:text-gold-dark">
                          {cmd.label}
                        </p>
                        {cmd.sub && (
                          <p className="font-ui text-[10px] text-ink-muted">{cmd.sub}</p>
                        )}
                      </div>
                      <kbd className="font-mono text-[9px] text-ink-muted opacity-0
                                    group-hover:opacity-100 transition-opacity">
                        ↵
                      </kbd>
                    </button>
                  ))}
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-12 text-center">
                  <p className="font-ui text-sm text-ink-muted">No results for "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

Add the shortcut hint to nav:
```jsx
<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-base border border-border
               text-ink-muted hover:border-gold hover:text-gold cursor-pointer
               transition-all duration-150"
     onClick={() => openCommandPalette()}>
  <span className="font-ui text-[10px]">Search</span>
  <kbd className="font-mono text-[9px] bg-border px-1 py-0.5 rounded">⌘K</kbd>
</div>
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# NEW IMPROVEMENT 02
# SESSION DETAIL EXPANDED VIEW
# Full-screen modal on card click
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After the 3D card flip shows the back, clicking "Full View"
opens a full-screen modal with the complete session record.

```jsx
// Shared layout animation — card expands to fill screen
// Uses Framer Motion layoutId for seamless expansion

<motion.div layoutId={`session-card-${session.id}`}>
  <SessionCard session={session} onClick={() => setExpanded(session)} />
</motion.div>

{/* Expanded modal */}
<AnimatePresence>
  {expanded && (
    <motion.div
      layoutId={`session-card-${expanded.id}`}
      className="fixed inset-4 md:inset-12 z-50 bg-card rounded-3xl
                 shadow-[0_40px_120px_rgba(0,0,0,0.20)]
                 overflow-hidden"
    >
      <SessionDetailView session={expanded} onClose={() => setExpanded(null)} />
    </motion.div>
  )}
</AnimatePresence>
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# NEW IMPROVEMENT 03
# LIVE SESSION MODE
# Real-time attendance marking
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A "Live Mode" button on the Create page activates a focused
attendance-only view — like a check-in screen.
Members appear as large cards. Tap = Present. Slide = Absent.
This is the feature that makes it genuinely useful on event day.

```jsx
function LiveSessionMode({ members, onMark }) {
  return (
    <div className="fixed inset-0 bg-base z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-ui font-bold text-sm text-ink uppercase tracking-wider">
            Live Check-in
          </span>
        </div>
        <div className="font-mono font-bold text-2xl text-ink">
          {present}<span className="text-ink-muted">/{total}</span>
        </div>
      </div>

      {/* Member grid — large tap targets */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {members.map(member => (
            <motion.button
              key={member.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleMember(member.id)}
              className={clsx(
                "p-6 rounded-2xl text-left transition-all duration-200 border-2",
                status[member.id] === 'present'
                  ? "bg-present/10 border-present"
                  : status[member.id] === 'absent'
                  ? "bg-absent/10 border-absent"
                  : "bg-card border-border hover:border-gold"
              )}
            >
              <MemberAvatar name={member.name} size="lg" />
              <p className="font-ui font-bold text-sm text-ink mt-3">{member.name}</p>
              <p className="font-ui text-xs mt-0.5" style={{
                color: status[member.id] === 'present' ? '#2D9E6B'
                     : status[member.id] === 'absent' ? '#D95B5B'
                     : '#A09890'
              }}>
                {status[member.id] === 'present' ? '✓ Present'
               : status[member.id] === 'absent' ? '✕ Absent'
               : '— Not marked'}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# NEW IMPROVEMENT 04
# TYPEWRITER SUBTITLE
# Hero subtitle animates letter by letter
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The subtitle under the headline types itself out.
Cursor blinks at the end. Triggers after headline reveal.

```jsx
function TypewriterText({ text, delay = 0 }) {
  const [displayed, setDisplayed] = React.useState('')
  const [showCursor, setShowCursor] = React.useState(true)

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i === text.length) {
          clearInterval(interval)
          // Stop cursor blink after 2s
          setTimeout(() => setShowCursor(false), 2000)
        }
      }, 28)  // ~28ms per character = feels natural
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span>
      {displayed}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-gold ml-0.5 align-middle"
        />
      )}
    </span>
  )
}

// Usage:
<p className="font-ui text-base text-ink-secondary mt-3">
  <TypewriterText
    text="A focused archive of your club's sessions. Local-first. Zero clutter."
    delay={900}  // starts after headline finishes
  />
</p>
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# NEW IMPROVEMENT 05
# SKELETON LOADING STATES
# Shows structure before data loads
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

While localStorage is being read or sessions are computing,
show skeleton cards — not spinners. Spinners feel broken.
Skeletons feel like content is about to arrive.

```jsx
function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border">
      {/* Tag skeleton */}
      <div className="w-16 h-4 rounded-full bg-base animate-pulse mb-3" />
      {/* Date */}
      <div className="w-24 h-3 rounded bg-base animate-pulse mb-2" />
      {/* Title */}
      <div className="w-3/4 h-5 rounded bg-base animate-pulse mb-1" />
      <div className="w-1/2 h-5 rounded bg-base animate-pulse mb-4" />
      {/* Host */}
      <div className="w-2/5 h-3 rounded bg-base animate-pulse mb-4" />
      {/* Bar */}
      <div className="w-full h-1.5 rounded-full bg-base animate-pulse" />
    </div>
  )
}

function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(count).fill(0).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  )
}

// Custom shimmer animation for skeleton
// In tailwind.config.js add:
// 'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
// Already in Tailwind defaults — just use animate-pulse class
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# NEW IMPROVEMENT 06
# KEYBOARD NAVIGATION
# Full app usable without mouse
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keyboard shortcuts panel (press ? to open):

```jsx
const SHORTCUTS = [
  { key: '⌘K',    action: 'Open command palette' },
  { key: '⌘N',    action: 'New session'           },
  { key: '⌘/',    action: 'Toggle dark mode'      },
  { key: '↑↓',    action: 'Navigate archive'       },
  { key: 'Enter', action: 'Open selected session'  },
  { key: 'Esc',   action: 'Close / go back'        },
  { key: '?',     action: 'Show keyboard shortcuts'},
]

// Shortcut help modal — minimal, clean
<motion.div className="fixed bottom-6 left-6 z-50 bg-ink text-cream rounded-2xl
                       p-5 shadow-lg w-64">
  <p className="font-ui text-xs font-bold uppercase tracking-widest text-cream-2 mb-3">
    Keyboard Shortcuts
  </p>
  <div className="space-y-2">
    {SHORTCUTS.map(({ key, action }) => (
      <div key={key} className="flex items-center justify-between">
        <span className="font-ui text-xs text-cream-2">{action}</span>
        <kbd className="font-mono text-[10px] bg-raised px-2 py-0.5 rounded
                       text-gold border border-border-mid">
          {key}
        </kbd>
      </div>
    ))}
  </div>
</motion.div>
```

---

## ✅ MASTER 3D + IMPROVEMENTS CHECKLIST

### 3D Features
- [ ] Particle field behind hero — mouse repulsion (3D01)
- [ ] Session card 3D flip — front/back faces (3D02)
- [ ] Rising 3D bar chart — analytics page (3D03)
- [ ] Floating translucent orbs — dashboard (3D04)
- [ ] Member attendance globe — analytics (3D05)
- [ ] 3D morphing logo in nav (3D06)

### New Improvements
- [ ] ⌘K Command palette with search (I01)
- [ ] Full-screen session expand via layoutId (I02)
- [ ] Live Session check-in mode (I03)
- [ ] Typewriter subtitle animation (I04)
- [ ] Skeleton loading states — no spinners (I05)
- [ ] Keyboard shortcuts panel (I06)

---

## ⚡ PERFORMANCE RULES FOR 3D

```
1. All Canvas elements use gl={{ alpha: true }} for transparent bg
2. Wrap all 3D in <Suspense fallback={<SkeletonCard />}>
3. Use dpr={[1, 2]} on Canvas — limits pixel ratio on high-DPI screens
4. Particle count: max 150 on desktop, 60 on mobile (detect via window.innerWidth)
5. Disable OrbitControls on mobile — touch interference
6. All Three.js objects dispose on unmount:
   useEffect(() => () => { geometry.dispose(); material.dispose() }, [])
7. frameloop="demand" on static 3D — only renders on interaction:
   <Canvas frameloop="demand"> (use for Logo3D, not ParticleField)
8. For the globe: use LOD (Level of Detail) — fewer sphere segments on mobile
```

---

## 🎯 THE FINAL JUDGE MOMENT

When the analytics page loads with the 3D bar chart rising from
the floor and the member globe rotating slowly in the corner —

There will be a pause.

That pause is the moment judges stop taking notes and just watch.

That pause is the win.

---

*3D + Improvements prompt for: BEC Dev Club Session Tracker*
*Stack: React Three Fiber + Drei + React Spring Three + Framer Motion*
*3D Philosophy: Atmosphere over gimmick · Performance first · Seamless integration*
