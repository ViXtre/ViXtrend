'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLang } from '@/context/LanguageContext';
import ProductSection from '@/components/ProductSection';
import styles from './products.module.css';

export default function ProductsPage() {
  const { lang } = useLang();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

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

  const filterOptions = [
    { key: 'all', label_bg: 'Всички проекти', label_en: 'All Projects' },
    { key: 'website', label_bg: 'Уебсайтове', label_en: 'Websites' },
    { key: 'tool', label_bg: 'Инструменти & Софтуер', label_en: 'Tools & Software' },
    { key: 'ecommerce', label_bg: 'Е-Магазини', label_en: 'E-Commerce' },
  ];

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter((p) => (p.category || 'website') === activeFilter);

  return (
    <div className={styles.productsPage}>
      
      {/* 1. Header Banner */}
      <header className={styles.headerSection}>
        <div className={styles.headerContent}>
          <span className={styles.badge}>
            <span>{lang === 'bg' ? 'Дигитализация на Бизнеса' : 'Business Digitalization'}</span>
          </span>

          <h1 className={styles.title}>
            {lang === 'bg' ? (
              <>Сайтове & Продукти, изградени за <span className="grad-text">Вашия бизнес</span></>
            ) : (
              <>Websites & Products built for <span className="grad-text">Your Business</span></>
            )}
          </h1>

          <p className={styles.subtitle}>
            {lang === 'bg'
              ? 'Дигитализираме бизнеса Ви от край до край — от модерни фирмени уебсайтове и онлайн платформи до персонализирани софтуерни инструменти, създадени специално за Вашите специфични нужди.'
              : 'We digitalize your business end-to-end — from high-performance websites and digital platforms to custom-tailored software tools engineered for your specific business workflow.'}
          </p>

          {/* Pillars Row */}
          <div className={styles.pillarsRow}>
            <div className={styles.pillarBadge}>
              <span>{lang === 'bg' ? 'Бизнес Сайтове & Платформи' : 'Business Websites & Platforms'}</span>
            </div>
            <div className={styles.pillarBadge}>
              <span>{lang === 'bg' ? 'Персонализирани Инструменти' : 'Custom Business Tools'}</span>
            </div>
            <div className={styles.pillarBadge}>
              <span>{lang === 'bg' ? '100% Client-Owned Код' : '100% Client-Owned Code'}</span>
            </div>
          </div>

          {/* Category Filter Bar */}
          {products.length > 0 && (
            <div className={styles.filterBar}>
              {filterOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setActiveFilter(opt.key)}
                  className={`${styles.filterBtn} ${activeFilter === opt.key ? styles.filterBtnActive : ''}`}
                >
                  {opt[`label_${lang}`] || opt.label_bg}
                </button>
              ))}
            </div>
          )}

          <div className={styles.scrollHint}>
            <span>{lang === 'bg' ? 'Разгледайте проектите по-долу' : 'Explore projects below'}</span>
            <span>&darr;</span>
          </div>
        </div>
      </header>

      {/* 2. Full-Screen Products & Websites List */}
      {loading ? (
        <div className={styles.loadingWrap}>
          <p>{lang === 'bg' ? 'Зареждане на проектите...' : 'Loading projects...'}</p>
        </div>
      ) : products.length === 0 ? (
        <div className={styles.emptyWrap}>
          <div className={styles.emptyCard}>
            <h2 className={styles.emptyTitle}>
              {lang === 'bg' ? 'Дигиталните Ни Проекти Се Подготвят' : 'Our Digital Projects Are Being Prepared'}
            </h2>
            <p className={styles.emptyDesc}>
              {lang === 'bg'
                ? 'В момента добавяме разработените от нас клиентски сайтове и софтуерни инструменти в базата данни. Очаквайте ги скоро тук!'
                : 'We are currently adding our client websites and custom business software tools to the database. Check back very soon!'}
            </p>
            <div className={styles.emptyActions}>
              <Link href="/services" className={styles.emptyCta}>
                {lang === 'bg' ? 'Искай Оферта за Твоя Сайт' : 'Request Quote for Your Site'} &rarr;
              </Link>
              <Link href="/tools" className={styles.emptySecondary}>
                {lang === 'bg' ? 'Инструменти' : 'Tools'}
              </Link>
            </div>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.emptyWrap}>
          <div className={styles.emptyCard}>
            <p className={styles.emptyDesc}>
              {lang === 'bg' ? 'Няма намерени проекти в тази категория.' : 'No projects found in this category.'}
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={styles.emptyCta}
            >
              {lang === 'bg' ? 'Покажи всички' : 'Show all'}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.sectionsWrap}>
          {filteredProducts.map((prod) => (
            <ProductSection key={prod.id} product={prod} />
          ))}
        </div>
      )}

    </div>
  );
}
