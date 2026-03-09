'use client';
import React, { use } from 'react';
import { CollageContext } from '../context/CollageContext';
import CustomCheckbox from './CustomCheckbox';
import { Trash, Replace } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, type PanInfo } from 'framer-motion';
import { usePickSpare } from '@/hooks/usePickSpare';
import type { DisplayAlbum } from '@/utils/lastfm';

interface AlbumOptionsMobileProps {
  album: DisplayAlbum;
  closeOptions: () => void;
}

const AlbumOptionsMobile: React.FC<AlbumOptionsMobileProps> = ({
  album,
  closeOptions,
}) => {
  const { toggleAlbumOption, deleteAlbum } = use(CollageContext);
  const { t } = useTranslation();
  const handlePickSpare = usePickSpare(album.id, closeOptions);

  const handleDelete = () => {
    deleteAlbum(album.id);
    closeOptions();
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 300) {
      closeOptions();
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={closeOptions}
      />

      {/* Bottom Sheet */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-black/90 backdrop-blur-xl rounded-t-2xl shadow-xl border-t border-white/20 dark:border-gray-700"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        <div className="px-6 pb-[env(safe-area-inset-bottom,1rem)]">
          {/* Album preview */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200/50 dark:border-white/10">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm ring-1 ring-black/10 dark:ring-white/10">
              <img
                src={album.imageUrl || '/black-placeholder.png'}
                alt={album.name || 'Placeholder'}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {album.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {album.artist}
              </p>
            </div>
          </div>

          {/* Toggle switches */}
          <div className="flex flex-col divide-y divide-gray-200/50 dark:divide-white/10 mb-6">
            <div className="py-3">
              <CustomCheckbox
                label={t('displayAlbumName')}
                checked={album.displayAlbumName}
                onChange={() => toggleAlbumOption(album.id, 'displayAlbumName')}
                size="large"
                variant="toggle"
              />
            </div>
            <div className="py-3">
              <CustomCheckbox
                label={t('displayArtistName')}
                checked={album.displayArtistName}
                onChange={() => toggleAlbumOption(album.id, 'displayArtistName')}
                size="large"
                variant="toggle"
              />
            </div>
            <div className="py-3">
              <CustomCheckbox
                label={t('displayPlaycount')}
                checked={album.displayPlaycount}
                onChange={() => toggleAlbumOption(album.id, 'displayPlaycount')}
                size="large"
                variant="toggle"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pb-4">
            <button
              onClick={handleDelete}
              className="w-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-600 dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/10 dark:text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Trash className="w-5 h-5" />
              <span>{t('deleteAlbum')}</span>
            </button>
            <button
              onClick={handlePickSpare}
              className="w-full bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/20 text-blue-600 dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/10 dark:text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Replace className="w-5 h-5" />
              <span>{t('chooseBackup')}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AlbumOptionsMobile;
