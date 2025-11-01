'use client';
import React, { useContext, useState, useEffect } from 'react';
import { CollageContext } from '../../context/CollageContext';
import AlbumGrid from '../../components/AlbumGrid';
import UndoRedo from '../../components/UndoRedo';
import TheFooter from '../../components/TheFooter';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import ToggleDetails from '@/components/ToggleDetails';
import { useTranslation } from 'react-i18next';
import GenerateCollage from '@/components/GenerateCollage';
import MobileMenu from '@/components/MobileMenu';
import Link from 'next/link';
import Logo from '@/public/recollage.svg';

export default function AlbumsPage() {
  const { state, updateAlbums } = useContext(CollageContext);
  const { albums, settings } = state;
  const { t } = useTranslation();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(MouseSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = albums.findIndex((a: any) => a.id === active.id);
    const newIndex = albums.findIndex((a: any) => a.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      const newAlbums = arrayMove(albums, oldIndex, newIndex);
      updateAlbums(newAlbums);
    }
  };

  let gridCount = 9;
  if (settings.gridSize === '4x4') gridCount = 16;
  else if (settings.gridSize === '5x5') gridCount = 25;
  else if (settings.gridSize === '10x10') gridCount = 100;
  const maxSize = Math.sqrt(gridCount) * 250 + Math.sqrt(gridCount) - 1 * 16;

  return (
    <div className="min-h-screen py-4 overflow-x-clip">
      <div className="w-screen flex justify-center">
        <div className="w-full ~px-2/16 md:~px-1/16 flex flex-row items-center justify-center ~gap-2/6 md:~gap-1/6 py-4 relative">
          <Link href={'/'} className="absolute left-0 hidden md:block">
            <Logo className="~w-5/20 h-auto dark:text-white/90 text-blue-600 fill-current" />
          </Link>
          <div className="flex flex-row items-center ~gap-2/6 md:~gap-1/6">
            <div className="flex items-center">
              <UndoRedo />
            </div>
            <div className="flex items-center">
              <ToggleDetails />
            </div>
            <div className="flex items-center">
              <GenerateCollage />
            </div>
          </div>
          <div className="absolute right-0 ~pr-2/16 md:pr-0 flex items-center">
            <MobileMenu />
          </div>
        </div>
      </div>

      <div
        className="mx-auto ~px-2/3"
        style={{
          width: '100%',
          maxWidth: `${maxSize}px`,

          height: '100%',
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={albums.map((a: any) => a.id)}
            strategy={
              isMobile ? verticalListSortingStrategy : rectSortingStrategy
            }
          >
            <AlbumGrid />
          </SortableContext>
        </DndContext>
      </div>
      <TheFooter />
    </div>
  );
}
