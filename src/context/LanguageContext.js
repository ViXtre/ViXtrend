'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { t } from '@/lib/translations';

const LanguageContext = createContext({});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('bg');

  // Зарежда запазения език при старт
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vxt-lang');
      if (saved === 'bg' || saved === 'en') setLang(saved);
    } catch {}
  }, []);

  const toggleLang = () => {
    const next = lang === 'bg' ? 'en' : 'bg';
    setLang(next);
    try { localStorage.setItem('vxt-lang', next); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t: t[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
