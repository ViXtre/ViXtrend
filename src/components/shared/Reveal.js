'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Reveal — fade + slide on viewport enter.
 *
 * Props:
 *   as      — HTML tag to render ("div" | "span" | any)  default "div"
 *   from    — "up" | "left" | "right" | "none"            default "up"
 *   delay   — ms before transition                         default 0
 *   className / style — forwarded to the wrapper element
 */
export function Reveal({
  children,
  as: Tag = 'div',
  from    = 'up',
  delay   = 0,
  className = '',
  style   = {},
}) {
  const ref          = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
                       'translate3d(0,44px,0)';

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity:         shown ? 1 : 0,
        transform:       shown ? 'none' : offset,
        transition:      'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)',
        transitionDelay: `${delay}ms`,
        willChange:      'opacity, transform',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * RevealWords — word-by-word headline reveal.
 * Renders only <span> elements — safe inside <h1>, <p>, gradient spans.
 *
 * Props:
 *   text      — plain string
 *   delay     — base delay in ms
 *   className — on the outer <span>
 */
export function RevealWords({ text, className = '', delay = 0 }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{
            display:       'inline-block',
            overflow:      'hidden',
            verticalAlign: 'bottom',
          }}
        >
          <Reveal
            as="span"
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
