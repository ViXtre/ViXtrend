'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminNav from '@/components/AdminNav';

export default function AdminGuard({ children }) {
  const router = useRouter();
  const { user, isAdmin, loading, refreshProfile, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin-login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        background: 'var(--bg-primary)',
      }}>
        Зареждане на административен профил...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'var(--bg-primary)',
      }}>
        <div style={{
          maxWidth: '460px',
          width: '100%',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        }}>
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'rgba(245, 197, 24, 0.12)',
            border: '1px solid rgba(245, 197, 24, 0.3)',
            color: '#f5c518',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '16px',
          }}>
            Очаква активиране
          </div>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '10px', color: 'var(--text-primary)' }}>
            Изисква се Администраторска Роля
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
            Акаунтът <strong>{user.email}</strong> има потребителска роля (<code>role = &quot;user&quot;</code>).
            <br /><br />
            Моля, влезте във <strong>Firebase Console</strong> -&gt; <strong>Firestore Database</strong> -&gt; колекция <code>users</code> -&gt; намерете документа за Вашия UID и сменете <code>role</code> на <code>&quot;admin&quot;</code>.
          </p>

          <div style={{
            background: 'var(--bg-primary)',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            marginBottom: '20px',
            wordBreak: 'break-all',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}>
            Вашият UID: <span style={{ color: 'var(--teal)' }}>{user.uid}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => refreshProfile()}
              style={{
                flex: 1,
                padding: '10px',
                background: 'var(--grad)',
                border: 'none',
                borderRadius: '8px',
                color: '#0d1b2a',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Провери отново
            </button>
            <button
              onClick={() => logout()}
              style={{
                padding: '10px 18px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Изход
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <AdminNav />
      {children}
    </div>
  );
}
