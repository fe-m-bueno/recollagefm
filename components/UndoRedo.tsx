'use client';
import { use } from 'react';
import { CollageContext } from '../context/CollageContext';
import { Undo2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

const UndoRedo = () => {
  const { undo, canUndo } = use(CollageContext);
  const isMobile = useIsMobile(830);

  return (
    <div className="flex gap-2">
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
