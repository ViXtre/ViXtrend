'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PhoneIcon, InstagramIcon, WhatsAppIcon, TikTokIcon } from '@/components/shared/Icons';
import styles from './admin-contacts.module.css';

const DEFAULTS = { phone: '', email: '', facebook: '', instagram: '', whatsapp: '', tiktok: '' };

export default function AdminContactsPage() {
  const [form, setForm]       = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [status, setStatus]   = useState(null); // 'ok' | 'error'

  /* ── Зарежда текущите данни ── */
  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'contacts', 'main'));
        if (snap.exists()) setForm({ ...DEFAULTS, ...snap.data() });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus(null);
  };

  /* ── Записва в Firestore ── */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await setDoc(doc(db, 'contacts', 'main'), form, { merge: true });
      setStatus('ok');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  /* ── Помощ за href preview ── */
  const hrefPhone     = form.phone     ? `tel:${form.phone.replace(/\s/g, '')}` : null;
  const hrefEmail     = form.email     ? `mailto:${form.email}` : null;
  const hrefFacebook  = form.facebook  || null;
  const hrefInstagram = form.instagram || null;
  const hrefWhatsApp  = form.whatsapp  ? `https://wa.me/${form.whatsapp.replace(/[^\d]/g, '')}` : null;
  const hrefTikTok    = form.tiktok    || null;

  return (
    <>
      <div className={styles.page}>

        <div className={styles.header}>
          <div className={styles.headerIcon}><PhoneIcon size={24} color="var(--teal)" /></div>
          <div>
            <h1 className={styles.title}>Контакти</h1>
            <p className={styles.subtitle}>
              Тези данни се показват в Contact FAB бутона на всяка страница.
            </p>
          </div>
        </div>

        {loading ? (
          <div className={styles.loader}>Зарежда се...</div>
        ) : (
          <form onSubmit={handleSave} className={styles.form}>

            {/* Phone */}
            <div className={styles.field}>
              <label className={styles.label}>
                <span>Телефон / Viber</span>
                {hrefPhone && (
                  <a href={hrefPhone} className={styles.previewLink} tabIndex={-1}>
                    {hrefPhone}
                  </a>
                )}
              </label>
              <input
                className={styles.input}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+359 88 888 8888"
                autoComplete="off"
              />
              <span className={styles.hint}>
                Форматът трябва да е с „+" и международен код: <code>+359 88 888 8888</code>
              </span>
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label className={styles.label}>
                <span>Email</span>
                {hrefEmail && (
                  <a href={hrefEmail} className={styles.previewLink} tabIndex={-1}>
                    {hrefEmail}
                  </a>
                )}
              </label>
              <input
                className={styles.input}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contact@vixtrend.bg"
                autoComplete="off"
              />
            </div>

            {/* Facebook */}
            <div className={styles.field}>
              <label className={styles.label}>
                <span>Facebook URL</span>
                {hrefFacebook && (
                  <a href={hrefFacebook} target="_blank" rel="noreferrer" className={styles.previewLink}>
                    {hrefFacebook}
                  </a>
                )}
              </label>
              <input
                className={styles.input}
                type="url"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/vixtrend"
                autoComplete="off"
              />
            </div>

            {/* Instagram */}
            <div className={styles.field}>
              <label className={styles.label}>
                <span>Instagram URL</span>
                {hrefInstagram && (
                  <a href={hrefInstagram} target="_blank" rel="noreferrer" className={styles.previewLink}>
                    {hrefInstagram}
                  </a>
                )}
              </label>
              <input
                className={styles.input}
                type="url"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/vixtrend"
                autoComplete="off"
              />
            </div>

            {/* WhatsApp */}
            <div className={styles.field}>
              <label className={styles.label}>
                <span>WhatsApp номер</span>
                {hrefWhatsApp && (
                  <a href={hrefWhatsApp} target="_blank" rel="noreferrer" className={styles.previewLink}>
                    {hrefWhatsApp}
                  </a>
                )}
              </label>
              <input
                className={styles.input}
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="+359 88 888 8888"
                autoComplete="off"
              />
              <span className={styles.hint}>
                Въведете номера с „+" и международен код. WhatsApp линкът се генерира автоматично.
              </span>
            </div>

            {/* TikTok */}
            <div className={styles.field}>
              <label className={styles.label}>
                <span>TikTok URL</span>
                {hrefTikTok && (
                  <a href={hrefTikTok} target="_blank" rel="noreferrer" className={styles.previewLink}>
                    {hrefTikTok}
                  </a>
                )}
              </label>
              <input
                className={styles.input}
                type="url"
                name="tiktok"
                value={form.tiktok}
                onChange={handleChange}
                placeholder="https://tiktok.com/@vixtrend"
                autoComplete="off"
              />
            </div>

            {/* Preview */}
            <div className={styles.preview}>
              <p className={styles.previewTitle}>Преглед на Contact FAB</p>
              <div className={styles.previewBtns}>
                {form.phone && (
                  <a href={`tel:${form.phone.replace(/\s/g, '')}`} className={styles.previewBtn} title="Телефон">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4.5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.27.2 2.47.57 3.58.11.35.03.74-.24 1.01L6.6 10.8z"/>
                    </svg>
                  </a>
                )}
                {form.email && (
                  <a href={`mailto:${form.email}`} className={styles.previewBtn} title="Email">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
                )}
                {form.facebook && (
                  <a href={form.facebook} target="_blank" rel="noreferrer" className={styles.previewBtn} title="Facebook">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                )}
                {form.instagram && (
                  <a href={form.instagram} target="_blank" rel="noreferrer" className={styles.previewBtn} title="Instagram">
                    <InstagramIcon size={17} color="currentColor" />
                  </a>
                )}
                {form.whatsapp && (
                  <a href={`https://wa.me/${form.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" className={styles.previewBtn} title="WhatsApp">
                    <WhatsAppIcon size={17} color="currentColor" />
                  </a>
                )}
                {form.tiktok && (
                  <a href={form.tiktok} target="_blank" rel="noreferrer" className={styles.previewBtn} title="TikTok">
                    <TikTokIcon size={17} color="currentColor" />
                  </a>
                )}
                {!form.phone && !form.email && !form.facebook && !form.instagram && !form.whatsapp && !form.tiktok && (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Попълнете полетата по-горе
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              {status === 'ok' && (
                <span className={styles.statusOk}>✓ Запазено успешно</span>
              )}
              {status === 'error' && (
                <span className={styles.statusErr}>✗ Грешка при запис</span>
              )}
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={saving}
              >
                {saving ? 'Запазва се...' : 'Запази'}
              </button>
            </div>

          </form>
        )}

      </div>
    </>
  );
}
