'use client';
import { useUI } from '@/context/UIContext';
import VLogo    from '@/components/shared/VLogo';
import styles   from './Navbar.module.css';

const NAV_LINKS = ['Home', 'Products', 'Services', 'About'];

export default function Navbar() {
  const { menuOpen, toggleMenu, closeAll } = useUI();

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

        {/* Spacer — дясно (симетрия с FAB) */}
        <div className={styles.spacer} aria-hidden="true" />
      </nav>

      {/* Overlay при отворено меню */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}
        onClick={closeAll}
        aria-hidden="true"
      />

      {/* Side menu — отляво */}
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
