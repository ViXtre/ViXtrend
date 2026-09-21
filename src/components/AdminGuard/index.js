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
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        fontSize: '1rem',
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
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          maxWidth: '460px',
          width: '100%',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '36px 28px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(245, 197, 24, 0.15)',
            border: '1px solid rgba(245, 197, 24, 0.4)',
            color: '#f5c518',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            margin: '0 auto 16px',
          }}>
            🔒
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Изисква се Администраторска Роля</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
            Акаунтът <strong>{user.email}</strong> има потребителска роля (<code>role = &quot;user&quot;</code>).
            <br /><br />
            Моля, влезте в <strong>Firebase Console</strong> -&gt; <strong>Firestore Database</strong> -&gt; колекция <code>users</code> -&gt; намерете документа за Вашия UID и сменете <code>role</code> на <code>&quot;admin&quot;</code>.
          </p>

          <div style={{
            background: 'var(--bg-primary)',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            marginBottom: '20px',
            wordBreak: 'break-all',
            color: 'var(--text-secondary)',
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
