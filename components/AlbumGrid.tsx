'use client';
import { useContext, useEffect, useState } from 'react';
import { CollageContext } from '../context/CollageContext';
import AlbumCard from './AlbumCard';
import AlbumCardMobile from './AlbumCardMobile';
import { useRouter } from 'next/navigation';

import {
  arrayMove,
} from '@dnd-kit/sortable';
import { useTranslation } from 'react-i18next';

const AlbumGrid = () => {
  const {
    state,
    updateAlbums,
    swapAlbumWithSpare,
    replacementTarget,
    setReplacementTarget,
    previousScroll,
    setPreviousScroll,
  } = useContext(CollageContext);
  const { albums, settings, spareAlbums } = state;
  const { t } = useTranslation();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!state.albums.length) {
      router.push('/');
    }
  }, [state.albums, router]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultColumns = parseInt(settings.gridSize.split('x')[0]);
  const [computedColumns, setComputedColumns] =
    useState<number>(defaultColumns);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newColumns = defaultColumns;

      if (settings.gridSize === '4x4') {
        newColumns = width < 800 ? 2 : 4;
      } else if (settings.gridSize === '10x10') {
        if (width < 730) {
          newColumns = 3;
        } else if (width < 1200) {
          newColumns = 5;
        } else {
          newColumns = 10;
        }
      } else if (settings.gridSize === '5x5') {
        newColumns = width < 1000 ? 2 : 5;
      } else {
        newColumns = defaultColumns;
      }
      setComputedColumns(newColumns);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [settings.gridSize, defaultColumns]);

  const handleCancelReplacement = () => {
    setReplacementTarget(null);

    if (previousScroll !== null) {
      window.scrollTo({ top: previousScroll, behavior: 'smooth' });
      setPreviousScroll(null);
    }
  };

  return (
    <div>
      <div style={isMobile ? { touchAction: 'pan-y' } : { touchAction: 'none' }}>
        {isMobile ? (
          <div className="flex flex-col w-full px-4">
            {albums.map((album: any, index: number) => (
              <AlbumCardMobile key={album.id} album={album} index={index} />
            ))}
          </div>
        ) : (
          <div
            className={`grid ~gap-2/4 w-full h-full`}
            style={{ gridTemplateColumns: `repeat(${computedColumns}, 1fr)` }}
          >
            {albums.map((album: any, index: number) => (
              <AlbumCard key={album.id} album={album} index={index} />
            ))}
          </div>
        )}
      </div>
      <section id="spare" className="mt-4 flex flex-col items-center">
          {replacementTarget ? (
            <button
              onClick={handleCancelReplacement}
              className="mb-3 mt-2 px-4 py-2 bg-red-700 text-white rounded"
            >
              {t('cancelReplacement')}
            </button>
          ) : (
            <h2 className="text-lg font-bold p-4">{t('backupAlbums')}</h2>
          )}
          <div className="flex flex-wrap justify-evenly gap-2 pt-2 mb-4 md:max-w-[48rem] sm:max-w-[24rem]">
            {spareAlbums.map((album: any) => (
              <div
                key={album.id}
                title={`${album.name} - ${album.artist}`}
                className={`w-16 h-16 min-h-14 min-w-14 rounded-lg inset-shadow-sm ${
                  replacementTarget
                    ? 'cursor-pointer transition ring ring-blue-600 dark:ring-blue-400 animate-pulse'
                    : 'ring-2 ring-gray-800'
                }`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (replacementTarget) {
                    swapAlbumWithSpare(album.id);
                    if (previousScroll !== null) {
                      window.scrollTo({
                        top: previousScroll,
                        behavior: 'smooth',
                      });
                      setPreviousScroll(null);
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (replacementTarget) {
                      swapAlbumWithSpare(album.id);
                      if (previousScroll !== null) {
                        window.scrollTo({
                          top: previousScroll,
                          behavior: 'smooth',
                        });
                        setPreviousScroll(null);
                      }
                    }
                  }
                }}
              >
                <img
                  src={
                    album.imageUrl ? album.imageUrl : '/black-placeholder.png'
                  }
                  alt={album.name || 'Placeholder'}
                  width={300}
                  height={300}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = '/error.png';
                  }}
                  className={`w-full h-full object-cover rounded-lg  ${
                    replacementTarget ? '' : ''
                  }`}
                />
              </div>
            ))}
          </div>
        </section>
    </div>
  );
};

export default AlbumGrid;
