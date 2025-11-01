'use client';
import React, { useContext } from 'react';
import { CollageContext } from '../context/CollageContext';
import CustomCheckbox from './CustomCheckbox';
import { X, Trash, Replace } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AlbumOptionsMobileProps {
  album: any;
  closeOptions: () => void;
}

const AlbumOptionsMobile: React.FC<AlbumOptionsMobileProps> = ({
  album,
  closeOptions,
}) => {
  const { toggleAlbumOption, deleteAlbum, setReplacementTarget, setPreviousScroll } =
    useContext(CollageContext);
  const { t } = useTranslation();

  const handlePickSpare = () => {
    setReplacementTarget(album.id);
    setPreviousScroll(window.scrollY);
    const spareSection = document.getElementById('spare');
    if (spareSection) {
      spareSection.scrollIntoView({ behavior: 'smooth' });
    }
    closeOptions();
  };

  const handleDelete = () => {
    deleteAlbum(album.id);
    closeOptions();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-white dark:bg-black rounded-xl shadow-xl p-6 relative border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black dark:text-white">
            {t('options')}
          </h3>
          <button
            onClick={closeOptions}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col gap-3 mb-6">
          <CustomCheckbox
            label={t('displayAlbumName')}
            checked={album.displayAlbumName}
            onChange={() => toggleAlbumOption(album.id, 'displayAlbumName')}
            size="large"
          />
          <CustomCheckbox
            label={t('displayArtistName')}
            checked={album.displayArtistName}
            onChange={() => toggleAlbumOption(album.id, 'displayArtistName')}
            size="large"
          />
          <CustomCheckbox
            label={t('displayPlaycount')}
            checked={album.displayPlaycount}
            onChange={() => toggleAlbumOption(album.id, 'displayPlaycount')}
            size="large"
          />
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDelete}
            className="w-full bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-red-400 dark:border-red-500"
          >
            <Trash className="w-5 h-5" />
            <span>{t('deleteAlbum')}</span>
          </button>
          <button
            onClick={handlePickSpare}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-blue-400 dark:border-blue-500"
          >
            <Replace className="w-5 h-5" />
            <span>{t('chooseBackup')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumOptionsMobile;

