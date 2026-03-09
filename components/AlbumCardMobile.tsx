'use client';
import React, { memo, use, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Settings, GripVertical } from 'lucide-react';
import AlbumOptionsMobile from './AlbumOptionsMobile';
import { CollageContext } from '@/context/CollageContext';
import { AnimatePresence } from 'framer-motion';
import type { DisplayAlbum } from '@/utils/lastfm';

interface AlbumCardMobileProps {
  album: DisplayAlbum;
}

const AlbumCardMobile: React.FC<AlbumCardMobileProps> = ({ album }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: album.id,
    });
  const [showOptions, setShowOptions] = useState(false);
  const { replacementTarget } = use(CollageContext);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const hasHiddenFields =
    !album.displayAlbumName || !album.displayArtistName || !album.displayPlaycount;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`w-full mb-3 ${
          replacementTarget === album.id
            ? 'ring-2 ring-blue-400 animate-pulse'
            : ''
        } ${isDragging ? 'z-50' : ''}`}
      >
        <div className="relative bg-black/5 dark:bg-black/20 backdrop-blur-md rounded-xl border border-white/10 dark:border-white/20 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/10 pointer-events-none" />

          <div className="relative flex items-center p-4 gap-4">
            {/* Drag handle - Image */}
            <div
              {...listeners}
              {...attributes}
              className="flex-shrink-0 cursor-grab active:cursor-grabbing"
              style={{ touchAction: 'none' }}
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-md ring-1 ring-black/10 dark:ring-white/10">
                <img
                  src={album.imageUrl ? album.imageUrl : '/black-placeholder.png'}
                  alt={album.name || 'Placeholder'}
                  width={56}
                  height={56}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = '/error.png';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Album info */}
            <div className="flex-1 min-w-0" style={{ touchAction: 'pan-y' }}>
              <h3 className={`text-base font-bold text-gray-900 dark:text-white truncate ${
                !album.displayAlbumName ? 'opacity-40' : ''
              }`}>
                {album.name}
              </h3>
              <p className={`text-sm text-gray-600 dark:text-gray-300 truncate ${
                !album.displayArtistName ? 'opacity-40' : ''
              }`}>
                {album.artist}
              </p>
              <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                !album.displayPlaycount ? 'opacity-40' : ''
              }`}>
                Plays: {album.playcount}
              </p>
            </div>

            {/* Settings button */}
            <button
              onClick={handleToggleOptions}
              className="relative flex-shrink-0 p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Options"
              style={{ touchAction: 'manipulation' }}
            >
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {hasHiddenFields && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            {/* Drag handle */}
            <div
              {...listeners}
              {...attributes}
              className="flex-shrink-0 cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              style={{ touchAction: 'none' }}
            >
              <GripVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showOptions && (
          <AlbumOptionsMobile
            album={album}
            closeOptions={() => setShowOptions(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(AlbumCardMobile);
