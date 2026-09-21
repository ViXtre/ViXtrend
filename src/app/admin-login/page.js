'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './admin-login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const {
    user,
    role,
    isAdmin,
    loading,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    refreshProfile,
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already admin, redirect to /admin-products immediately
  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.replace('/admin-products');
    }
  }, [user, isAdmin, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Невалиден имейл или парола.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Този имейл адрес вече е регистриран.');
      } else if (err.code === 'auth/weak-password') {
        setError('Паролата трябва да е поне 6 символа.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Моля, въведете валиден имейл адрес.');
      } else {
        setError(err.message || 'Възникна грешка при автентикация.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google auth error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Грешка при вход с Google.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ textAlign: 'center', padding: '50px 20px' }}>
          <div className={styles.badge}>Система за сигурност</div>
          <p className={styles.subtitle}>Проверка на права за достъп...</p>
        </div>
      </div>
    );
  }

  // If logged in but role is NOT admin (role === 'user')
  if (user && !isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.pendingCard}>
            <div className={styles.pendingIcon}>⏳</div>
            <h1 className={styles.pendingTitle}>Очаква одобрение</h1>
            <p className={styles.pendingDesc}>
              Вашият акаунт е регистриран успешно, но има роля <strong>&quot;user&quot;</strong>.
              <br />
              За достъп до панела е необходимо главният администратор да промени ролята на <strong>&quot;admin&quot;</strong> в Firestore.
            </p>

            <div className={styles.userBadge}>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>UID:</strong> {user.uid}</div>
            </div>

            <div className={styles.actionBtns}>
              <button
                className={styles.refreshBtn}
                onClick={() => refreshProfile()}
              >
                Провери отново
              </button>
              <button
                className={styles.logoutBtn}
                onClick={() => logout()}
              >
                Изход
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.badge}>Скрит Портал</div>
          <h1 className={styles.title}>ViXtrend Admin</h1>
          <p className={styles.subtitle}>Вход в системата за управление</p>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Вход
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Регистрация
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Имейл адрес</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vixtrend.com"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Парола</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={styles.submitBtn}
          >
            {submitting ? 'Зареждане...' : mode === 'login' ? 'Вход в панела' : 'Създай акаунт'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>ИЛИ</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={submitting}
          className={styles.googleBtn}
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.6 3.6 1.7 7.4l3.7 2.9C6.3 7.3 8.9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
            <path fill="#FBBC05" d="M5.4 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.7 7.2C.6 9.4 0 11.9 0 14.5s.6 5.1 1.7 7.3l3.7-2.9z" />
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.7-2.3-6.6-5.3L1.7 16.9C3.6 20.7 7.4 24 12 24z" />
          </svg>
          Продължи с Google
        </button>
      </div>
    </div>
  );
}
