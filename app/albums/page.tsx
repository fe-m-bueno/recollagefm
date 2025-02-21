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
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import ToggleDetails from '@/components/ToggleDetails';
import { useTranslation } from 'react-i18next';
import GenerateCollage from '@/components/GenerateCollage';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';
import Logo from '@/public/recollage.svg';

export default function AlbumsPage() {
  const { state, updateAlbums } = useContext(CollageContext);
  const { albums, settings } = state;
  const { t } = useTranslation();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
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
        <div className="w-full ~px-1/16 flex flex-row items-center justify-between ~gap-[0.2rem]/1">
          <Link href={'/'} className="mb-4">
            <Logo className="mt-4 ~w-5/20 h-auto dark:text-white/90 text-blue-600 fill-current pb-4" />
          </Link>
          <div className="flex flex-row items-center justify-between ~gap-1/6">
            <UndoRedo />
            <ToggleDetails />
            <GenerateCollage />
          </div>
          <div className="mb-4">
            <ThemeToggle />
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
            strategy={rectSortingStrategy}
          >
            <AlbumGrid />
          </SortableContext>
        </DndContext>
      </div>
      <TheFooter />
    </div>
  );
}
