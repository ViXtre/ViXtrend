'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Reveal — fade + slide when element enters viewport.
 * Re-animates every time element enters / leaves (kinetic feel).
 * Respects prefers-reduced-motion.
 *
 * Props:
 *   from    — "up" | "left" | "right" | "none"  (default "up")
 *   delay   — ms delay before transition starts   (default 0)
 *   className / style — passed to wrapper div
 */
export function Reveal({ children, from = 'up', delay = 0, className = '', style = {} }) {
  const ref  = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user accessibility preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setShown(e.isIntersecting)),
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const offset =
    from === 'left'  ? 'translate3d(-48px,0,0)' :
    from === 'right' ? 'translate3d(48px,0,0)'  :
    from === 'none'  ? 'none'                   :
                       'translate3d(0,44px,0)'; // default: up

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:          shown ? 1 : 0,
        transform:        shown ? 'none' : offset,
        transition:       'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)',
        transitionDelay:  `${delay}ms`,
        willChange:       'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * RevealWords — word-by-word headline reveal.
 * Splits `text` on spaces and reveals each word with staggered delay.
 * Use for plain-string headings only (no JSX children).
 *
 * Props:
 *   text      — plain string to split
 *   delay     — base delay in ms before first word
 *   className — applied to the outer <span>
 */
export function RevealWords({ text, className = '', delay = 0 }) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{
            display:      'inline-block',
            overflow:     'hidden',
            verticalAlign: 'bottom',
          }}
        >
          <Reveal
            from="up"
            delay={delay + i * 90}
            style={{ display: 'inline-block' }}
          >
            {word}{i < words.length - 1 ? '\u00A0' : ''}
          </Reveal>
        </span>
      ))}
    </span>
  );
}
