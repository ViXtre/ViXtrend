'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import VLogo from '@/components/shared/VLogo';
import { LayoutDashboardIcon, LayersIcon, PhoneIcon } from '@/components/shared/Icons';
import styles from './AdminNav.module.css';

export default function AdminNav() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const [emailOpen, setEmailOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/admin-login');
  };

  const navItems = [
    { label: 'Табло',              href: '/admin',          icon: LayoutDashboardIcon },
    { label: 'Продукти & Сайтове', href: '/admin-products', icon: LayersIcon },
    { label: 'Контакти',           href: '/admin-contacts', icon: PhoneIcon },
  ];

  return (
    <nav className={styles.navbar}>

      {/* ── Ляво: лого + Admin Mode badge + имейл (toggle) ── */}
      <div className={styles.brandGroup}>
        <Link href="/admin" className={styles.brandLink}>
          <VLogo size={22} />
          <span className={styles.brandName}>ViXtrend</span>
        </Link>
        <button
          className={`${styles.adminBadge} ${emailOpen ? styles.adminBadgeOpen : ''}`}
          onClick={() => setEmailOpen((v) => !v)}
          aria-expanded={emailOpen}
          title={emailOpen ? 'Скрий имейл' : 'Покажи имейл'}
        >
          ADMIN MODE
        </button>
        <span className={`${styles.emailChip} ${emailOpen ? styles.emailChipVisible : ''}`}>
          {user?.email}
        </span>
      </div>

      {/* ── Център: nav линкове ── */}
      <div className={styles.navLinks}>
        {navItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              <item.icon size={14} color="currentColor" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* ── Дясно: Към сайта + Изход ── */}
      <div className={styles.rightGroup}>
        <Link href="/" className={styles.siteBtn}>
          ← Към сайта
        </Link>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Изход
        </button>
      </div>

    </nav>
  );
}
