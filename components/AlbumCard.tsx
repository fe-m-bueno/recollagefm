'use client';
import React, { useState, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal } from 'lucide-react';
import AlbumOptions from './AlbumOptions';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';
import { CollageContext } from '@/context/CollageContext';

interface AlbumCardProps {
  album: any;
  index: number;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: album.id,
    });
  const [showOptions, setShowOptions] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { replacementTarget } = useContext(CollageContext);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      title={`${album.name} - ${album.artist}`}
      className={`rounded relative w-fit h-fit min-w-28 min-h-28 ${
        replacementTarget === album.id
          ? 'animate-pulse ring ring-blue-400 transform scale-105 transition-transform duration-300 rounded-xl'
          : ''
      }`}
    >
      <div
        onClick={handleToggleOptions}
        aria-label="Options"
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleToggleOptions()}
      >
        <div
          className={
            album.displayAlbumName ||
            album.displayArtistName ||
            album.displayPlaycount
              ? 'bg-gradient-to-b from-black/90 via-black/15 rounded-xl'
              : ''
          }
        >
          <div className="dark:before:absolute dark:before:-inset-px dark:before:bg-gradient-to-b dark:before:from-black/100 dark:before:via-black/15 dark:before:rounded-xl before:mix-blend-overlay dark:before:mix-blend-normal" />
          <img
            src={album.imageUrl ? album.imageUrl : '/black-placeholder.png'}
            alt={album.name || 'Placeholder'}
            width={300}
            height={300}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = '/error.png';
            }}
            className={`object-cover rounded-xl mix-blend-multiply dark:mix-blend-normal`}
          />
          <div className="absolute top-2 left-0 w-full pl-2">
            {album.displayAlbumName && (
              <h3 className="mt-1 ~text-[0.5rem]/xs font-bold text-white text-shadow-lg">
                {album.name}
              </h3>
            )}
            {album.displayArtistName && (
              <p className="~text-[0.5rem]/xs text-white/90 text-shadow-md">
                {album.artist}
              </p>
            )}
            {album.displayPlaycount && (
              <p className="~text-[0.5rem]/xs  text-white/80 text-shadow-md">
                Plays: {album.playcount}
              </p>
            )}
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 flex justify-center cursor-move bg-gradient-to-t from-black/60 via-black/25 rounded-b-xl"
        {...listeners}
      >
        <GripHorizontal size={30} color="#fff" />
      </div>

      {showOptions && (
        <AlbumOptions
          album={album}
          closeOptions={() => setShowOptions(false)}
        />
      )}
    </div>
  );
};

export default AlbumCard;
