'use client';
import { useLang }            from '@/context/LanguageContext';
import { Reveal }             from '@/components/shared/Reveal';
import { LayersIcon }            from '@/components/shared/Icons';
import styles                  from '@/app/placeholder.module.css';

export default function Page() {
  const { lang } = useLang();
  return (
    <div className={styles.wrap}>

      <Reveal from="up" delay={80}>
        <div className={styles.iconWrap}>
          <LayersIcon size={36} color="var(--teal)" />
        </div>
      </Reveal>

      <Reveal from="up" delay={180}>
        <h1 className={styles.title}>
          {lang === 'bg' ? 'Портфолио' : 'Portfolio'}
        </h1>
      </Reveal>

      <Reveal from="up" delay={300}>
        <p className={styles.sub}>
          {lang === 'bg' ? 'Страницата е в изграждане.' : 'This page is being built.'}
        </p>
      </Reveal>

      <Reveal from="up" delay={420}>
        <div className={styles.badge}>
          {lang === 'bg' ? 'Очаквайте скоро' : 'Coming soon'}
        </div>
      </Reveal>

    </div>
  );
}
