'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getEffectById } from '@/lib/effects';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // Sort by displayOrder ascending
      list.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
      setProducts(list);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStatus = async (productId, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await updateDoc(doc(db, 'products', productId), {
        status: nextStatus,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: nextStatus } : p))
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (productId, title) => {
    if (!confirm(`Сигурни ли сте, че искате да изтриете "${title || 'този продукт'}"?`)) {
      return;
    }

    setDeletingId(productId);
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Error deleting product:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 20px 80px' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Управление на Продукти
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Преглед, подреждане, редакция и добавяне на нови продукти в сайта.
          </p>
        </div>

        <Link
          href="/admin-products/new"
          style={{
            padding: '11px 22px',
            background: 'var(--grad)',
            color: '#0d1b2a',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.92rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(38, 208, 178, 0.25)',
          }}
        >
          <span>✨</span>
          <span>Добави Нов Продукт</span>
        </Link>
      </div>

      {/* Product List */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-secondary)',
          background: 'var(--bg-secondary)',
          borderRadius: '14px',
          border: '1px solid var(--border)',
        }}>
          Зареждане на продукти...
        </div>
      ) : products.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          border: '1px dashed var(--border)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📦</div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Няма добавени продукти</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Все още няма създадени продукти в базата данни.
          </p>
          <Link
            href="/admin-products/new"
            style={{
              padding: '10px 20px',
              background: 'var(--grad)',
              color: '#0d1b2a',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.88rem',
            }}
          >
            + Добавете първия продукт
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {products.map((product) => {
            const effectDef = getEffectById(product.animationEffect);
            const thumb = product.images?.[0] || null;
            const titleBg = product.title?.bg || product.title?.en || 'Без име';

            return (
              <div
                key={product.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  flexWrap: 'wrap',
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* Left: Thumbnail & Main Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px', flex: 1 }}>
                  
                  {/* Order Badge */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--teal)',
                  }}>
                    #{product.displayOrder || 1}
                  </div>

                  {/* Image Thumb */}
                  <div style={{
                    width: '64px',
                    height: '48px',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {thumb ? (
                      <img src={thumb} alt={titleBg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>No img</span>
                    )}
                  </div>

                  {/* Title & Badge */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Link
                        href={`/admin-products/${product.id}`}
                        style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}
                      >
                        {titleBg}
                      </Link>
                      {product.badge?.text_bg && (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: `${product.badge.color || '#26d0b2'}18`,
                          border: `1px solid ${product.badge.color || '#26d0b2'}40`,
                          color: product.badge.color || '#26d0b2',
                        }}>
                          {product.badge.text_bg}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Ефект: <strong>{effectDef.name_bg.split(' (')[0]}</strong></span>
                      {product.price?.amount && (
                        <span>• Цена: <strong>{product.price.amount}</strong></span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right: Status & Action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  
                  {/* Status toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(product.id, product.status)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: product.status === 'published' ? 'rgba(38, 208, 178, 0.12)' : 'rgba(245, 197, 24, 0.12)',
                      color: product.status === 'published' ? 'var(--teal)' : '#f5c518',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    title="Кликнете за смяна на статуса"
                  >
                    {product.status === 'published' ? '🟢 Публикуван' : '🟡 Чернова'}
                  </button>

                  {/* View / Edit Link */}
                  <Link
                    href={`/admin-products/${product.id}`}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    👁️ Преглед / Редакция
                  </Link>

                  {/* Delete Button */}
                  <button
                    type="button"
                    disabled={deletingId === product.id}
                    onClick={() => handleDelete(product.id, titleBg)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 77, 77, 0.1)',
                      border: '1px solid rgba(255, 77, 77, 0.25)',
                      color: '#ff6b6b',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {deletingId === product.id ? '...' : '🗑️'}
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
