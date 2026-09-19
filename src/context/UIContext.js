'use client';
import { createContext, useContext, useState } from 'react';

const UIContext = createContext({});

export function UIProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fabOpen,  setFabOpen]  = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
    setFabOpen(false);
  };

  const toggleFab = () => {
    setFabOpen(prev => !prev);
    setMenuOpen(false);
  };

  const closeAll = () => {
    setMenuOpen(false);
    setFabOpen(false);
  };

  return (
    <UIContext.Provider value={{ menuOpen, fabOpen, toggleMenu, toggleFab, closeAll }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
