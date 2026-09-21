'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLang } from '@/context/LanguageContext';
import ProductSection from '@/components/ProductSection';
import styles from './products.module.css';

export default function ProductsPage() {
  const { lang } = useLang();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublishedProducts() {
      try {
        const q = query(
          collection(db, 'products'),
          where('status', '==', 'published')
        );
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Sort by displayOrder ascending
        list.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
        setProducts(list);
      } catch (err) {
        console.error('Error fetching published products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPublishedProducts();
  }, []);

  return (
    <div className={styles.productsPage}>
      
      {/* 1. Header Banner */}
      <header className={styles.headerSection}>
        <div className={styles.headerContent}>
          <span className={styles.badge}>
            {lang === 'bg' ? 'Софтуерни Продукти' : 'Software Products'}
          </span>
          <h1 className={styles.title}>
            {lang === 'bg' ? (
              <>Решения, създадени за <span className="grad-text">Вашия растеж</span></>
            ) : (
              <>Solutions crafted for <span className="grad-text">Your Growth</span></>
            )}
          </h1>
          <p className={styles.subtitle}>
            {lang === 'bg'
              ? 'Специализирани системи и софтуерни инструменти от ViXtrend. Всеки продукт е завършен, оптимизиран и готов за незабавна интеграция.'
              : 'Specialized systems and software tools engineered by ViXtrend. Every product is complete, optimized, and ready for immediate deployment.'}
          </p>

          <div className={styles.scrollHint}>
            <span>{lang === 'bg' ? 'Разгледайте продуктите по-долу' : 'Explore the products below'}</span>
            <span>↓</span>
          </div>
        </div>
      </header>

      {/* 2. Full-Screen Products List */}
      {loading ? (
        <div className={styles.loadingWrap}>
          <p>{lang === 'bg' ? 'Зареждане на продукти...' : 'Loading products...'}</p>
        </div>
      ) : products.length === 0 ? (
        <div className={styles.emptyWrap}>
          <div className={styles.emptyIcon}>⬡</div>
          <h2>{lang === 'bg' ? 'Очаквайте скоро нови продукти' : 'New products coming soon'}</h2>
          <p style={{ marginTop: '8px', maxWidth: '400px' }}>
            {lang === 'bg'
              ? 'В момента подготвяме следващото поколение софтуерни разширения.'
              : 'We are currently preparing the next generation of business extensions.'}
          </p>
        </div>
      ) : (
        <div className={styles.sectionsWrap}>
          {products.map((prod) => (
            <ProductSection key={prod.id} product={prod} />
          ))}
        </div>
      )}

    </div>
  );
}
