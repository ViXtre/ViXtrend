'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import VLogo from '@/components/shared/VLogo';
import { LayoutDashboardIcon, LayersIcon, PlusIcon } from '@/components/shared/Icons';
import styles from './AdminNav.module.css';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/admin-login');
  };

  const navItems = [
    { label: 'Табло',              href: '/admin',              icon: LayoutDashboardIcon },
    { label: 'Продукти & Сайтове', href: '/admin-products',     icon: LayersIcon },
    { label: 'Нов Продукт',        href: '/admin-products/new', icon: PlusIcon },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.brandGroup}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <VLogo size={22} />
          <span style={{ fontWeight: 800, letterSpacing: '0.5px' }}>ViXtrend</span>
        </Link>
        <span className={styles.adminBadge}>Admin Mode</span>
      </div>

      <div className={styles.navLinks}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              <item.icon size={15} color="currentColor" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className={styles.userGroup}>
        <Link href="/" className={styles.siteBtn} title="Премини към публичния сайт">
          <span>&larr;</span>
          <span>Към сайта</span>
        </Link>
        <span className={styles.userInfo}>{user?.email}</span>
        <button onClick={handleLogout} className={styles.logoutBtn} title="Изход от системата">
          Изход
        </button>
      </div>
    </nav>
  );
}
