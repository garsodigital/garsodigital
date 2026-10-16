import { useEffect } from 'react';

export function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (query.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    for (const element of elements) {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add('reveal-pending');
        observer.observe(element);
      }
    }
    const showAll = () => {
      if (query.matches) {
        elements.forEach(element => element.classList.remove('reveal-pending'));
        observer.disconnect();
      }
    };
    query.addEventListener('change', showAll);
    return () => {
      observer.disconnect();
      elements.forEach(element => element.classList.remove('reveal-pending'));
      query.removeEventListener('change', showAll);
    };
  }, []);
}
