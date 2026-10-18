'use client';

import AdminGuard from '@/components/AdminGuard';

export default function AdminContactsLayout({ children }) {
  return <AdminGuard>{children}</AdminGuard>;
}
