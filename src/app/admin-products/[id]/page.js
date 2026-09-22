'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getEffectById } from '@/lib/effects';
import ProductForm from '@/components/ProductForm';
import ProductSection from '@/components/ProductSection';

export default function ProductDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [previewLang, setPreviewLang] = useState('bg');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const snap = await getDoc(doc(db, 'products', productId));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '60px auto', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Зареждане на детайлите за проекта...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '30px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <h2>Продуктът не е намерен</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>Възможно е продуктът да е бил изтрит.</p>
        <Link href="/admin-products" style={{ padding: '10px 20px', background: 'var(--grad)', color: '#0d1b2a', borderRadius: '8px', fontWeight: 700 }}>
          &larr; Всички проекти
        </Link>
      </div>
    );
  }

  // If in Edit Mode, show the 2-Stage ProductForm
  if (isEditing) {
    return (
      <div>
        <div style={{ maxWidth: '1000px', margin: '20px auto 0', padding: '0 20px' }}>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              padding: '6px 14px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            &larr; Откажи Редакцията (Обратно към Преглед)
          </button>
        </div>
        <ProductForm initialData={product} productId={productId} />
      </div>
    );
  }

  const effectDef = getEffectById(product.animationEffect);

  // View / Info Mode
  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '36px 20px 80px' }}>
      
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            href="/admin-products"
            style={{
              padding: '8px 14px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
            }}
          >
            &larr; Всички проекти
          </Link>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {product.title?.bg || product.title?.en || 'Детайли за проекта'}
          </h1>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          style={{
            padding: '11px 24px',
            background: 'var(--grad)',
            color: '#0d1b2a',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.92rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(38, 208, 178, 0.25)',
          }}
        >
          Редактирай Продукта
        </button>
      </div>

      {/* Information Overview Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        
        {/* Info Card 1: Main Data */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--teal)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            Основна Информация
          </h3>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Заглавие (BG):</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{product.title?.bg || '—'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Заглавие (EN):</div>
            <div style={{ fontWeight: 600 }}>{product.title?.en || '—'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Описание (BG):</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {product.description?.bg || '—'}
            </div>
          </div>
        </div>

        {/* Info Card 2: Settings & Animation */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--teal)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            Настройки & Ефекти
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Пореден номер (#):</span>
            <strong style={{ color: 'var(--teal)' }}>#{product.displayOrder || 1}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Категория:</span>
            <strong>
              {product.category === 'website' ? 'Уебсайт' :
               product.category === 'tool' ? 'Бизнес Инструмент' :
               product.category === 'ecommerce' ? 'Е-Магазин' :
               product.category === 'saas' ? 'SaaS' : (product.category || 'Уебсайт')}
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Бадж:</span>
            {product.badge?.text_bg ? (
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '8px',
                background: `${product.badge.color || '#26d0b2'}18`,
                border: `1px solid ${product.badge.color || '#26d0b2'}40`,
                color: product.badge.color || '#26d0b2',
              }}>
                {product.badge.text_bg}
              </span>
            ) : '—'}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Анимационен Ефект:</span>
            <strong>{effectDef.name_bg}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Статус:</span>
            <span>{product.status === 'published' ? 'Публикуван' : 'Чернова'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Цена:</span>
            <strong style={{ color: 'var(--green)' }}>
              {product.price?.amount ? `${product.price.amount} ${product.price.period_bg || ''}` : 'По запитване'}
            </strong>
          </div>

          {product.productUrl && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Линк към проект:</span>
              <a
                href={product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--teal)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'underline' }}
              >
                Отвори сайта &rarr;
              </a>
            </div>
          )}
        </div>

      </div>

      {/* Live Preview of the exact full-screen rendering */}
      <div style={{ marginTop: '40px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            Предварителен Преглед (Full-Screen Preview)
          </h2>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setPreviewLang('bg')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: previewLang === 'bg' ? 'var(--grad)' : 'var(--bg-secondary)',
                color: previewLang === 'bg' ? '#0d1b2a' : 'var(--text-primary)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              BG
            </button>
            <button
              onClick={() => setPreviewLang('en')}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: previewLang === 'en' ? 'var(--grad)' : 'var(--bg-secondary)',
                color: previewLang === 'en' ? '#0d1b2a' : 'var(--text-primary)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              EN
            </button>
          </div>
        </div>

        <div style={{
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        }}>
          <ProductSection product={product} overrideLang={previewLang} isPreview={true} />
        </div>
      </div>

    </div>
  );
}
