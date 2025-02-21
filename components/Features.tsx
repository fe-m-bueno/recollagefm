'use client';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {
  EyeOff,
  Lock,
  DoorClosed,
  RefreshCcw,
  Layers,
  History,
  LayoutGrid,
  Move,
  Settings2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
const Features = ({
  title,
  sub,
  content,
  image,
}: {
  title: string;
  sub?: string;
  content: string;
  image: string;
}) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1300);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={` text-center transition flex flex-col items-center bg-black/5 dark:bg-white/5 dark:hover:bg-white/10 rounded-3xl shadow-lg hover:transform hover:-translate-y-3 hover:bg-slate-100 backdrop-blur-sm ${
        isMobile
          ? 'w-full h-auto justify-center py-4 px-4 gap-4'
          : '~w-20/80 ~h-20/80 justify-between py-8 px-4 m-4 '
      }`}
    >
      <div className="bg-gradient-to-r dark:from-slate-400 dark:via-slate-200 dark:to-white/85 from-blue-800 to-blue-600 text-transparent bg-clip-text">
        <h2 className="~text-sm/3xl font-bold">{t(`features.${title}`)}</h2>
      </div>
      <div>
        <p className="~text-xs/md font-semibold dark:text-blue-400">
          {t(`features.${sub}`)}
        </p>
      </div>
      <div>
        {image === 'gatekeep' && (
          <div className="flex flex-row justify-around items-center gap-3 text-blue-600 dark:text-white">
            <EyeOff className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <Lock className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <DoorClosed className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
          </div>
        )}
        {image === 'spare' && (
          <div className="flex flex-row justify-around items-center gap-3 text-blue-600 dark:text-white">
            <RefreshCcw className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <Layers className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <History className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
          </div>
        )}
        {image === 'move' && (
          <div className="flex flex-row justify-around items-center gap-1 text-blue-600  dark:text-white">
            <Move className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <Settings2 className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
            <LayoutGrid className="transition duration-300 ease-out hover:transform hover:-translate-y-3 ~w-8/20 ~h-8/20" />
          </div>
        )}
      </div>

      <p className="~text-[0.8rem]/sm">{t(`features.${content}`)}</p>
    </div>
  );
};

export default Features;
