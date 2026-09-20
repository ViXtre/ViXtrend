'use client';
import { useLang } from '@/context/LanguageContext';
import styles      from '@/app/placeholder.module.css';

export default function Page() {
  const { lang } = useLang();
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>◆</div>
      <h1 className={styles.title}>
        {lang === 'bg' ? 'Портфолио' : 'Portfolio'}
      </h1>
      <p className={styles.sub}>
        {lang === 'bg' ? 'Страницата е в изграждане.' : 'This page is being built.'}
      </p>
      <div className={styles.badge}>
        {lang === 'bg' ? 'Очаквайте скоро' : 'Coming soon'}
      </div>
    </div>
  );
}
