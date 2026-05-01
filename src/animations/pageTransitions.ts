import anime from '../lib/anime';

export function pageTransitionEffect(onComplete: () => void) {
  // Create an overlay container
  const overlay = document.createElement('div');
  overlay.id = 'page-transition-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    display: flex; flex-direction: column;
    pointer-events: none;
    overflow: hidden;
  `;
  
  // Create slices for a liquid glassmorphism stripe effect
  const slices: HTMLDivElement[] = [];
  const numSlices = 5;
  for (let i = 0; i < numSlices; i++) {
    const slice = document.createElement('div');
    slice.style.cssText = `
      flex: 1; width: 100%;
      background: hsl(var(--primary) / 0.2);
      backdrop-filter: blur(28px) saturate(200%);
      -webkit-backdrop-filter: blur(28px) saturate(200%);
      box-shadow: 20px 0 30px hsl(var(--primary) / 0.15);
      transform: scaleX(0);
      transform-origin: left;
      margin-top: -2px; /* Overlap to hide seams */
      margin-bottom: -2px;
      border-radius: 0 150px 150px 0; /* Creates rounded, droplet-like leading edge */
    `;
    overlay.appendChild(slice);
    slices.push(slice);
  }
  
  document.body.appendChild(overlay);

  // In animation
  anime({
    targets: slices,
    scaleX: [0, 1.1], // Overscale to ensure the rounded edge goes completely off-screen
    duration: 600,
    delay: anime.stagger(80),
    easing: 'easeInOutQuint',
    complete: () => {
      onComplete?.();
      
      // Out animation
      slices.forEach(slice => {
        slice.style.transformOrigin = 'right';
        slice.style.borderRadius = '150px 0 0 150px'; // Flip rounded edge for out animation
      });

      anime({
        targets: slices,
        scaleX: [1.1, 0],
        duration: 600,
        delay: anime.stagger(80, { from: 'last' }),
        easing: 'easeInOutQuint',
        complete: () => {
          overlay.remove();
        }
      });
    }
  });
}

// Stagger content in on page enter
export function pageEnter(containerEl: HTMLElement) {
  const sections = containerEl.querySelectorAll('section, .stat-card, .surface-card');
  if (sections.length === 0) return;
  
  anime({
    targets: sections,
    translateY: [30, 0],
    opacity: [0, 1],
    duration: 800,
    delay: anime.stagger(100),
    easing: 'easeOutExpo',
  });
}

