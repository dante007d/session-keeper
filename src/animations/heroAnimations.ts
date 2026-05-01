import anime from '../lib/anime';

export function runHeroTimeline() {
  const tl = anime.timeline({
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
    duration: 600,
  });

  // 1. Tag/Badge
  tl.add({
    targets: '.hero-badge',
    scale: [0.95, 1],
    opacity: [0, 1],
    duration: 500,
  })

  // 2. Main headline words
  .add({
    targets: '.hero-word',
    translateY: ['105%', '0%'],
    opacity: [0, 1],
    duration: 700,
    delay: anime.stagger(70),
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  }, '-=300')

  // 3. Italic primary words
  .add({
    targets: '.hero-italic',
    translateY: ['105%', '0%'],
    opacity: [0, 1],
    duration: 700,
    delay: anime.stagger(70),
    easing: 'cubicBezier(0.16, 1, 0.3, 1)',
  }, '-=400')

  // 4. Subtitle
  .add({
    targets: '.hero-subtitle',
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 600,
  }, '-=200')

  // 5. CTA buttons
  .add({
    targets: '.hero-cta',
    scale: [0.92, 1],
    opacity: [0, 1],
    duration: 500,
    delay: anime.stagger(80),
    easing: 'cubicBezier(0.34, 1.56, 0.64, 1)',
  }, '-=300');

  return tl;
}
