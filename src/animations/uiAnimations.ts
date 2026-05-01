import anime from '../lib/anime';

// --- Command Palette ---
export function openPalette(el: HTMLElement) {
  anime.set(el, { display: 'block' });
  anime({
    targets: el,
    scale: [0.95, 1],
    opacity: [0, 1],
    translateY: [-12, 0],
    duration: 300,
    easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
  });
}

export function closePalette(el: HTMLElement, onComplete?: () => void) {
  anime({
    targets: el,
    scale: [1, 0.95],
    opacity: [1, 0],
    translateY: [0, -8],
    duration: 200,
    easing: 'easeInQuad',
    complete: () => {
      anime.set(el, { display: 'none' });
      onComplete?.();
    },
  });
}

export function animatePaletteResults(containerEl: HTMLElement) {
  anime({
    targets: containerEl.querySelectorAll('.palette-item'),
    translateX: [-8, 0],
    opacity: [0, 1],
    duration: 200,
    delay: anime.stagger(25),
    easing: 'easeOutQuad',
  });
}

// --- Dark Mode ---
export function animateDarkToggle(iconEl: HTMLElement, isDark: boolean) {
  anime({
    targets: iconEl,
    rotate: isDark ? [0, 180] : [180, 360],
    scale: [0.6, 1],
    duration: 400,
    easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
  });
}

// --- Compile Ceremony ---
export function compileLoading(btnEl: HTMLElement, textEl: HTMLElement, spinnerEl: HTMLElement) {
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
    });
}

export function compileSuccess(btnEl: HTMLElement, textEl: HTMLElement, spinnerEl: HTMLElement, dotEl: HTMLElement) {
  anime.timeline()
    .add({
      targets: spinnerEl,
      opacity: [1, 0],
      duration: 150,
    })
    .add({
      targets: btnEl,
      backgroundColor: '#2D4A3E',
      duration: 300,
      easing: 'easeOutQuad',
    })
    .add({
      targets: textEl,
      opacity: [0, 1],
      translateY: [10, 0],
      scale: [0.8, 1],
      duration: 400,
      easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
    }, '-=100')
    .add({
      targets: dotEl,
      backgroundColor: ['#B8860B', '#D4A017', '#B8860B'],
      scale: [1, 1.4, 1],
      duration: 600,
      loop: 3,
    }, '-=200');
}

// --- Toast ---
export function showToast(toastEl: HTMLElement, progressEl: HTMLElement, duration = 4500) {
  anime({
    targets: toastEl,
    translateY: [24, 0],
    opacity: [0, 1],
    duration: 350,
    easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
  });

  anime({
    targets: progressEl,
    width: ['100%', '0%'],
    duration: duration,
    easing: 'linear',
  });
}

export function dismissToast(toastEl: HTMLElement, onComplete?: () => void) {
  anime({
    targets: toastEl,
    translateY: [0, 16],
    opacity: [1, 0],
    duration: 250,
    easing: 'easeInQuad',
    complete: () => {
      onComplete?.();
      toastEl.remove();
    },
  });
}
