'use client';
import { useUI } from '@/context/UIContext';
import styles    from './ContactFAB.module.css';

const CONTACTS = [
  {
    label: 'Viber / Телефон',
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4.5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.27.2 2.47.57 3.58.11.35.03.74-.24 1.01L6.6 10.8z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

export default function ContactFAB() {
  const { fabOpen, toggleFab } = useUI();

  return (
    <div className={styles.wrap}>
      {/* Fan нагоре при отваряне */}
      {fabOpen && (
        <div className={styles.icons}>
          {CONTACTS.map((c, i) => (
            <button
              key={c.label}
              className={styles.iconBtn}
              title={c.label}
              aria-label={c.label}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {c.icon}
            </button>
          ))}
        </div>
      )}

      {/* Главен бутон */}
      <button
        className={`${styles.fab} ${fabOpen ? styles.fabOpen : ''}`}
        onClick={toggleFab}
        aria-label="Контакт"
        aria-expanded={fabOpen}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4.5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.27.2 2.47.57 3.58.11.35.03.74-.24 1.01L6.6 10.8z" />
        </svg>
      </button>
    </div>
  );
}
