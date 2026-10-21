'use client';

import AdminGuard from '@/components/AdminGuard';

export default function AdminMessagesLayout({ children }) {
  return <AdminGuard>{children}</AdminGuard>;
}
