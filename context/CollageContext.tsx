'use client';
import { createContext, useState, useEffect } from 'react';
import type { DisplayAlbum } from '@/utils/lastfm';

interface Settings {
  username: string;
  timespan: string;
  gridSize: string;
  displayArtist: boolean;
  displayAlbum: boolean;
  displayPlaycount: boolean;
}

interface CollageState {
  settings: Settings;
  albums: DisplayAlbum[];
  spareAlbums: DisplayAlbum[];
}

interface CollageContextProps {
  state: CollageState;
  updateSettings: (settings: Settings) => void;
  setAlbums: (albums: DisplayAlbum[]) => void;
  setSpareAlbums: (albums: DisplayAlbum[]) => void;
  updateAlbums: (albums: DisplayAlbum[]) => void;
  toggleAlbumOption: (albumId: string, option: keyof Pick<DisplayAlbum, 'displayAlbumName' | 'displayArtistName' | 'displayPlaycount'>) => void;
  deleteAlbum: (albumId: string) => void;
  undo: () => void;
  canUndo: boolean;
  replacementTarget: string | null;
  setReplacementTarget: (albumId: string | null) => void;
  swapAlbumWithSpare: (spareAlbumId: string) => void;
  previousScroll: number | null;
  setPreviousScroll: (value: number | null) => void;
  isHydrated: boolean;
}

export const CollageContext = createContext<CollageContextProps>(
  {} as CollageContextProps
);

export const CollageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const defaultState: CollageState = {
    settings: {
      username: '',
      timespan: '7day',
      gridSize: '3x3',
      displayArtist: true,
      displayAlbum: true,
      displayPlaycount: true,
    },
    albums: [],
    spareAlbums: [],
  };

  const [state, setState] = useState<CollageState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('collageState');
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch {}
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('collageState', JSON.stringify(state));
  }, [state, isHydrated]);

  const [previousScroll, setPreviousScroll] = useState<number | null>(null);
  const [history, setHistory] = useState<[DisplayAlbum[], DisplayAlbum[]][]>([]);
  const [future, setFuture] = useState<[DisplayAlbum[], DisplayAlbum[]][]>([]);

  const pushSnapshot = (albums: DisplayAlbum[], spareAlbums: DisplayAlbum[]) => {
    const snapshot: [DisplayAlbum[], DisplayAlbum[]] = [
      JSON.parse(JSON.stringify(albums)),
      JSON.parse(JSON.stringify(spareAlbums)),
    ];
    setHistory((prevHistory) => {
      if (prevHistory.length > 0) {
        const lastSnapshot = prevHistory[prevHistory.length - 1];
        if (JSON.stringify(lastSnapshot) === JSON.stringify(snapshot)) {
          return prevHistory;
        }
      }
      return [...prevHistory, snapshot];
    });
  };

  const updateSettings = (settings: Settings) => {
    setState((prev) => ({ ...prev, settings }));
  };

  const setAlbums = (albums: DisplayAlbum[]) => {
    setHistory([]);
    setFuture([]);
    setState((prev) => ({ ...prev, albums }));
  };

  const setSpareAlbums = (albums: DisplayAlbum[]) => {
    setState((prev) => ({ ...prev, spareAlbums: albums }));
  };

  const updateState = (newAlbums: DisplayAlbum[], newSpares: DisplayAlbum[]) => {
    setState((prevState) => {
      pushSnapshot(prevState.albums, prevState.spareAlbums);
      setFuture([]);
      return { ...prevState, albums: newAlbums, spareAlbums: newSpares };
    });
  };

  const updateAlbums = (albums: DisplayAlbum[]) => {
    setState((prevState) => {
      pushSnapshot(prevState.albums, prevState.spareAlbums);
      setFuture([]);
      return { ...prevState, albums };
    });
  };

  const toggleAlbumOption = (albumId: string, option: string) => {
    setState((prevState) => {
      pushSnapshot(prevState.albums, prevState.spareAlbums);
      setFuture([]);
      const newAlbums = prevState.albums.map((album) =>
        album.id === albumId ? { ...album, [option]: !album[option] } : album
      );
      return { ...prevState, albums: newAlbums };
    });
  };

  const deleteAlbum = (albumId: string) => {
    setState((prevState) => {
      pushSnapshot(prevState.albums, prevState.spareAlbums);
      setFuture([]);
      const albumIndex = prevState.albums.findIndex(
        (album) => album.id === albumId
      );
      if (albumIndex !== -1) {
        const newAlbums = [...prevState.albums];
        const deletedAlbum = newAlbums[albumIndex];
        if (prevState.spareAlbums.length > 0) {
          const [firstSpare, ...remainingSpares] = prevState.spareAlbums;
          newAlbums.splice(albumIndex, 1, firstSpare);
          const newSpares = [...remainingSpares, deletedAlbum];
          return { ...prevState, albums: newAlbums, spareAlbums: newSpares };
        } else {
          newAlbums.splice(albumIndex, 1);
          return { ...prevState, albums: newAlbums };
        }
      }
      return prevState;
    });
  };

  const undo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      const previous = prevHistory[prevHistory.length - 1];
      setState((prevState) => {
        setFuture((prevFuture) => [
          [prevState.albums, prevState.spareAlbums],
          ...prevFuture,
        ]);
        return { ...prevState, albums: previous[0], spareAlbums: previous[1] };
      });
      return prevHistory.slice(0, -1);
    });
  };

  const canUndo = history.length > 0;

  const [replacementTarget, setReplacementTarget] = useState<string | null>(
    null
  );

  const swapAlbumWithSpare = (spareAlbumId: string) => {
    if (!replacementTarget) return;
    const mainIndex = state.albums.findIndex(
      (album) => album.id === replacementTarget
    );
    if (mainIndex === -1) return;
    const spareIndex = state.spareAlbums.findIndex(
      (album) => album.id === spareAlbumId
    );
    if (spareIndex === -1) return;

    const mainAlbum = state.albums[mainIndex];
    const spareAlbum = state.spareAlbums[spareIndex];
    const newMainAlbums = [...state.albums];
    newMainAlbums[mainIndex] = spareAlbum;
    const newSpareAlbums = [...state.spareAlbums];
    newSpareAlbums[spareIndex] = mainAlbum;

    updateState(newMainAlbums, newSpareAlbums);
    setReplacementTarget(null);
  };

  return (
    <CollageContext.Provider
      value={{
        state,
        updateSettings,
        setAlbums,
        setSpareAlbums,
        updateAlbums,
        toggleAlbumOption,
        deleteAlbum,
        undo,
        canUndo,
        replacementTarget,
        setReplacementTarget,
        swapAlbumWithSpare,
        previousScroll,
        setPreviousScroll,
        isHydrated,
      }}
    >
      {children}
    </CollageContext.Provider>
  );
};

export default CollageProvider;
