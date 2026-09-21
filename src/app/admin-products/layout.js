'use client';

import AdminGuard from '@/components/AdminGuard';

export default function AdminProductsLayout({ children }) {
  return <AdminGuard>{children}</AdminGuard>;
}
