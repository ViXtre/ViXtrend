'use client';
import { useLang } from '@/context/LanguageContext';
import styles      from './tools.module.css';

const TOOLS = [
  {
    key:  'qr',
    href: '/tools/qr-studio.html',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13 0h-2v2h2v2h-2v2h2v-2h2v2h2v-4h-2v-2zm-2-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 6h-2v-2h2v2z"/>
      </svg>
    ),
  },
  {
    key:  'nte',
    href: '/tools/ntepro.html',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-2 13h-2v-2h2v2zm2-4h-2v2h-2v-2h-2v4h6v-4zm0 4h2v2h-2v-2zm2-4h-2v2h2v-2z"/>
      </svg>
    ),
  },
];

export default function ToolsPage() {
  const { t, lang } = useLang();

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.badge}>{t.tools.badge}</span>
        <h1 className={styles.title}>
          {lang === 'bg' ? 'Инструменти' : 'Tools'}
        </h1>
        <p className={styles.subtitle}>{t.tools.subtitle}</p>
      </div>

      {/* Cards */}
      <div className={styles.grid}>
        {TOOLS.map((tool) => {
          const info = t.tools[tool.key];
          return (
            <div key={tool.key} className={styles.card}>
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
          );
        })}
      </div>
    </div>
  );
}
