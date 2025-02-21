'use client';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { CollageContext } from '../context/CollageContext';
import { useTranslation } from 'react-i18next';
import CustomSelect from './CustomSelect';
import CustomCheckbox from './CustomCheckbox';

const UserInput = () => {
  const [username, setUsername] = useState('');
  const [timespan, setTimespan] = useState('7day');
  const [gridSize, setGridSize] = useState('3x3');
  const [displayArtist, setDisplayArtist] = useState(true);
  const [displayAlbum, setDisplayAlbum] = useState(true);
  const [displayPlaycount, setDisplayPlaycount] = useState(true);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const { updateSettings, setAlbums, setSpareAlbums } =
    useContext(CollageContext);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    updateSettings({
      username,
      timespan,
      gridSize,
      displayArtist,
      displayAlbum,
      displayPlaycount,
    });

    try {
      const res = await fetch(
        `/api/top-albums?user=${username}&period=${timespan}&limit=130&page=1`
      );
      const data = await res.json();
      let albums = data.albums || [];

      albums = albums.map((album: any) => ({
        ...album,
        displayArtistName: displayArtist,
        displayAlbumName: displayAlbum,
        displayPlaycount: displayPlaycount,
      }));

      const gridCount = parseInt(gridSize.split('x')[0]) ** 2;
      const spareCount = 30;
      const mainAlbums = albums.slice(0, gridCount);
      const spareAlbums = albums.slice(gridCount, gridCount + spareCount);
      setAlbums(mainAlbums);
      setSpareAlbums(spareAlbums);
      router.push('/albums');
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const gridSizeOptions = [
    { value: '3x3', label: t('gridSize.3x3') },
    { value: '4x4', label: t('gridSize.4x4') },
    { value: '5x5', label: t('gridSize.5x5') },
    { value: '10x10', label: t('gridSize.10x10') },
  ];

  const timespanOptions = [
    { value: '7day', label: t('timespan.7day') },
    { value: '1month', label: t('timespan.1month') },
    { value: '3month', label: t('timespan.3month') },
    { value: '6month', label: t('timespan.6month') },
    { value: '12month', label: t('timespan.12month') },
    { value: 'overall', label: t('timespan.overall') },
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6 ~w-[26rem]/[48rem]">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[11rem] ~text-xs/base">
          <label className="block mb-2 pl-3">{t('username')}</label>
          <input
            type="text"
            placeholder={t('usernamePlaceholder')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="dark:bg-black/25 bg-white/80 backdrop-blur-sm focus:outline-none placeholder:text-slate-500 dark:placeholder:text-slate-300 placeholder:~text-[0.5rem]/[1rem] focus:ring-2 focus:ring-blue-600 dark:focus:ring-white/50 border dark:border-white/10 w-full px-3 py-2 rounded"
          />
        </div>

        <div className="~w-28/36">
          <CustomSelect
            value={timespan}
            onChange={setTimespan}
            options={timespanOptions}
            labelKey="timespanLabel"
          />
        </div>

        <div className="~w-28/36">
          <CustomSelect
            value={gridSize}
            onChange={setGridSize}
            options={gridSizeOptions}
            labelKey="gridSizeLabel"
          />
        </div>
      </div>

      <div className="flex flex-row justify-between space-x-4 ~text-xs/base">
        <CustomCheckbox
          label={t('displayArtistNames')}
          checked={displayArtist}
          onChange={() => setDisplayArtist(!displayArtist)}
        />
        <CustomCheckbox
          label={t('displayAlbumNames')}
          checked={displayAlbum}
          onChange={() => setDisplayAlbum(!displayAlbum)}
        />
        <CustomCheckbox
          label={t('displayPlaycount')}
          checked={displayPlaycount}
          onChange={() => setDisplayPlaycount(!displayPlaycount)}
        />
      </div>
      <div className="flex flex-row items-center justify-center ~text-sm/base">
        <button
          type="submit"
          className={`w-[33%] transition bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]  from-blue-600/95 to-blue-600 dark:hover:bg-white/10 dark:bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]  backdrop-blur-sm dark:from-white/10 dark:to-white/5 text-white py-4 rounded-full mt-10 border dark:border-white/50 border-blue-700 hover:bg-blue-700 font-bold shadow-md`}
          disabled={loading}
        >
          {loading ? t('loading') : t('submit')}
        </button>
      </div>
    </form>
  );
};

export default UserInput;
