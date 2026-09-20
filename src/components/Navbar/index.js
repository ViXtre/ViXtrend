'use client';
import { useUI }   from '@/context/UIContext';
import { useLang } from '@/context/LanguageContext';
import VLogo       from '@/components/shared/VLogo';
import styles      from './Navbar.module.css';

export default function Navbar() {
  const { menuOpen, toggleMenu, closeAll } = useUI();
  const { lang, toggleLang, t }            = useLang();

  const NAV_LINKS = [
    t.nav.home,
    t.nav.products,
    t.nav.services,
    t.nav.about,
  ];

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
        <div className={styles.logo}>
          <VLogo size={26} />
          <span className={styles.vix}>vix</span>
          <span className={styles.trend}>trend</span>
        </div>

        {/* Lang toggle — дясно */}
        <button
          className={styles.langToggle}
          onClick={toggleLang}
          aria-label="Смени език"
        >
          <span className={lang === 'bg' ? styles.langActive : styles.langInactive}>BG</span>
          <span className={styles.langSep}>|</span>
          <span className={lang === 'en' ? styles.langActive : styles.langInactive}>EN</span>
        </button>
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
        {NAV_LINKS.map((item, i) => (
          <div
            key={item}
            className={styles.menuItem}
            style={{ animationDelay: `${0.08 + i * 0.06}s` }}
          >
            {item}
          </div>
        ))}
        <div className={styles.menuFooter}>Your Business Extensions</div>
      </div>
    </>
  );
}
