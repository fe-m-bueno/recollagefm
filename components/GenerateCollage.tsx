'use client';
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CollageContext } from '../context/CollageContext';
import { Loader, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GenerateCollage: React.FC = () => {
  const { state } = useContext(CollageContext);
  const { settings, albums } = state;
  const { t } = useTranslation();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);

    try {
      const res = await fetch('/api/generate-collage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gridSize: settings.gridSize,
          albums,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error generating collage: ${res.statusText}`);
      }

      const blob = await res.blob();

      const imageUrl = URL.createObjectURL(blob);
      setProgress(100);
      clearInterval(interval);

      if (typeof window !== 'undefined') {
        localStorage.setItem('collageImage', imageUrl);
      }

      router.push('/results');
    } catch (error) {
      console.error('Error generating collage:', error);
      clearInterval(interval);
    } finally {
      setIsGenerating(false);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 830);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {isGenerating && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div
            className="bg-green-500 animate-pulse h-1"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <button
        onClick={handleGenerate}
        className={`cursor-pointer text-white py-2 mr-1 transition duration-300 ease-out bg-green-600 drop-shadow-sm hover:drop-shadow-md hover:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-fuchsia-600 border-1 border-green-400 hover:border-fuchsia-500 rounded-full text-nowrap ${
          isMobile 
            ? 'px-6' 
            : '~px-2/4'
        }`}
        disabled={isGenerating || albums.length === 0}
      >
        <span className="drop-shadow-md ~text-[0.5rem]/base">
          {isGenerating ? (
            isMobile ? (
              <span>
                <Loader className="~w-3/4 ~h-3/4" />
              </span>
            ) : (
              <span>{t('creating')}</span>
            )
          ) : isMobile ? (
            <span>
              <Play className="~w-3/4 ~h-3/4" />
            </span>
          ) : (
            <span>{t('create')}</span>
          )}
        </span>
      </button>
    </div>
  );
};

export default GenerateCollage;
