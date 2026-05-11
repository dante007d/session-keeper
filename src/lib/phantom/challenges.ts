/**
 * PHANTOM CHALLENGE SYSTEM v2.0
 * Advanced perceptual tasks and biometric analysis.
 */

export interface Challenge {
  id: string;
  label: string;
  type: 'semantic_tap' | 'sequence_memory' | 'trajectory_trace';
  data: any;
  windowMs: number;
}

export const PERCEPTUAL_CHALLENGES = {
  SEMANTIC_TAP: {
    id: 'semantic_tap',
    label: 'Semantic Matching',
    generate: () => {
      const categories = [
        {
          question: 'Tap all objects that could float on water',
          objects: [
            { name: 'Boat', emoji: '⛵', floats: true },
            { name: 'Rock', emoji: '🪨', floats: false },
            { name: 'Feather', emoji: '🪶', floats: true },
            { name: 'Anchor', emoji: '⚓', floats: false },
            { name: 'Leaf', emoji: '🍃', floats: true },
            { name: 'Coin', emoji: '🪙', floats: false },
          ],
          correctKey: 'floats',
        },
        {
          question: 'Tap all living things',
          objects: [
            { name: 'Tree', emoji: '🌳', living: true },
            { name: 'Chair', emoji: '🪑', living: false },
            { name: 'Cat', emoji: '🐈', living: true },
            { name: 'Lamp', emoji: '💡', living: false },
            { name: 'Mushroom', emoji: '🍄', living: true },
            { name: 'Phone', emoji: '📱', living: false },
          ],
          correctKey: 'living',
        }
      ];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      return {
        question: cat.question,
        objects: [...cat.objects].sort(() => Math.random() - 0.5),
        correctKey: cat.correctKey,
        windowMs: 15000,
      };
    }
  },

  SEQUENCE_MEMORY: {
    id: 'sequence_memory',
    label: 'Spatial Sequence',
    generate: () => {
      const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const sequence = [];
      const available = [...cells];
      for (let i = 0; i < 4; i++) {
        const idx = Math.floor(Math.random() * available.length);
        sequence.push(available.splice(idx, 1)[0]);
      }
      return {
        gridSize: 3,
        sequence,
        displayMs: 800,
        intervalMs: 400,
        windowMs: 15000,
      };
    }
  },

  TRAJECTORY_TRACE: {
    id: 'trajectory_trace',
    label: 'Trajectory Tracing',
    generate: () => {
      return {
        path: {
          startX: Math.floor(Math.random() * 60 + 20),
          startY: Math.floor(Math.random() * 20 + 10),
          endX: Math.floor(Math.random() * 60 + 20),
          endY: Math.floor(Math.random() * 20 + 60),
          cp1X: Math.floor(Math.random() * 100),
          cp1Y: Math.floor(Math.random() * 100),
          cp2X: Math.floor(Math.random() * 100),
          cp2Y: Math.floor(Math.random() * 100),
        },
        tolerancePx: 30,
        windowMs: 12000,
      };
    }
  }
};

// --- Pointer Biometrics ---

export class PointerBiometricCollector {
  private events: any[] = [];
  private listening = false;

  startCapture() {
    this.events = [];
    this.listening = true;
    window.addEventListener('pointermove', this.handleMove, { passive: true });
    window.addEventListener('pointerdown', this.handleDown, { passive: true });
  }

  stopCapture() {
    window.removeEventListener('pointermove', this.handleMove);
    window.removeEventListener('pointerdown', this.handleDown);
    this.listening = false;
    return this.analyze();
  }

  private handleMove = (e: PointerEvent) => {
    if (!this.listening) return;
    this.events.push({ x: e.clientX, y: e.clientY, ts: performance.now(), pressure: e.pressure });
  };

  private handleDown = (e: PointerEvent) => {
    if (!this.listening) return;
    this.events.push({ type: 'down', x: e.clientX, y: e.clientY, ts: performance.now() });
  };

  analyze() {
    if (this.events.length < 5) return { valid: false, score: 0 };

    const velocities = [];
    for (let i = 1; i < this.events.length; i++) {
      const e1 = this.events[i - 1];
      const e2 = this.events[i];
      if (e1.type || e2.type) continue;
      
      const dx = e2.x - e1.x;
      const dy = e2.y - e1.y;
      const dt = e2.ts - e1.ts;
      if (dt > 0) velocities.push(Math.sqrt(dx * dx + dy * dy) / dt);
    }

    if (velocities.length === 0) return { valid: false, score: 0 };

    const mean = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    const variance = velocities.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / velocities.length;

    // Human signature: Humans have micro-jitter (variance > 0.02)
    // Bots often have perfectly linear movement (variance ~ 0)
    const isHuman = variance > 0.02 && variance < 100; // 100 is likely too much (erratic)
    
    return {
      valid: isHuman,
      score: isHuman ? 100 : 0,
      variance,
      count: this.events.length
    };
  }
}

export const pointerBiometrics = new PointerBiometricCollector();
