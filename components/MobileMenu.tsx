'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

const MobileMenu: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  if (!isMobile) {
    return (
      <div className="flex items-center gap-3">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center ~w-8/10 ~h-8/10 rounded-lg bg-white/80 dark:bg-black/60 backdrop-blur-md hover:bg-white/90 dark:hover:bg-black/70 transition-colors border border-white/20 dark:border-white/20 shadow-lg"
        aria-label="Menu"
      >
        {isOpen ? (
          <X className="~w-4/6 ~h-4/6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="~w-4/6 ~h-4/6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 ~w-48/64 bg-white/90 dark:bg-black/70 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-white/20 z-50 py-4 px-4">
            {/* Efeito de blur interno igual ao card */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-white/10 pointer-events-none rounded-xl" />
            <div className="relative flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="~text-sm/base text-gray-900 dark:text-white font-medium">
                  {t('theme')}
                </span>
                <button
                  onClick={() => setTheme('light')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    theme === 'light'
                      ? 'bg-white/20 dark:bg-white/20 text-gray-900 dark:text-white font-medium'
                      : 'bg-transparent hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  {t('light')}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-white/20 dark:bg-white/20 text-gray-900 dark:text-white font-medium'
                      : 'bg-transparent hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  {t('dark')}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <span className="~text-sm/base text-gray-900 dark:text-white font-medium">
                  {t('language')}
                </span>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
