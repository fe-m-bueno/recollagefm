'use client';
import { useContext, useEffect, useState } from 'react';
import { CollageContext } from '../context/CollageContext';
import AlbumCard from './AlbumCard';
import { useRouter } from 'next/navigation';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const AlbumGrid = () => {
  const {
    state,
    updateAlbums,
    swapAlbumWithSpare,
    replacementTarget,
    setReplacementTarget,
  } = useContext(CollageContext);
  const { albums, settings, spareAlbums } = state;
  const { t } = useTranslation();
  const router = useRouter();
  useEffect(() => {
    if (!state.albums.length) {
      router.push('/');
    }
  }, [state.albums, router]);
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
          newColumns = 4;
        } else if (width < 800) {
          newColumns = 5;
        } else {
          newColumns = 10;
        }
      } else {
        newColumns = defaultColumns;
      }
      setComputedColumns(newColumns);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [settings.gridSize, defaultColumns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = albums.findIndex((a: any) => a.id === active.id);
      const newIndex = albums.findIndex((a: any) => a.id === over.id);
      const newAlbums = arrayMove(albums, oldIndex, newIndex);
      updateAlbums(newAlbums);
    }
  };
  const handleReplacement = (album) => {
    if (replacementTarget) {
      swapAlbumWithSpare(album.id);
    }
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={albums.map((a: any) => a.id)}
          strategy={rectSortingStrategy}
        >
          <div
            className={`grid ~gap-2/4 w-full h-full`}
            style={{ gridTemplateColumns: `repeat(${computedColumns}, 1fr)` }}
          >
            {albums.map((album: any, index: number) => (
              <AlbumCard key={album.id} album={album} index={index} />
            ))}
          </div>
        </SortableContext>
        <section id="#spare" className="mt-4 flex flex-col items-center">
          {replacementTarget ? (
            <button
              onClick={() => setReplacementTarget(null)}
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
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (replacementTarget) {
                      swapAlbumWithSpare(album.id);
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
      </DndContext>
    </div>
  );
};

export default AlbumGrid;
