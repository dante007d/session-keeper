/**
 * PHANTOM FINGERPRINTING v2.0
 * Hardware-anchored identity using GPU, Audio, and Font entropy.
 * Stored in IndexedDB to survive localStorage clears.
 */

import { PHANTOM_CRYPTO } from "./crypto";

export async function buildHardwareFingerprint(): Promise<string> {
  const gpu = await measureGPURenderTime();
  const audio = await measureAudioLatency();
  const fonts = measureFontRendering();
  const colors = measureColorRendering();
  
  const standard = [
    navigator.userAgent,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    navigator.hardwareConcurrency,
    (navigator as any).deviceMemory,
    window.devicePixelRatio,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
  ].join('|');

  const combined = [gpu, audio, fonts, colors, standard].join('::');
  return await PHANTOM_CRYPTO.hash(combined);
}

async function measureGPURenderTime(): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 400; canvas.height = 400;
  const ctx = canvas.getContext('2d')!;

  const start = performance.now();
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `hsl(${i * 3.6}, 70%, 50%)`;
    ctx.fillRect(Math.sin(i) * 180 + 180, Math.cos(i) * 180 + 180, 20, 20);
    ctx.beginPath();
    ctx.arc(200, 200, i * 1.8, 0, Math.PI * 2);
    ctx.stroke();
  }

  const pixel = ctx.getImageData(100, 100, 1, 1).data;
  const elapsed = performance.now() - start;
  return `${elapsed.toFixed(2)}_${pixel.join(',')}`;
}

async function measureAudioLatency(): Promise<string> {
  try {
    const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    oscillator.connect(analyser);
    oscillator.frequency.value = 440;
    oscillator.start();

    await new Promise(r => setTimeout(r, 50));
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    oscillator.stop();
    await ctx.close();

    return data.slice(0, 32).join(',');
  } catch {
    return 'audio_unavailable';
  }
}

function measureFontRendering(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 300; canvas.height = 60;
  const ctx = canvas.getContext('2d')!;
  ctx.textBaseline = 'top';

  const testFonts = ['serif', 'sans-serif', 'monospace', 'cursive'];
  let combined = '';
  for (const font of testFonts) {
    ctx.font = `16px ${font}`;
    ctx.fillText('BEC Dev Club Phantom 👻 1234567890', 0, 0);
    const imageData = ctx.getImageData(0, 0, 300, 60);
    const sample = Array.from(imageData.data)
      .filter((_, i) => i % 40 === 0)
      .join(',');
    combined += sample + '|';
    ctx.clearRect(0, 0, 300, 60);
  }
  return combined;
}

function measureColorRendering(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1; canvas.height = 1;
  const ctx = canvas.getContext('2d')!;

  const testColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
  return testColors.map(color => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return `${r},${g},${b},${a}`;
  }).join('|');
}

// --- IndexedDB Storage ---

const DB_NAME = 'bec_phantom_db';
const STORE_NAME = 'fingerprints';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'studentId' });
      }
    };
    request.onsuccess = (e: any) => resolve(e.target.result);
    request.onerror = (e: any) => reject(e.target.error);
  });
}

export async function storeFingerprint(studentId: string, fingerprint: string) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ studentId, fingerprint, registeredAt: Date.now() });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function verifyFingerprint(studentId: string): Promise<{ match: boolean; confidence: string }> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(studentId);
    request.onsuccess = async () => {
      if (!request.result) {
        resolve({ match: false, confidence: 'none' });
        return;
      }
      const current = await buildHardwareFingerprint();
      resolve({
        match: current === request.result.fingerprint,
        confidence: current === request.result.fingerprint ? 'high' : 'mismatch'
      });
    };
    request.onerror = () => resolve({ match: false, confidence: 'error' });
  });
}
