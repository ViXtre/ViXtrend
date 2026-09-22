'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { EFFECTS } from '@/lib/effects';
import ProductSection from '@/components/ProductSection';
import styles from './ProductForm.module.css';

const BADGE_COLORS = [
  { label: 'Cyan / Teal', value: '#26d0b2' },
  { label: 'Neon Green', value: '#a8e06a' },
  { label: 'Gold / Amber', value: '#f5c518' },
  { label: 'Purple / Violet', value: '#9d4edd' },
  { label: 'Coral / Red', value: '#ff6b6b' },
];

export default function ProductForm({ initialData = null, productId = null }) {
  const router = useRouter();

  // Stage 1 = Form & Upload, Stage 2 = Live Preview
  const [stage, setStage] = useState(1);
  const [previewLang, setPreviewLang] = useState('bg');
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title_bg: initialData?.title?.bg || '',
    title_en: initialData?.title?.en || '',
    desc_bg: initialData?.description?.bg || '',
    desc_en: initialData?.description?.en || '',
    displayOrder: initialData?.displayOrder ?? 1,
    badge_bg: initialData?.badge?.text_bg || initialData?.badge?.text || 'Нов',
    badge_en: initialData?.badge?.text_en || 'New',
    badge_color: initialData?.badge?.color || '#26d0b2',
    category: initialData?.category || 'website',
    animationEffect: initialData?.animationEffect || 'fade-up',
    price_amount: initialData?.price?.amount || '',
    price_period_bg: initialData?.price?.period_bg || '',
    price_period_en: initialData?.price?.period_en || '',
    productUrl: initialData?.productUrl || '',
    productUrlText_bg: initialData?.productUrlText?.bg || 'Отвори Продукта',
    productUrlText_en: initialData?.productUrlText?.en || 'Visit Product',
    demoUrl: initialData?.demoUrl || '',
    status: initialData?.status || 'published',
    images: initialData?.images || [],
    features_bg: initialData?.features?.bg || [''],
    features_en: initialData?.features?.en || [''],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Image Upload to Firebase Storage
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingImg(true);
    setErrorMsg('');

    try {
      const uploadedUrls = [];
      for (const file of files) {
        const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const storageRef = ref(storage, `products/${uniqueName}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err) {
      console.error('Storage upload error:', err);
      setErrorMsg('Грешка при качване на снимката в Storage. Проверете Storage правилата.');
    } finally {
      setUploadingImg(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Format product object for saving & preview
  const formattedProduct = {
    id: productId || 'preview',
    displayOrder: Number(formData.displayOrder) || 1,
    title: {
      bg: formData.title_bg,
      en: formData.title_en,
    },
    description: {
      bg: formData.desc_bg,
      en: formData.desc_en,
    },
    badge: {
      text_bg: formData.badge_bg,
      text_en: formData.badge_en,
      color: formData.badge_color,
    },
    category: formData.category || 'website',
    animationEffect: formData.animationEffect,
    price: {
      amount: formData.price_amount,
      period_bg: formData.price_period_bg,
      period_en: formData.price_period_en,
    },
    productUrl: formData.productUrl,
    productUrlText: {
      bg: formData.productUrlText_bg || 'Отвори Продукта',
      en: formData.productUrlText_en || 'Visit Product',
    },
    demoUrl: formData.demoUrl,
    status: formData.status,
    images: formData.images,
    features: {
      bg: formData.features_bg.filter((f) => f.trim().length > 0),
      en: formData.features_en.filter((f) => f.trim().length > 0),
    },
  };

  // Save to Firestore
  const handleSave = async () => {
    if (!formData.title_bg && !formData.title_en) {
      setErrorMsg('Моля въведете заглавие на продукта.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const docPayload = {
        displayOrder: Number(formData.displayOrder) || 1,
        category: formData.category || 'website',
        title: {
          bg: formData.title_bg || '',
          en: formData.title_en || '',
        },
        description: {
          bg: formData.desc_bg || '',
          en: formData.desc_en || '',
        },
        badge: {
          text_bg: formData.badge_bg || '',
          text_en: formData.badge_en || '',
          color: formData.badge_color || '#26d0b2',
        },
        animationEffect: formData.animationEffect || 'fade-up',
        price: {
          amount: formData.price_amount || '',
          period_bg: formData.price_period_bg || '',
          period_en: formData.price_period_en || '',
        },
        productUrl: formData.productUrl || '',
        productUrlText: {
          bg: formData.productUrlText_bg || 'Отвори Продукта',
          en: formData.productUrlText_en || 'Visit Product',
        },
        demoUrl: formData.demoUrl || '',
        status: formData.status || 'published',
        images: formData.images || [],
        features: {
          bg: formData.features_bg.filter((f) => f.trim().length > 0),
          en: formData.features_en.filter((f) => f.trim().length > 0),
        },
        updatedAt: serverTimestamp(),
      };

      if (productId) {
        // Edit existing product
        await setDoc(doc(db, 'products', productId), docPayload, { merge: true });
      } else {
        // Create new product
        docPayload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), docPayload);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        router.push('/admin-products');
      }, 1000);
    } catch (err) {
      console.error('Firestore save error:', err);
      setErrorMsg('Възникна грешка при запис във Firestore: ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header & Stage Switcher */}
      <div className={styles.topBar}>
        <div className={styles.titleArea}>
          <h1>{productId ? 'Редактиране на Продукт' : 'Добавяне на Нов Продукт'}</h1>
          <p>Попълнете данните, изберете анимационен ефект и вижте Live Preview.</p>
        </div>

        <div className={styles.stageToggle}>
          <button
            type="button"
            className={`${styles.stageBtn} ${stage === 1 ? styles.stageBtnActive : ''}`}
            onClick={() => setStage(1)}
          >
            <span>Етап 1: Данни & Снимки</span>
          </button>
          <button
            type="button"
            className={`${styles.stageBtn} ${stage === 2 ? styles.stageBtnActive : ''}`}
            onClick={() => setStage(2)}
          >
            <span>Етап 2: Live Preview</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div style={{
          padding: '12px 18px',
          background: 'rgba(255, 77, 77, 0.12)',
          border: '1px solid rgba(255, 77, 77, 0.3)',
          borderRadius: '10px',
          color: '#ff6b6b',
          marginBottom: '20px',
          fontSize: '0.9rem',
        }}>
          {errorMsg}
        </div>
      )}

      {saveSuccess && (
        <div style={{
          padding: '14px 18px',
          background: 'rgba(38, 208, 178, 0.15)',
          border: '1px solid rgba(38, 208, 178, 0.4)',
          borderRadius: '10px',
          color: 'var(--teal)',
          marginBottom: '20px',
          fontWeight: 700,
        }}>
          Продуктът беше записан успешно! Пренасочване...
        </div>
      )}

      {/* STAGE 1: FORM INPUTS */}
      {stage === 1 && (
        <div className={styles.formCard}>
          
          {/* 1. Заглавия и Описания (BG & EN) */}
          <div className={styles.sectionGroup}>
            <div className={styles.sectionHeader}>
              <h3>1. Заглавия и Описания</h3>
              <span>Двуезичност (BG / EN)</span>
            </div>

            <div className={styles.grid2}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span>Заглавие (Български) *</span>
                  <small style={{ color: 'var(--teal)' }}>BG</small>
                </label>
                <input
                  type="text"
                  required
                  placeholder="напр. AI Automation Suite"
                  value={formData.title_bg}
                  onChange={(e) => handleInputChange('title_bg', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span>Заглавие (English)</span>
                  <small style={{ color: 'var(--green)' }}>EN</small>
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI Automation Suite"
                  value={formData.title_en}
                  onChange={(e) => handleInputChange('title_en', e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span>Описание (Български)</span>
                  <small style={{ color: 'var(--teal)' }}>BG</small>
                </label>
                <textarea
                  placeholder="Кратко и въздействащо представяне на продукта..."
                  value={formData.desc_bg}
                  onChange={(e) => handleInputChange('desc_bg', e.target.value)}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span>Описание (English)</span>
                  <small style={{ color: 'var(--green)' }}>EN</small>
                </label>
                <textarea
                  placeholder="Short impactful presentation of the product..."
                  value={formData.desc_en}
                  onChange={(e) => handleInputChange('desc_en', e.target.value)}
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>

          {/* 2. Качване на Снимки във Firebase Storage */}
          <div className={styles.sectionGroup}>
            <div className={styles.sectionHeader}>
              <h3>2. Изображения на Продукта</h3>
              <span>Firebase Storage</span>
            </div>

            <label className={styles.uploadZone}>
              <input
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
                disabled={uploadingImg}
              />
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {uploadingImg ? 'Качване в Storage...' : 'Кликнете или плъзнете снимки тук'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                PNG, JPG, WebP (Снимките се съхраняват директно във Вашия Firebase Storage bucket)
              </div>
            </label>

            {formData.images.length > 0 && (
              <div className={styles.uploadedImagesGrid}>
                {formData.images.map((imgUrl, i) => (
                  <div key={i} className={styles.uploadedImageCard}>
                    <img src={imgUrl} alt={`Uploaded ${i + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className={styles.deleteImgBtn}
                      title="Премахни снимката"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Библиотека с Анимационни Ефекти */}
          <div className={styles.sectionGroup}>
            <div className={styles.sectionHeader}>
              <h3>3. Визуален Анимационен Ефект</h3>
              <span>effects.js Library</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Изберете как ще се появява пълноекранната секция на продукта при скрол:
            </p>

            <div className={styles.effectsGrid}>
              {EFFECTS.map((eff) => (
                <div
                  key={eff.id}
                  onClick={() => handleInputChange('animationEffect', eff.id)}
                  className={`${styles.effectCard} ${formData.animationEffect === eff.id ? styles.effectCardSelected : ''}`}
                >
                  <div className={styles.effectCardHeader}>
                    <span className={styles.effectTitle}>{eff.name_bg}</span>
                    <span className={styles.effectBadge}>{eff.badge}</span>
                  </div>
                  <div className={styles.effectDesc}>{eff.desc_bg}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Бадж, Подредба, Категория и Статус */}
          <div className={styles.sectionGroup}>
            <div className={styles.sectionHeader}>
              <h3>4. Бадж, Подредба & Статус</h3>
              <span>Организация</span>
            </div>

            <div className={styles.grid3}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Текст на Бадж (BG)</label>
                <input
                  type="text"
                  placeholder="напр. Нов, В процес, HOT"
                  value={formData.badge_bg}
                  onChange={(e) => handleInputChange('badge_bg', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Текст на Бадж (EN)</label>
                <input
                  type="text"
                  placeholder="e.g. New, In Progress, HOT"
                  value={formData.badge_en}
                  onChange={(e) => handleInputChange('badge_en', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Цвят на Баджа</label>
                <select
                  value={formData.badge_color}
                  onChange={(e) => handleInputChange('badge_color', e.target.value)}
                  className={styles.select}
                >
                  {BADGE_COLORS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.grid3}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span>Пореден Номер (Подредба)</span>
                  <small style={{ color: 'var(--teal)' }}># в листата</small>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.displayOrder}
                  onChange={(e) => handleInputChange('displayOrder', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Тип Проект / Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={styles.select}
                >
                  <option value="website">Уебсайт / Фирмена Платформа</option>
                  <option value="tool">Бизнес Инструмент / Софтуер</option>
                  <option value="ecommerce">Онлайн Магазин (E-Commerce)</option>
                  <option value="saas">SaaS / Уеб Приложение</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Статус на Публикацията</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={styles.select}
                >
                  <option value="published">Публикуван (Видим в /products)</option>
                  <option value="draft">Чернова (Скрит)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. Линк към Продукта / Сайта */}
          <div className={styles.sectionGroup}>
            <div className={styles.sectionHeader}>
              <h3>5. Линк към Продукта / Сайта</h3>
              <span>Активен бутон за пренасочване</span>
            </div>

            <div className={styles.grid2}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span>Директен Линк към Продукта / Сайта (URL)</span>
                  <small style={{ color: 'var(--teal)' }}>Главен Линк</small>
                </label>
                <input
                  type="url"
                  placeholder="https://app.vixtrend.com или https://myproduct.com"
                  value={formData.productUrl}
                  onChange={(e) => handleInputChange('productUrl', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span>Допълнителен Линк за Демо (Demo URL)</span>
                  <small style={{ color: 'var(--text-secondary)' }}>По избор</small>
                </label>
                <input
                  type="url"
                  placeholder="https://demo.vixtrend.com"
                  value={formData.demoUrl}
                  onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span>Текст на бутона за линка (BG)</span>
                  <small style={{ color: 'var(--teal)' }}>BG</small>
                </label>
                <input
                  type="text"
                  placeholder="Отвори Продукта"
                  value={formData.productUrlText_bg}
                  onChange={(e) => handleInputChange('productUrlText_bg', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <span>Текст на бутона за линка (EN)</span>
                  <small style={{ color: 'var(--green)' }}>EN</small>
                </label>
                <input
                  type="text"
                  placeholder="Visit Product"
                  value={formData.productUrlText_en}
                  onChange={(e) => handleInputChange('productUrlText_en', e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* 6. Цена */}
          <div className={styles.sectionGroup}>
            <div className={styles.sectionHeader}>
              <h3>6. Ценообразуване</h3>
              <span>По избор</span>
            </div>

            <div className={styles.grid3}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Цена / Текст за цена</label>
                <input
                  type="text"
                  placeholder="напр. 450 лв. или По запитване"
                  value={formData.price_amount}
                  onChange={(e) => handleInputChange('price_amount', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Период (BG)</label>
                <input
                  type="text"
                  placeholder="напр. / месец или еднократно"
                  value={formData.price_period_bg}
                  onChange={(e) => handleInputChange('price_period_bg', e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Период (EN)</label>
                <input
                  type="text"
                  placeholder="e.g. / month or one-time"
                  value={formData.price_period_en}
                  onChange={(e) => handleInputChange('price_period_en', e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className={styles.footerBar}>
            <button
              type="button"
              onClick={() => setStage(2)}
              className={styles.stageBtn}
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
            >
              Премини към Live Preview &rarr;
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={styles.saveBtn}
            >
              {saving ? 'Запазване...' : productId ? 'Запази Промените' : 'Публикувай Продукта'}
            </button>
          </div>

        </div>
      )}

      {/* STAGE 2: LIVE PREVIEW */}
      {stage === 2 && (
        <div>
          <div className={styles.previewControls}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Език за предварителен преглед:
              </span>
              <button
                type="button"
                onClick={() => setPreviewLang('bg')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: previewLang === 'bg' ? 'var(--grad)' : 'var(--bg-primary)',
                  color: previewLang === 'bg' ? '#0d1b2a' : 'var(--text-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                BG
              </button>
              <button
                type="button"
                onClick={() => setPreviewLang('en')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: previewLang === 'en' ? 'var(--grad)' : 'var(--bg-primary)',
                  color: previewLang === 'en' ? '#0d1b2a' : 'var(--text-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                EN
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setStage(1)}
                className={styles.stageBtn}
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
              >
                &larr; Обратно към Редакция
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={styles.saveBtn}
              >
                {saving ? 'Запазване...' : productId ? 'Запази Промените' : 'Публикувай Продукта'}
              </button>
            </div>
          </div>

          <div className={styles.previewFrame}>
            <ProductSection
              product={formattedProduct}
              overrideLang={previewLang}
              isPreview={true}
            />
          </div>
        </div>
      )}

    </div>
  );
}
