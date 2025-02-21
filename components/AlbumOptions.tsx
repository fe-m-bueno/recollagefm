'use client';
import React, { useContext, useState, useEffect } from 'react';
import { CollageContext } from '../context/CollageContext';
import CustomCheckbox from './CustomCheckbox';
import { X, Trash, Replace } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AlbumOptionsProps {
  album: any;
  closeOptions: () => void;
}

const AlbumOptions: React.FC<AlbumOptionsProps> = ({ album, closeOptions }) => {
  const { toggleAlbumOption, deleteAlbum, setReplacementTarget } =
    useContext(CollageContext);
  const { t } = useTranslation();

  const handlePickSpare = () => {
    setReplacementTarget(album.id);
    closeOptions();
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 830);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 bg-black rounded-xl bg-opacity-50 flex flex-col justify-center items-center z-20">
      <div className="flex flex-col justify-end dark:backdrop-blur-md backdrop-blur-sm dark:bg-black/35 bg-white/85  rounded-xl p-4 ~w-36/60 ~h-36/60 shadow-lg ~text-[0.5rem]/sm">
        <h3 className="font-bold mb-2">Options</h3>
        <div className="flex flex-col gap-2 relative">
          <button
            onClick={closeOptions}
            className="mt-2 px-2 py-1 absolute -top-12 -right-3"
          >
            <X />
          </button>
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
              className={`mb-2 bg-red-700 hover:bg-red-800 dark:hover:bg-red-600 border border-red-400 ~w-[70%]/[80%] text-white ${
                isMobile ? 'px-5 py-2' : 'px-2 py-1'
              } rounded-xl flex flex-row items-center justify-around`}
            >
              <div className="flex flex-row justify-center items-center gap-2">
                <Trash size={16} />
                {!isMobile && <span>{t('deleteAlbum')}</span>}
              </div>
            </button>
            <button
              onClick={handlePickSpare}
              className={`mb-2 bg-blue-700 hover:bg-blue-800 dark:hover:bg-blue-600 border border-blue-400 ~w-[70%]/[80%] text-white ${
                isMobile ? 'px-5 py-2' : 'px-2 py-1'
              } rounded-xl flex flex-row items-center justify-around`}
            >
              <div className="flex flex-row justify-center items-center gap-2">
                <Replace size={16} />
                {!isMobile && <span>{t('chooseBackup')}</span>}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumOptions;
