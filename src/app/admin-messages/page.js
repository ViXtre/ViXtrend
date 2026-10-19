'use client';

import { useState, useEffect } from 'react';
import {
  collection, query, orderBy,
  onSnapshot, doc, updateDoc, deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './admin-messages.module.css';

/* ── Label maps ── */
const SERVICE_LABELS = {
  consultation:   'Консултация',
  website:        'Уебсайт',
  app:            'Приложение',
  digitalization: 'Дигитализация',
};
const SERVICE_COLORS = {
  consultation:   'green',
  website:        'teal',
  app:            'teal',
  digitalization: 'teal',
};
const DEADLINE_LABELS = {
  urgent:   'Спешно (< 1 мес.)',
  '1-3m':   '1 – 3 месеца',
  '3-6m':   '3 – 6 месеца',
  flexible: 'Гъвкаво',
};

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('bg-BG', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/* ── SVG icons ── */
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4.5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.27.2 2.47.57 3.58.11.35.03.74-.24 1.01L6.6 10.8z"/>
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
       style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="1"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

/* ════════════════════════════════════════
   Message Card
   ════════════════════════════════════════ */
function MessageCard({ msg }) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) return null;

  const svcColor = SERVICE_COLORS[msg.service] || 'teal';

  const markRead = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await updateDoc(doc(db, 'messages', msg.id), { read: true });
    } finally {
      setLoading(false);
    }
  };

  const remove = async (e) => {
    e.stopPropagation();
    if (!confirm(`Изтриете запитването от ${msg.name}?`)) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'messages', msg.id));
      setDeleted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.card} ${!msg.read ? styles.cardUnread : ''}`}>

      {/* ── Row (summary) — always visible ── */}
      <button className={styles.cardRow} onClick={() => setOpen((v) => !v)}>

        {/* Unread dot */}
        <span className={`${styles.unreadDot} ${msg.read ? styles.unreadDotHidden : ''}`}
              aria-label="Непрочетено" />

        {/* Name + chips */}
        <div className={styles.cardMain}>
          <span className={styles.cardName}>{msg.name}</span>
          <div className={styles.cardMeta}>
            <span className={`${styles.svcChip} ${styles[`svcChip_${svcColor}`]}`}>
              {SERVICE_LABELS[msg.service] || msg.service}
            </span>
            {msg.company && (
              <span className={styles.metaItem}>
                <BuildingIcon /> {msg.company}
              </span>
            )}
            {msg.deadline && (
              <span className={styles.metaItem}>
                <ClockIcon /> {DEADLINE_LABELS[msg.deadline] || msg.deadline}
              </span>
            )}
          </div>
        </div>

        {/* Date + chevron */}
        <span className={styles.cardDate}>{formatDate(msg.createdAt)}</span>
        <span className={styles.chevron}><ChevronIcon open={open} /></span>

      </button>

      {/* ── Detail panel ── */}
      {open && (
        <div className={styles.detail}>

          {/* Contact info */}
          <div className={styles.detailGrid}>
            <div className={styles.detailBlock}>
              <div className={styles.detailLabel}>Телефон</div>
              <a href={`tel:${msg.phone}`} className={styles.detailValue}>
                {msg.phone}
              </a>
            </div>
            <div className={styles.detailBlock}>
              <div className={styles.detailLabel}>Имейл</div>
              <a href={`mailto:${msg.email}`} className={styles.detailValue}>
                {msg.email}
              </a>
            </div>
            {msg.company && (
              <div className={styles.detailBlock}>
                <div className={styles.detailLabel}>Фирма / Проект</div>
                <div className={styles.detailValue}>{msg.company}</div>
              </div>
            )}
            {msg.deadline && (
              <div className={styles.detailBlock}>
                <div className={styles.detailLabel}>Краен срок</div>
                <div className={styles.detailValue}>
                  {DEADLINE_LABELS[msg.deadline] || msg.deadline}
                </div>
              </div>
            )}
          </div>

          {/* Message */}
          {msg.message && (
            <div className={styles.detailMsg}>
              <div className={styles.detailLabel}>Съобщение</div>
              <p className={styles.detailMsgText}>{msg.message}</p>
            </div>
          )}

          {/* Actions */}
          <div className={styles.detailActions}>
            {!msg.read && (
              <button
                className={styles.actionBtn}
                onClick={markRead}
                disabled={loading}
              >
                <CheckIcon /> Маркирай като прочетено
              </button>
            )}
            <button
              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
              onClick={remove}
              disabled={loading}
            >
              <TrashIcon /> Изтрий
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

/* ════════════════════════════════════════
   Page
   ════════════════════════════════════════ */
export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all'); // 'all' | 'unread'

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const unreadCount = messages.filter((m) => !m.read).length;
  const visible     = filter === 'unread' ? messages.filter((m) => !m.read) : messages;

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}><MailIcon /></div>
          <div>
            <h1 className={styles.title}>
              Запитвания
              {unreadCount > 0 && (
                <span className={styles.unreadBadge}>{unreadCount} нови</span>
              )}
            </h1>
            <p className={styles.subtitle}>
              Запитвания от формата на страницата за услуги.
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${filter === 'all' ? styles.tabActive : ''}`}
            onClick={() => setFilter('all')}
          >
            Всички <span className={styles.tabCount}>{messages.length}</span>
          </button>
          <button
            className={`${styles.tab} ${filter === 'unread' ? styles.tabActive : ''}`}
            onClick={() => setFilter('unread')}
          >
            Непрочетени
            {unreadCount > 0 && (
              <span className={`${styles.tabCount} ${styles.tabCountUnread}`}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className={styles.empty}>Зарежда се...</div>
      ) : visible.length === 0 ? (
        <div className={styles.empty}>
          {filter === 'unread' ? 'Няма непрочетени запитвания.' : 'Няма запитвания все още.'}
        </div>
      ) : (
        <div className={styles.list}>
          {visible.map((msg) => (
            <MessageCard key={msg.id} msg={msg} />
          ))}
        </div>
      )}

    </div>
  );
}
