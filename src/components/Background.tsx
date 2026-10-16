import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { site } from '../config/site';

export function Background() {
  const video = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const element = video.current;
    const main = document.getElementById('conteudo');
    if (!element || reduced || !main) return;
    let visible = true;
    let active = true;
    const sync = () => {
      if (paused || document.hidden || !visible) element.pause();
      else void element.play().catch((error: DOMException) => {
        // Pause or React's development cleanup can interrupt a pending play().
        if (active && error.name !== 'AbortError') setFailed(true);
      });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(main);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => { active = false; observer.disconnect(); document.removeEventListener('visibilitychange', sync); element.pause(); };
  }, [reduced, paused]);
  return <>
    <div className="site-background" aria-hidden="true" style={{ backgroundImage: `url(${site.backgroundPoster})` }}>
      {!reduced && !failed && <video ref={video} autoPlay muted loop playsInline preload="metadata" poster={site.backgroundPoster} onError={() => setFailed(true)}>
        <source src={site.backgroundVideo} type="video/mp4" />
      </video>}
      <div className="background-shade" />
    </div>
    {!reduced && !failed && <button className="motion-control" onClick={() => setPaused(!paused)} aria-label={paused ? 'Reproduzir fundo animado' : 'Pausar fundo animado'}>
      {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
      <span>{paused ? 'Reproduzir fundo' : 'Pausar fundo'}</span>
    </button>}
  </>;
}
