import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Pause, Play } from 'lucide-react';
import { site } from '../config/site';

export function Background() {
  const video = useRef<HTMLVideoElement>(null);
  const attempt = useRef(0);
  const denied = useRef(false);
  const playbackWanted = useRef(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const shouldLoad = !reduced || motionEnabled;

  const play = useCallback(() => {
    const element = video.current;
    if (!element) return;
    const currentAttempt = ++attempt.current;
    // Set both the property and attribute before play(), including on Safari.
    element.defaultMuted = true;
    element.muted = true;
    element.playsInline = true;
    void element.play().catch((error: DOMException) => {
      if (currentAttempt !== attempt.current || !playbackWanted.current || error.name === 'AbortError') return;
      setPlaying(false);
      denied.current = error.name === 'NotAllowedError';
      // Autoplay denial is recoverable: keep the video and its play control.
      if (!denied.current) setMediaError(true);
    });
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReduced(query.matches);
      setMotionEnabled(false);
    };
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    // Browsers do not consistently reload when React attaches <source> children.
    video.current?.load();
  }, [shouldLoad]);
  useEffect(() => {
    const element = video.current;
    const main = document.getElementById('conteudo');
    if (!element || !main) return;
    let visible = true;
    playbackWanted.current = shouldLoad && !paused;
    const sync = () => {
      if (!playbackWanted.current || document.hidden || !visible) {
        ++attempt.current;
        element.pause();
      } else play();
    };
    const retryAfterGesture = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('.motion-control')) return;
      if (denied.current && playbackWanted.current && !document.hidden && visible) play();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(main);
    document.addEventListener('visibilitychange', sync);
    element.addEventListener('loadeddata', sync);
    window.addEventListener('pointerdown', retryAfterGesture, { passive: true });
    window.addEventListener('keydown', retryAfterGesture);
    sync();
    return () => {
      ++attempt.current;
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      element.removeEventListener('loadeddata', sync);
      window.removeEventListener('pointerdown', retryAfterGesture);
      window.removeEventListener('keydown', retryAfterGesture);
      element.pause();
    };
  }, [shouldLoad, paused, play]);

  const togglePlayback = () => {
    if (playing) {
      playbackWanted.current = false;
      ++attempt.current;
      setPaused(true);
      video.current?.pause();
    } else {
      // Attach sources before play() while the click still grants user activation.
      const reload = mediaError;
      flushSync(() => {
        setMotionEnabled(true);
        setPaused(false);
        setMediaError(false);
      });
      playbackWanted.current = true;
      if (reload || !shouldLoad) video.current?.load();
      play();
    }
  };

  return <>
    <div className="site-background" aria-hidden="true" style={{ backgroundImage: `url(${site.backgroundPoster})` }}>
      <video ref={video} autoPlay={shouldLoad && !paused} muted loop playsInline preload={shouldLoad ? 'auto' : 'none'} poster={site.backgroundPoster}
        onPlaying={() => { setPlaying(true); setMediaError(false); denied.current = false; }}
        onPause={() => setPlaying(false)}
        onError={() => { setPlaying(false); setMediaError(true); }}>
        {shouldLoad && <>
          <source src={site.backgroundVideoWebm} type="video/webm" />
          <source src={site.backgroundVideo} type="video/mp4" />
        </>}
      </video>
      <div className="background-shade" />
    </div>
    <button className="motion-control" onClick={togglePlayback} aria-label={playing ? 'Pausar fundo animado' : 'Reproduzir fundo animado'}>
      {playing ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
      <span>{playing ? 'Pausar fundo' : mediaError ? 'Tentar reproduzir fundo' : 'Reproduzir fundo'}</span>
    </button>
  </>;
}
