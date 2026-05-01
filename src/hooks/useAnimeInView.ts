import { useEffect, useRef } from 'react';
import anime from '../lib/anime';

export function useAnimeInView(getConfig: (el: HTMLElement) => anime.AnimeParams, deps: any[] = []) {
  const ref = useRef<any>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          anime(getConfig(el));
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, deps);

  return ref;
}
