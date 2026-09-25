'use client';

import { useState }           from 'react';
import Link                   from 'next/link';
import { useLang }            from '@/context/LanguageContext';
import { Reveal }             from '@/components/shared/Reveal';
import { getEffectById }      from '@/lib/effects';
import styles                 from './ProductSection.module.css';

/* Малка SVG точка — замества &bull; */
const Dot = () => (
  <svg viewBox="0 0 6 6" width="6" height="6" style={{ flexShrink: 0, marginTop: '7px' }}>
    <circle cx="3" cy="3" r="2.5" fill="var(--teal)" />
  </svg>
);

export default function ProductSection({ product, overrideLang, isPreview = false }) {
  const { lang: contextLang } = useLang();
  const lang = overrideLang || contextLang || 'bg';

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!product) return null;

  const effectDef    = getEffectById(product.animationEffect);
  const images       = product.images?.length > 0 ? product.images : [];
  const currentImage = images[activeImgIndex] || images[0] || null;

  const title     = product.title?.[lang]       || product.title?.bg       || product.title?.en       || 'Без заглавие';
  const desc      = product.description?.[lang] || product.description?.bg || product.description?.en || '';
  const badgeText = product.badge?.[`text_${lang}`] || product.badge?.text_bg || product.badge?.text_en || product.badge?.text;
  const badgeColor = product.badge?.color || '#26d0b2';
  const features  = product.features?.[lang]    || product.features?.bg    || product.features?.en    || [];

  return (
    <section
      className={`${styles.section} ${effectDef.cardClass || ''}`}
      id={`product-${product.id || 'preview'}`}
    >
      <div className={`${styles.container} effect-3d-inner`}>

        {/* ── Left: Media ── */}
        <Reveal from="left" delay={100}>
          <div className={`${styles.mediaCol} effect-left-col`}>
            <div className={styles.mainImageWrap}>
              {currentImage ? (
                <img src={currentImage} alt={title} className={styles.mainImg} />
              ) : (
                <div className={styles.placeholderImg}>
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none"
                       stroke="currentColor" strokeWidth="1.5">
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
        </Reveal>

        {/* ── Right: Content ── */}
        <Reveal from="right" delay={200}>
          <div className={`${styles.contentCol} effect-right-col`}>

            {/* Badges row */}
            <div className={styles.headerRow}>
              {product.category && (
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  padding: '3px 10px', borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  {product.category === 'website'   ? (lang === 'bg' ? 'Уебсайт'    : 'Website')   :
                   product.category === 'tool'      ? (lang === 'bg' ? 'Инструмент' : 'Tool')      :
                   product.category === 'ecommerce' ? (lang === 'bg' ? 'Е-Магазин'  : 'E-Commerce'):
                   product.category === 'saas'      ? 'SaaS' : product.category}
                </span>
              )}
              {badgeText && (
                <span
                  className={styles.badge}
                  style={{
                    background: `${badgeColor}18`,
                    border:     `1px solid ${badgeColor}40`,
                    color:       badgeColor,
                  }}
                >
                  {badgeText}
                </span>
              )}
              {product.displayOrder !== undefined && (
                <span className={styles.orderBadge}>#{product.displayOrder}</span>
              )}
            </div>

            {/* Title */}
            <h2 className={styles.title}>{title}</h2>

            {/* Description */}
            {desc && <p className={styles.desc}>{desc}</p>}

            {/* Features — SVG dot вместо &bull; */}
            {features.length > 0 && (
              <ul className={styles.featuresList}>
                {features.map((feat, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <Dot />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Price */}
            {product.price?.amount && (
              <div className={styles.pricingBox}>
                <span className={styles.priceLabel}>{lang === 'bg' ? 'Цена:' : 'Price:'}</span>
                <span className={styles.priceValue}>{product.price.amount}</span>
                {product.price[`period_${lang}`] && (
                  <span className={styles.pricePeriod}>{product.price[`period_${lang}`]}</span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className={styles.actions}>
              {product.productUrl && (
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.visitBtn}
                >
                  {product.productUrlText?.[lang] || (lang === 'bg' ? 'Отвори Продукта' : 'Visit Product')} &rarr;
                </a>
              )}
              {product.demoUrl && !product.productUrl && (
                <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.visitBtn}>
                  {lang === 'bg' ? 'Отвори Демо' : 'Live Demo'} &rarr;
                </a>
              )}
              {product.demoUrl && product.productUrl && (
                <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.demoBtn}>
                  {lang === 'bg' ? 'Демо' : 'Demo'} &rarr;
                </a>
              )}
              <Link href="/services" className={styles.ctaBtn}>
                {product.ctaText?.[lang] || (lang === 'bg' ? 'Искай Оферта' : 'Request Quote')} &rarr;
              </Link>
            </div>

          </div>
        </Reveal>

      </div>
    </section>
  );
}
