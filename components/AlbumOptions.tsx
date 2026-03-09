'use client';
import React, { use } from 'react';
import { CollageContext } from '../context/CollageContext';
import CustomCheckbox from './CustomCheckbox';
import { X, Trash, Replace } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { usePickSpare } from '@/hooks/usePickSpare';
import type { DisplayAlbum } from '@/utils/lastfm';

interface AlbumOptionsProps {
  album: DisplayAlbum;
  closeOptions: () => void;
}

const AlbumOptions: React.FC<AlbumOptionsProps> = ({ album, closeOptions }) => {
  const { toggleAlbumOption, deleteAlbum } = use(CollageContext);
  const { t } = useTranslation();
  const handlePickSpare = usePickSpare(album.id, closeOptions);

  return (
    <motion.div
      className="absolute inset-0 rounded-xl flex flex-col justify-center items-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="flex flex-col justify-end bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/15 shadow-lg rounded-xl p-4 ~w-28/60 ~h-28/60 ~text-[0.3rem]/sm"
        initial={{ scale: 0.9, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {t('options')}
          </h3>
          <button
            onClick={closeOptions}
            className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="~w-[0.8rem]/[1rem] ~h-[0.8rem]/[1rem]" />
          </button>
        </div>
        <div className="flex flex-col gap-2 relative overflow-hidden">
          <CustomCheckbox
            label={t('displayAlbumName')}
            checked={album.displayAlbumName}
            onChange={() => toggleAlbumOption(album.id, 'displayAlbumName')}
          />
          <CustomCheckbox
            label={t('displayArtistName')}
            checked={album.displayArtistName}
            onChange={() => toggleAlbumOption(album.id, 'displayArtistName')}
          />
          <CustomCheckbox
            label={t('displayPlaycount')}
            checked={album.displayPlaycount}
            onChange={() => toggleAlbumOption(album.id, 'displayPlaycount')}
          />
          <div className="flex flex-wrap items-center justify-around">
            <button
              onClick={() => {
                deleteAlbum(album.id);
                closeOptions();
              }}
              className="mb-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-600 dark:bg-red-500/40 dark:hover:bg-red-500/50 dark:border-red-400/50 dark:text-red-200 px-2 py-2 rounded-xl ~w-44/48 flex flex-row items-center justify-around transition-colors"
            >
              <div className="flex flex-row justify-center items-center gap-2">
                <Trash className="~w-[0.5rem]/[1rem] ~h-[0.5rem]/[1rem]" />
                <span>{t('deleteAlbum')}</span>
              </div>
            </button>
            <button
              onClick={handlePickSpare}
              className="mb-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-600 dark:bg-blue-500/40 dark:hover:bg-blue-500/50 dark:border-blue-400/50 dark:text-blue-200 px-2 py-2 rounded-xl ~w-44/48 flex flex-row items-center justify-around transition-colors"
            >
              <div className="flex flex-row justify-center items-center gap-2">
                <Replace className="~w-[0.5rem]/[1rem] ~h-[0.5rem]/[1rem]" />
                <span>{t('chooseBackup')}</span>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlbumOptions;
