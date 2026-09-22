'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI }   from '@/context/UIContext';
import { useLang } from '@/context/LanguageContext';
import VLogo       from '@/components/shared/VLogo';
import styles      from './Navbar.module.css';

const NAV_ITEMS = [
  { key: 'home',     href: '/'         },
  { key: 'products', href: '/products' },
  { key: 'services', href: '/services' },
  { key: 'about',    href: '/about'    },
];

const CONTACTS = [
  {
    label: 'Viber / Телефон',
    icon: <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4.5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.27.2 2.47.57 3.58.11.35.03.74-.24 1.01L6.6 10.8z"/></svg>,
  },
  {
    label: 'Email',
    icon: <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
  },
  {
    label: 'Facebook',
    icon: <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { menuOpen, fabOpen, toggleMenu, toggleFab, closeAll } = useUI();
  const { lang, toggleLang, t } = useLang();

  // Hide client navbar on all admin routes
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav className={styles.navbar}>

        {/* Burger — ляво */}
        <button
          className={`${styles.burger} ${menuOpen ? styles.open : ''}`}
          onClick={toggleMenu}
          aria-label="Меню"
          aria-expanded={menuOpen}
        >
          <span className={styles.bl} />
          <span className={styles.bl} />
          <span className={styles.bl} />
        </button>

        {/* Logo — център */}
        <Link href="/" className={styles.logo} onClick={closeAll}>
          <VLogo size={26} />
          <span className={styles.vix}>vix</span>
          <span className={styles.trend}>trend</span>
        </Link>

        {/* Дясна група — lang + FAB заедно */}
        <div className={styles.rightGroup}>

          {/* Lang toggle */}
          <button
            className={styles.langToggle}
            onClick={toggleLang}
            aria-label="Смени език"
          >
            <span className={lang === 'bg' ? styles.langActive : styles.langInactive}>BG</span>
            <span className={styles.langSep}>|</span>
            <span className={lang === 'en' ? styles.langActive : styles.langInactive}>EN</span>
          </button>

          {/* FAB — вътре в navbar */}
          <div className={styles.fabWrap}>
            <button
              className={`${styles.fab} ${fabOpen ? styles.fabOpen : ''}`}
              onClick={toggleFab}
              aria-label="Контакт"
              aria-expanded={fabOpen}
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4.5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.27.2 2.47.57 3.58.11.35.03.74-.24 1.01L6.6 10.8z"/>
              </svg>
            </button>

            {/* Dropdown надолу */}
            {fabOpen && (
              <div className={styles.fabIcons}>
                {CONTACTS.map((c, i) => (
                  <button
                    key={c.label}
                    className={styles.fabIconBtn}
                    title={c.label}
                    aria-label={c.label}
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    {c.icon}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}
        onClick={closeAll}
        aria-hidden="true"
      />

      {/* Side menu */}
      <div
        className={`${styles.sidemenu} ${menuOpen ? styles.menuOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        {NAV_ITEMS.map((item, i) => (
          <Link
            key={item.key}
            href={item.href}
            className={styles.menuItem}
            style={{ animationDelay: `${0.08 + i * 0.06}s` }}
            onClick={closeAll}
          >
            {t.nav[item.key]}
          </Link>
        ))}

        <div className={styles.menuDivider} />

        <Link
          href="/tools"
          className={styles.menuItemSecondary}
          style={{ animationDelay: '0.34s' }}
          onClick={closeAll}
        >
          {lang === 'bg' ? 'Инструменти' : 'Tools'}
        </Link>

        <div className={styles.menuFooter}>Your Business Extensions</div>
      </div>
    </>
  );
}
