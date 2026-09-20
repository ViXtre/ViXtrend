'use client';
import Link       from 'next/link';
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

export default function Navbar() {
  const { menuOpen, toggleMenu, closeAll } = useUI();
  const { lang, toggleLang, t }            = useLang();

  return (
    <>
      <nav className={styles.navbar}>
        {/* Burger */}
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

        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeAll}>
          <VLogo size={26} />
          <span className={styles.vix}>vix</span>
          <span className={styles.trend}>trend</span>
        </Link>

        {/* Lang toggle */}
        <button className={styles.langToggle} onClick={toggleLang} aria-label="Смени език">
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
      <div className={`${styles.sidemenu} ${menuOpen ? styles.menuOpen : ''}`} aria-hidden={!menuOpen}>

        {/* Главни линкове */}
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

        {/* Разделител */}
        <div className={styles.menuDivider} />

        {/* Инструменти — скрит линк */}
        <Link
          href="/tools"
          className={styles.menuItemSecondary}
          style={{ animationDelay: '0.34s' }}
          onClick={closeAll}
        >
          {lang === 'bg' ? '⬡ Инструменти' : '⬡ Tools'}
        </Link>

        <div className={styles.menuFooter}>Your Business Extensions</div>
      </div>
    </>
  );
}
