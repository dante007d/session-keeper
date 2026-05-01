import anime from '../lib/anime';

export function animateStatCards() {
  anime({
    targets: '.stat-card',
    translateY: [24, 0],
    opacity: [0, 1],
    scale: [0.96, 1],
    duration: 600,
    delay: anime.stagger(100, { start: 200 }),
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  });
}

export function animateSessionCards() {
  anime({
    targets: '.session-card',
    translateY: [32, 0],
    opacity: [0, 1],
    scale: [0.97, 1],
    duration: 550,
    delay: anime.stagger(60),
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  });
}
