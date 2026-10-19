'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Reveal } from '@/components/shared/Reveal';
import styles from './ContactForm.module.css';

/* ── SVG икони ── */
const ChatIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const AppIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);
const CpuIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <rect x="9" y="9" width="6" height="6"/>
    <line x1="9"  y1="1"  x2="9"  y2="4"/>
    <line x1="15" y1="1"  x2="15" y2="4"/>
    <line x1="9"  y1="20" x2="9"  y2="23"/>
    <line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9"  x2="23" y2="9"/>
    <line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1"  y1="9"  x2="4"  y2="9"/>
    <line x1="1"  y1="14" x2="4"  y2="14"/>
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

/* ── Услуги ── */
const SERVICES = [
  {
    id:    'consultation',
    label: 'Входна точка',
    sub:   'Консултация',
    price: 'Безплатно',
    icon:  ChatIcon,
    free:  true,
  },
  {
    id:    'website',
    label: 'Уебсайт',
    sub:   'Уеб присъствие',
    price: 'от 500€',
    icon:  GlobeIcon,
  },
  {
    id:    'app',
    label: 'Приложение',
    sub:   'Уеб & мобилни',
    price: 'от 80€',
    icon:  AppIcon,
  },
  {
    id:    'digitalization',
    label: 'Дигитализация',
    sub:   'Бизнес процеси',
    price: '200€ – 700€',
    icon:  CpuIcon,
  },
];

const DEADLINES = [
  { value: '',         label: 'Нямам краен срок' },
  { value: 'urgent',   label: 'Спешно (< 1 месец)' },
  { value: '1-3m',     label: '1 – 3 месеца' },
  { value: '3-6m',     label: '3 – 6 месеца' },
  { value: 'flexible', label: 'Гъвкаво' },
];

const INIT = {
  name:     '',
  phone:    '',
  email:    '',
  company:  '',
  service:  'consultation',   // default — Входна точка
  deadline: '',
  message:  '',
  gdpr:     false,
};

export default function ContactForm() {
  const [form,    setForm]    = useState(INIT);
  const [sending, setSending] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Basic client validation */
    if (!form.name.trim())  return setError('Моля, въведете вашето лице.');
    if (!form.phone.trim()) return setError('Моля, въведете телефонен номер.');
    if (!form.email.trim()) return setError('Моля, въведете имейл адрес.');
    if (!form.gdpr)         return setError('Необходимо е да дадете съгласие за обработка на данни.');

    setSending(true);
    setError('');

    try {
      await addDoc(collection(db, 'messages'), {
        name:      form.name.trim(),
        phone:     form.phone.trim(),
        email:     form.email.trim(),
        company:   form.company.trim() || null,
        service:   form.service,
        deadline:  form.deadline  || null,
        message:   form.message.trim() || null,
        read:      false,
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      setError('Нещо се обърка. Моля, опитайте отново или ни пишете директно.');
    } finally {
      setSending(false);
    }
  };

  /* ── Success state ── */
  if (done) {
    return (
      <div className={styles.successWrap}>
        <div className={styles.successIcon}><CheckCircleIcon /></div>
        <h3 className={styles.successTitle}>Получихме вашето запитване!</h3>
        <p className={styles.successSub}>
          Ще се свържем с вас в рамките на деня. Очаквайте съобщение на{' '}
          <strong>{form.email}</strong> или на посочения телефон.
        </p>
        <button className={styles.resetBtn} onClick={() => { setForm(INIT); setDone(false); }}>
          Изпратете ново запитване
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>

      {/* Row 1: Лице + Телефон */}
      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label}>
            Лице <span className={styles.req}>*</span>
          </label>
          <input
            className={styles.input}
            type="text"
            placeholder="Иван Иванов"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            Телефон <span className={styles.req}>*</span>
          </label>
          <input
            className={styles.input}
            type="tel"
            placeholder="+359 88 888 8888"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel"
          />
        </div>
      </div>

      {/* Row 2: Имейл + Фирма */}
      <div className={styles.row2}>
        <div className={styles.field}>
          <label className={styles.label}>
            Имейл <span className={styles.req}>*</span>
          </label>
          <input
            className={styles.input}
            type="email"
            placeholder="ivan@firma.bg"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            Фирма / Проект
            <span className={styles.opt}> — незадължително</span>
          </label>
          <input
            className={styles.input}
            type="text"
            placeholder="Моята Фирма ООД"
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            autoComplete="organization"
          />
        </div>
      </div>

      {/* Услуга */}
      <div className={styles.field}>
        <label className={styles.label}>
          Интересувам се от <span className={styles.req}>*</span>
        </label>
        <div className={styles.serviceCards}>
          {SERVICES.map((svc) => {
            const Icon    = svc.icon;
            const active  = form.service === svc.id;
            return (
              <button
                key={svc.id}
                type="button"
                className={`${styles.svcCard} ${active ? styles.svcCardActive : ''} ${svc.free ? styles.svcCardFree : ''}`}
                onClick={() => set('service', svc.id)}
              >
                <span className={styles.svcIcon}><Icon /></span>
                <span className={styles.svcLabel}>{svc.label}</span>
                <span className={styles.svcSub}>{svc.sub}</span>
                <span className={`${styles.svcPrice} ${svc.free ? styles.svcPriceFree : ''}`}>
                  {svc.price}
                </span>
                {active && (
                  <span className={styles.svcCheck} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none"
                         stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Краен срок */}
      <div className={styles.field}>
        <label className={styles.label}>
          Краен срок
          <span className={styles.opt}> — незадължително</span>
        </label>
        <div className={styles.deadlineRow}>
          {DEADLINES.map((d) => (
            <button
              key={d.value}
              type="button"
              className={`${styles.deadlineChip} ${form.deadline === d.value ? styles.deadlineChipActive : ''}`}
              onClick={() => set('deadline', d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Свободен текст */}
      <div className={styles.field}>
        <label className={styles.label}>
          Разкажете ни
          <span className={styles.opt}> — незадължително</span>
        </label>
        <textarea
          className={styles.textarea}
          rows={4}
          placeholder="Накратко — каква е идеята, какво имате в момента, какво искате да постигнете..."
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
        />
      </div>

      {/* GDPR */}
      <label className={styles.gdprLabel}>
        <input
          type="checkbox"
          className={styles.gdprCheck}
          checked={form.gdpr}
          onChange={(e) => set('gdpr', e.target.checked)}
        />
        <span className={styles.gdprText}>
          Съгласен/а съм данните ми (лице, телефон, имейл) да бъдат обработени за целите
          на отговора на това запитване. <span className={styles.req}>*</span>
        </span>
      </label>

      {/* Error */}
      {error && <p className={styles.errorMsg}>{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={sending}
      >
        {sending ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : (
          <SendIcon />
        )}
        {sending ? 'Изпраща се...' : 'Изпратете запитване'}
      </button>

    </form>
  );
}
