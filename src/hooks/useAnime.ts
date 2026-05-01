import { useEffect, useRef } from 'react';
import anime from '../lib/anime';

export function useAnime(config: anime.AnimeParams, deps: any[] = []) {
  const animRef = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    animRef.current = anime(config);
    return () => {
      if (animRef.current) animRef.current.pause();
    };
  }, deps);

  return animRef;
}
