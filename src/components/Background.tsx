import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '../config/site';

export function Background() {
  const video = useRef<HTMLVideoElement>(null);
  const attempt = useRef(0);
  const denied = useRef(false);
  const playbackWanted = useRef(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const shouldLoad = !reduced;

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
      denied.current = error.name === 'NotAllowedError';
      // Keep the video mounted so an ordinary interaction can retry autoplay.
    });
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
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
    playbackWanted.current = shouldLoad;
    const sync = () => {
      if (!playbackWanted.current || document.hidden || !visible) {
        ++attempt.current;
        element.pause();
      } else play();
    };
    const retryAfterGesture = () => {
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
  }, [shouldLoad, play]);

  return <div className="site-background" aria-hidden="true" style={{ backgroundImage: `url(${site.backgroundPoster})` }}>
      <video ref={video} autoPlay={shouldLoad} muted loop playsInline controls={false} disablePictureInPicture disableRemotePlayback tabIndex={-1}
        preload={shouldLoad ? 'auto' : 'none'} poster={site.backgroundPoster}
        onPlaying={() => { denied.current = false; }}>
        {shouldLoad && <>
          <source src={site.backgroundVideoWebm} type="video/webm" />
          <source src={site.backgroundVideo} type="video/mp4" />
        </>}
      </video>
      <div className="background-shade" />
    </div>;
}
