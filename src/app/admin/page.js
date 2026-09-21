'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function AdminHomePage() {
  const { user } = useAuth();
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const snap = await getDocs(collection(db, 'products'));
        setProductCount(snap.size);
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Добре дошли в Административния Панел
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Управлявайте съдържанието, продуктите и визуализациите на ViXtrend.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
      }}>
        {/* Card 1: Products */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>📦</div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Продукти</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>
              Общо качени продукти във ViXtrend.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--teal)' }}>
              {loading ? '...' : productCount}
            </span>
            <Link
              href="/admin-products"
              style={{
                padding: '8px 14px',
                background: 'rgba(38, 208, 178, 0.1)',
                border: '1px solid rgba(38, 208, 178, 0.3)',
                borderRadius: '8px',
                color: 'var(--teal)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Управление →
            </Link>
          </div>
        </div>

        {/* Card 2: Add New */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>✨</div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Добавяне на Продукт</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>
              2-етапен процес: Данни + Снимки и Live Preview.
            </p>
          </div>
          <div>
            <Link
              href="/admin-products/new"
              style={{
                display: 'inline-block',
                width: '100%',
                textAlign: 'center',
                padding: '10px 16px',
                background: 'var(--grad)',
                borderRadius: '8px',
                color: '#0d1b2a',
                fontSize: '0.9rem',
                fontWeight: 700,
              }}
            >
              + Създай Нов Продукт
            </Link>
          </div>
        </div>

        {/* Card 3: Admin Info */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '24px',
        }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>🛡️</div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Сигурност</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '12px' }}>
            Влезли сте като: <strong style={{ color: 'var(--text-primary)' }}>{user?.email}</strong>
          </p>
          <div style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(168, 224, 106, 0.15)',
            border: '1px solid rgba(168, 224, 106, 0.3)',
            color: 'var(--green)',
            fontSize: '0.78rem',
            fontWeight: 700,
          }}>
            Роля: ADMIN (Активен)
          </div>
        </div>
      </div>
    </div>
  );
}
