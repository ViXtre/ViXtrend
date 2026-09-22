'use client';
import { useLang }         from '@/context/LanguageContext';
import { Reveal }          from '@/components/shared/Reveal';
import styles              from './tools.module.css';

const TOOLS = [
  {
    key:  'qr',
    href: '/tools/qr-studio.html',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none"
           stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="18" y="18" width="3" height="3"/>
        <rect x="14" y="14" width="3" height="3"/>
        <rect x="18" y="14" width="3" height="3"/>
        <rect x="14" y="18" width="3" height="3"/>
      </svg>
    ),
  },
  {
    key:  'nte',
    href: '/tools/ntepro.html',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none"
           stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
  },
];

export default function ToolsPage() {
  const { t, lang } = useLang();

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <Reveal from="up" delay={80}>
          <span className={styles.badge}>{t.tools.badge}</span>
        </Reveal>

        <Reveal from="up" delay={180}>
          <h1 className={styles.title}>
            {lang === 'bg' ? 'Инструменти' : 'Tools'}
          </h1>
        </Reveal>

        <Reveal from="up" delay={280}>
          <p className={styles.subtitle}>{t.tools.subtitle}</p>
        </Reveal>
      </div>

      <div className={styles.grid}>
        {TOOLS.map((tool, idx) => {
          const info = t.tools[tool.key];
          return (
            <Reveal key={tool.key} from="up" delay={380 + idx * 120}>
              <div className={styles.card}>
                <div className={styles.iconWrap}>{tool.icon}</div>
                <span className={styles.tag}>{info.tag}</span>
                <h2 className={styles.cardTitle}>{info.name}</h2>
                <p className={styles.cardDesc}>{info.desc}</p>
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cta}
                >
                  {t.tools.open}
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                  </svg>
                </a>
              </div>
            </Reveal>
          );
        })}
      </div>

    </div>
  );
}
