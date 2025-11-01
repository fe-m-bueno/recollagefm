'use client';
import React, { useState, useContext } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Settings, GripVertical, EyeOff } from 'lucide-react';
import AlbumOptionsMobile from './AlbumOptionsMobile';
import { CollageContext } from '@/context/CollageContext';

interface AlbumCardMobileProps {
  album: any;
  index: number;
}

const AlbumCardMobile: React.FC<AlbumCardMobileProps> = ({ album, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: album.id,
    });
  const [showOptions, setShowOptions] = useState(false);
  const { replacementTarget } = useContext(CollageContext);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

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
          {/* Efeito de blur interno */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/10 pointer-events-none" />
          
          <div className="relative flex items-center p-4 gap-4">
            {/* Área de drag - Imagem */}
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

            {/* Informações do álbum */}
            <div className="flex-1 min-w-0" style={{ touchAction: 'pan-y' }}>
              <div className="flex items-center gap-2 mb-1">
                {!album.displayAlbumName && (
                  <span title="Nome do álbum oculto">
                    <EyeOff className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                  </span>
                )}
                <h3 className={`text-base font-bold text-gray-900 dark:text-white truncate ${
                  !album.displayAlbumName ? 'line-through opacity-60' : ''
                }`}>
                  {album.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {!album.displayArtistName && (
                  <span title="Nome do artista oculto">
                    <EyeOff className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                  </span>
                )}
                <p className={`text-sm text-gray-600 dark:text-gray-300 truncate ${
                  !album.displayArtistName ? 'line-through opacity-60' : ''
                }`}>
                  {album.artist}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {!album.displayPlaycount && (
                  <span title="Playcount oculto">
                    <EyeOff className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                  </span>
                )}
                {album.displayPlaycount && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Plays: {album.playcount}
                  </p>
                )}
                {!album.displayPlaycount && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 opacity-60">
                    Plays oculto
                  </p>
                )}
              </div>
            </div>

            {/* Botão de settings */}
            <button
              onClick={handleToggleOptions}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Opções"
              style={{ touchAction: 'manipulation' }}
            >
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Ícone hamburger para drag */}
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

      {showOptions && (
        <AlbumOptionsMobile
          album={album}
          closeOptions={() => setShowOptions(false)}
        />
      )}
    </>
  );
};

export default AlbumCardMobile;

