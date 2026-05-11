/**
 * PHANTOM TRUST ENGINE v2.0
 * Calculates trust scores using session-seeded weights and hidden thresholds.
 */

export const BASE_SIGNALS = {
  CRYPTO_JOIN:         { base: 20, label: '🔐 Crypto Handshake' },
  LAN_PROXIMITY:       { base: 25, label: '📡 LAN Proximity' },
  HARDWARE_FINGERPRINT:{ base: 15, label: '💻 Hardware Match' },
  PERCEPTUAL_CHALLENGE:{ base: 20, label: '🎯 Human Perception' },
  POINTER_BIOMETRICS:  { base: 10, label: '🖱️ Bio-Jitter' },
  ROLLING_CHALLENGE:   { base: 5,  label: '🕒 Re-Verification' },
  SUSTAINED_PRESENCE:  { base: 5,  label: '💓 Presence Pulse' },
};

export const PENALTIES = {
  TAB_SWITCH:          -8,
  PROXIMITY_FAIL:      -30,
  TIMING_ANOMALY:      -20,
  FINGERPRINT_MISMATCH:-25,
  HEARTBEAT_GAP:       -10,
  CHALLENGE_TIMEOUT:   -15,
};

export class TrustEngine {
  public threshold: number;
  private weights: Record<string, number>;

  constructor(sessionSeed: string) {
    this.threshold = this.deriveThreshold(sessionSeed);
    this.weights = this.deriveWeights(sessionSeed);
  }

  private deriveThreshold(seed: string): number {
    const n = this.pseudoRandom(seed, 'threshold');
    return Math.floor(65 + n * 15); // Random threshold between 65 and 80
  }

  private deriveWeights(seed: string): Record<string, number> {
    const weights: Record<string, number> = {};
    for (const [key, signal] of Object.entries(BASE_SIGNALS)) {
      const variance = this.pseudoRandom(seed, key) * 0.3 - 0.15; // +/- 15%
      weights[key] = Math.max(1, Math.round(signal.base * (1 + variance)));
    }
    return weights;
  }

  private pseudoRandom(seed: string, key: string): number {
    let hash = 0;
    const str = seed + key;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return (Math.abs(hash) % 1000) / 1000;
  }

  computeScore(student: {
    signals: Record<string, boolean>;
    tabSwitches: number;
    proximityVerified: boolean;
    timingAnomalies: number;
    hardwareMatch: boolean;
    heartbeatGaps: number;
  }) {
    let score = 0;
    const breakdown: { signal: string; pts: number }[] = [];

    for (const [key, weight] of Object.entries(this.weights)) {
      if (student.signals[key]) {
        score += weight;
        breakdown.push({ signal: key, pts: weight });
      }
    }

    // Apply penalties
    score += student.tabSwitches * PENALTIES.TAB_SWITCH;
    if (!student.proximityVerified) score += PENALTIES.PROXIMITY_FAIL;
    score += student.timingAnomalies * PENALTIES.TIMING_ANOMALY;
    if (!student.hardwareMatch) score += PENALTIES.FINGERPRINT_MISMATCH;
    score += student.heartbeatGaps * PENALTIES.HEARTBEAT_GAP;

    const finalScore = Math.max(0, Math.min(100, score));
    
    return {
      score: finalScore,
      breakdown,
      threshold: this.threshold,
      verdict: this.getVerdict(finalScore)
    };
  }

  getVerdict(score: number): 'present' | 'suspect' | 'absent' {
    if (score >= this.threshold) return 'present';
    if (score >= this.threshold * 0.6) return 'suspect';
    return 'absent';
  }
}
