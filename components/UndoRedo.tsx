'use client';
import { useContext, useEffect, useState } from 'react';
import { CollageContext } from '../context/CollageContext';
import { Undo2, Redo2 } from 'lucide-react';

const UndoRedo = () => {
  const { undo, canUndo } = useContext(CollageContext);
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
    <div className="flex gap-2 mb-4">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="px-3 py-1 bg-white/90 dark:bg-white/15 rounded-l-xl rounded-r-sm hover:bg-white/60 hover:transform hover:scale-110 transition dark:hover:bg-white/10 dark:shadow-sm dark:shadow-white/35 cursor-pointer dark:disabled:shadow-gray-800  disabled:scale-100 dark:disabled:hover:bg-white/15  disabled:hover:bg-white/90 disabled:opacity-10 disabled:cursor-not-allowed"
      >
        <Undo2 size={isMobile ? 18 : 24} />
      </button>
    </div>
  );
};

export default UndoRedo;
