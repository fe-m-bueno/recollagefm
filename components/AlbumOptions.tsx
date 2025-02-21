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
  const { setPreviousScroll } = useContext(CollageContext);

  const handlePickSpare = () => {
    setReplacementTarget(album.id);
    setPreviousScroll(window.scrollY);
    const spareSection = document.getElementById('spare');
    if (spareSection) {
      spareSection.scrollIntoView({ behavior: 'smooth' });
    }

    closeOptions();
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1150);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 bg-black rounded-xl bg-opacity-50 flex flex-col justify-center items-center z-20">
      <div className="flex flex-col justify-end dark:backdrop-blur-md backdrop-blur-sm dark:bg-black/35 bg-white/85  rounded-xl p-4 ~w-28/60 ~h-28/60 shadow-lg ~text-[0.3rem]/sm">
        <h3 className="font-bold mb-2">Options</h3>
        <div className="flex flex-col gap-2 relative">
          <button
            onClick={closeOptions}
            className="mt-2 px-2 py-1 absolute -top-10 -right-4"
          >
            <X className="~w-[0.8rem]/[1rem] ~h-[0.8rem]/[1rem]" />
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
              className={`mb-2 bg-red-700 hover:bg-red-800 dark:hover:bg-red-600 border border-red-400 text-white ${
                isMobile
                  ? 'px-2 py-2 rounded-full  ~w-8/12'
                  : 'px-2 py-2 rounded-xl ~w-44/48'
              }  flex flex-row items-center justify-around`}
            >
              <div className="flex flex-row justify-center items-center gap-2">
                <Trash className="~w-[0.5rem]/[1rem] ~h-[0.5rem]/[1rem]" />
                {!isMobile && <span>{t('deleteAlbum')}</span>}
              </div>
            </button>
            <button
              onClick={handlePickSpare}
              className={`mb-2 bg-blue-700 hover:bg-blue-800 dark:hover:bg-blue-600 border border-blue-400  text-white ${
                isMobile
                  ? 'px-1 py-2 rounded-full ~w-8/12'
                  : 'px-2 py-2 rounded-xl ~w-44/48'
              } flex flex-row items-center justify-around`}
            >
              <div className="flex flex-row justify-center items-center gap-2">
                <Replace className="~w-[0.5rem]/[1rem] ~h-[0.5rem]/[1rem]" />
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
