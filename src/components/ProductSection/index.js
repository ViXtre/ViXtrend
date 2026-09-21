'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { getEffectById } from '@/lib/effects';
import styles from './ProductSection.module.css';

export default function ProductSection({ product, overrideLang, isPreview = false }) {
  const { lang: contextLang } = useLang();
  const lang = overrideLang || contextLang || 'bg';

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!product) return null;

  const effectDef = getEffectById(product.animationEffect);
  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[activeImgIndex] || images[0] || null;

  const title = product.title?.[lang] || product.title?.bg || product.title?.en || 'Без заглавие';
  const desc = product.description?.[lang] || product.description?.bg || product.description?.en || '';
  const badgeText = product.badge?.[`text_${lang}`] || product.badge?.text_bg || product.badge?.text_en || product.badge?.text;
  const badgeColor = product.badge?.color || '#26d0b2';
  const features = product.features?.[lang] || product.features?.bg || product.features?.en || [];

  return (
    <section className={`${styles.section} ${effectDef.cardClass || ''}`} id={`product-${product.id || 'preview'}`}>
      <div className={`${styles.container} effect-3d-inner`}>
        
        {/* Left Column: Media / Images */}
        <div className={`${styles.mediaCol} effect-left-col`}>
          <div className={styles.mainImageWrap}>
            {currentImage ? (
              <img
                src={currentImage}
                alt={title}
                className={styles.mainImg}
              />
            ) : (
              <div className={styles.placeholderImg}>
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>{lang === 'bg' ? 'Няма качено изображение' : 'No image uploaded'}</span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.thumbnails}>
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImgIndex(idx)}
                  className={`${styles.thumbnailBtn} ${activeImgIndex === idx ? styles.thumbnailBtnActive : ''}`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className={styles.thumbImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Content & Pricing */}
        <div className={`${styles.contentCol} effect-right-col`}>
          <div className={styles.headerRow}>
            {badgeText && (
              <span
                className={styles.badge}
                style={{
                  background: `${badgeColor}18`,
                  border: `1px solid ${badgeColor}40`,
                  color: badgeColor,
                }}
              >
                {badgeText}
              </span>
            )}
            {product.displayOrder !== undefined && (
              <span className={styles.orderBadge}>#{product.displayOrder}</span>
            )}
          </div>

          <h2 className={styles.title}>{title}</h2>
          
          {desc && <p className={styles.desc}>{desc}</p>}

          {features.length > 0 && (
            <ul className={styles.featuresList}>
              {features.map((feat, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}

          {product.price?.amount && (
            <div className={styles.pricingBox}>
              <span className={styles.priceLabel}>{lang === 'bg' ? 'Цена:' : 'Price:'}</span>
              <span className={styles.priceValue}>{product.price.amount}</span>
              {product.price[`period_${lang}`] && (
                <span className={styles.pricePeriod}>{product.price[`period_${lang}`]}</span>
              )}
            </div>
          )}

          <div className={styles.actions}>
            {product.productUrl && (
              <a
                href={product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.visitBtn}
              >
                <span>
                  {product.productUrlText?.[lang] || (lang === 'bg' ? 'Отвори Продукта ↗' : 'Visit Product ↗')}
                </span>
              </a>
            )}

            {product.demoUrl && !product.productUrl && (
              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.visitBtn}
              >
                <span>{lang === 'bg' ? 'Отвори Демо ↗' : 'Live Demo ↗'}</span>
              </a>
            )}

            {product.demoUrl && product.productUrl && (
              <a
                href={product.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.demoBtn}
              >
                <span>{lang === 'bg' ? 'Демо ↗' : 'Demo ↗'}</span>
              </a>
            )}

            <Link href="/services" className={styles.ctaBtn}>
              <span>{product.ctaText?.[lang] || (lang === 'bg' ? 'Искай Оферта' : 'Request Quote')}</span>
              <span>→</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
