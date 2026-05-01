import anime from '../lib/anime';

export function animateTimeline(containerEl: HTMLElement) {
  const line = containerEl.querySelector('.timeline-line');
  const dots = containerEl.querySelectorAll('.timeline-dot');
  const cards = containerEl.querySelectorAll('.timeline-card');

  if (!line) return;

  const lineHeight = line.getBoundingClientRect().height;
  anime({
    targets: line,
    height: [0, lineHeight],
    duration: 1000,
    easing: 'easeOutQuart',
  });

  anime({
    targets: dots,
    scale: [0, 1],
    opacity: [0, 1],
    duration: 350,
    delay: anime.stagger(120, { start: 200 }),
    easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
  });

  anime({
    targets: cards,
    translateX: [30, 0],
    opacity: [0, 1],
    duration: 500,
    delay: anime.stagger(100, { start: 300 }),
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  });
}
