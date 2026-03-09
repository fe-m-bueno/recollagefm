'use client';
import { use } from 'react';
import { CollageContext } from '@/context/CollageContext';

export const usePickSpare = (albumId: string, closeOptions: () => void) => {
  const { setReplacementTarget, setPreviousScroll } = use(CollageContext);

  return () => {
    setReplacementTarget(albumId);
    setPreviousScroll(window.scrollY);
    const spareSection = document.getElementById('spare');
    if (spareSection) {
      spareSection.scrollIntoView({ behavior: 'smooth' });
    }
    closeOptions();
  };
};
