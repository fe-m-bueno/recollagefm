'use client';
import { useContext, useState, useEffect } from 'react';
import { CollageContext } from '../context/CollageContext';
import {
  Eye,
  EyeClosed,
  Disc3,
  VenetianMask,
  BookHeadphones,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ToggleDetails = () => {
  const { state, updateAlbums, setSpareAlbums } = useContext(CollageContext);
  const { t } = useTranslation();

  const albumNamesShown =
    state.albums.length > 0
      ? state.albums.every((album) => album.displayAlbumName)
      : false;
  const artistNamesShown =
    state.albums.length > 0
      ? state.albums.every((album) => album.displayArtistName)
      : false;
  const playcountsShown =
    state.albums.length > 0
      ? state.albums.every((album) => album.displayPlaycount)
      : false;

  const toggleAlbumNames = () => {
    const newAlbums = state.albums.map((album) => ({
      ...album,
      displayAlbumName: !albumNamesShown,
    }));
    const newSpareAlbums = state.spareAlbums.map((album) => ({
      ...album,
      displayAlbumName: !albumNamesShown,
    }));
    updateAlbums(newAlbums);
    setSpareAlbums(newSpareAlbums);
  };

  const toggleArtistNames = () => {
    const newAlbums = state.albums.map((album) => ({
      ...album,
      displayArtistName: !artistNamesShown,
    }));
    const newSpareAlbums = state.spareAlbums.map((album) => ({
      ...album,
      displayArtistName: !artistNamesShown,
    }));
    updateAlbums(newAlbums);
    setSpareAlbums(newSpareAlbums);
  };

  const togglePlaycounts = () => {
    const newAlbums = state.albums.map((album) => ({
      ...album,
      displayPlaycount: !playcountsShown,
    }));
    const newSpareAlbums = state.spareAlbums.map((album) => ({
      ...album,
      displayPlaycount: !playcountsShown,
    }));
    updateAlbums(newAlbums);
    setSpareAlbums(newSpareAlbums);
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
    <div className="flex flex-row ~gap-1/6 mb-4">
      <button
        onClick={toggleAlbumNames}
        className="~px-1/3 py-2 text-slate-700 dark:text-slate-100 dark:hover:text-slate-200 hover:text-slate-900 hover:bg-white/75 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition hover:drop-shadow-sm ~w-8/48 text-nowrap"
      >
        {albumNamesShown ? (
          <span className="~text-[0.5rem]/sm flex flex-row justify-center items-center gap-2">
            <Eye size={isMobile ? 18 : 24} />{' '}
            {isMobile ? (
              <Disc3 size={isMobile ? 18 : 24} />
            ) : (
              <span>{t('hideAlbum')}</span>
            )}
          </span>
        ) : (
          <span className="~text-[0.5rem]/sm flex flex-row justify-center items-center gap-2">
            <EyeClosed size={isMobile ? 18 : 24} />
            {isMobile ? (
              <Disc3 size={isMobile ? 18 : 24} />
            ) : (
              <span>{t('showAlbum')}</span>
            )}
          </span>
        )}
      </button>
      <button
        onClick={toggleArtistNames}
        className="~px-1/3 py-2 text-slate-700 dark:text-slate-100 text-nowrap dark:hover:text-slate-200 hover:text-slate-900 rounded-xl dark:bg-white/5 dark:hover:bg-white/10 hover:bg-white/75 transition hover:drop-shadow-sm ~w-8/48"
      >
        {artistNamesShown ? (
          <span className="~text-[0.5rem]/sm flex flex-row justify-center items-center gap-2">
            <Eye size={isMobile ? 18 : 24} />
            {isMobile ? (
              <VenetianMask size={isMobile ? 18 : 24} />
            ) : (
              <span>{t('hideArtist')}</span>
            )}
          </span>
        ) : (
          <span className="~text-[0.5rem]/sm flex flex-row justify-center items-center gap-2">
            <EyeClosed size={isMobile ? 18 : 24} />
            {isMobile ? (
              <VenetianMask size={isMobile ? 18 : 24} />
            ) : (
              <span>{t('showArtist')}</span>
            )}
          </span>
        )}
      </button>
      <button
        onClick={togglePlaycounts}
        className="~px-1/3 py-2 text-slate-700 dark:text-slate-100 dark:hover:text-slate-200 hover:text-slate-900 rounded-xl dark:bg-white/5 dark:hover:bg-white/10 hover:bg-white/75 transition hover:drop-shadow-sm ~w-8/48 text-nowrap"
      >
        {playcountsShown ? (
          <span className="~text-[0.5rem]/sm flex flex-row justify-center items-center gap-2">
            <Eye size={isMobile ? 18 : 24} />
            {isMobile ? (
              <BookHeadphones size={isMobile ? 18 : 24} />
            ) : (
              <span>{t('hidePlaycount')}</span>
            )}
          </span>
        ) : (
          <span className="~text-[0.5rem]/sm flex flex-row justify-center items-center gap-2">
            <EyeClosed size={isMobile ? 18 : 24} />
            {isMobile ? (
              <BookHeadphones size={isMobile ? 18 : 24} />
            ) : (
              <span>{t('showPlaycount')}</span>
            )}
          </span>
        )}
      </button>
    </div>
  );
};

export default ToggleDetails;
