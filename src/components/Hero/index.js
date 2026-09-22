'use client';
import { useEffect, useRef }      from 'react';
import Image                       from 'next/image';
import { useLang }                 from '@/context/LanguageContext';
import { Reveal, RevealWords }     from '@/components/shared/Reveal';
import styles                      from './Hero.module.css';

const PARTICLES = [
  { left: '7%',  size: 3, color: '#a8e06a', dur: 8.2,  del: 0    },
  { left: '17%', size: 2, color: '#26d0b2', dur: 10.5, del: 0.9  },
  { left: '28%', size: 3, color: '#a8e06a', dur: 7.3,  del: 2.1  },
  { left: '41%', size: 2, color: '#26d0b2', dur: 11,   del: 0.4  },
  { left: '56%', size: 2, color: '#a8e06a', dur: 9.1,  del: 1.6  },
  { left: '67%', size: 3, color: '#26d0b2', dur: 8.7,  del: 2.6  },
  { left: '79%', size: 2, color: '#a8e06a', dur: 10,   del: 0.7  },
  { left: '89%', size: 3, color: '#26d0b2', dur: 7.8,  del: 1.3  },
];

export default function Hero() {
  const { t }   = useLang();
  const logoRef = useRef(null);

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const onMove = (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const rx = ((e.clientY - cy) / cy) * -8;
      const ry = ((e.clientX - cx) / cx) *  10;
      el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const onLeave = () => {
      el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section className={styles.hero}>

      {PARTICLES.map((p, i) => (
        <span key={i} className={styles.particle} style={{
          left: p.left, width: p.size, height: p.size,
          background: p.color,
          animationDuration: `${p.dur}s`,
          animationDelay:    `${p.del}s`,
        }} />
      ))}

      <div className={styles.bgGlow} />

      {/* Лого — CSS animation */}
      <div className={styles.logoWrap}>
        <div className={styles.logoGlow} />
        <div className={styles.logoFloat}>
          <div className={styles.logoTilt} ref={logoRef}>
            <Image
              src="/ViX-logo.png"
              alt="ViXtrend logo"
              width={160} height={160}
              style={{ objectFit: 'contain', display: 'block' }}
              priority
            />
          </div>
        </div>
        <div className={styles.podiumDisc} />
        <div className={styles.podiumFloor} />
      </div>

      {/* Tagline */}
      <Reveal from="up" delay={120} style={{ marginTop: '36px' }}>
        <p className={styles.tagline}>{t.hero.tagline}</p>
      </Reveal>

      {/* Heading */}
      <div style={{ textAlign: 'center' }}>
        {/* Ред 1 — дума по дума, бял текст */}
        <h1 className={styles.heading}>
          <RevealWords text={t.hero.sub1} delay={220} />
        </h1>

        {/* Ред 2 — единичен Reveal за целия gradient ред
            НЕ RevealWords — gradient + nested spans = невидим текст */}
        <Reveal
          as="p"
          from="up"
          delay={460}
          className={`${styles.heading} ${styles.gradText}`}
          style={{ margin: 0 }}
        >
          {t.hero.sub2}
        </Reveal>
      </div>

      {/* CTAs */}
      <Reveal from="up" delay={620}>
        <div className={styles.ctas}>
          <button className={styles.btnPrimary}>{t.hero.cta}</button>
          <button className={styles.btnSecondary}>{t.hero.explore} →</button>
        </div>
      </Reveal>

      {/* Stats */}
      <Reveal from="up" delay={760}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>4+</span>
            <span className={styles.statLbl}>{t.hero.stats.products}</span>
          </div>
          <div className={styles.statSep} />
          <div className={styles.stat}>
            <span className={styles.statNum}>2025</span>
            <span className={styles.statLbl}>{t.hero.stats.founded}</span>
          </div>
          <div className={styles.statSep} />
          <div className={styles.stat}>
            <span className={styles.statNum}>100%</span>
            <span className={styles.statLbl}>{t.hero.stats.owned}</span>
          </div>
        </div>
      </Reveal>

      {/* Scroll hint */}
      <div className={styles.scrollHint}>
        <div className={styles.scrollLine} />
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
             stroke="#26d0b2" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>

    </section>
  );
}
