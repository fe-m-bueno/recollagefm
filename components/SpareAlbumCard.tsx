'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface SpareAlbumCardProps {
  album: any;
}

const SpareAlbumCard: React.FC<SpareAlbumCardProps> = ({ album }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const [imageSrc, setImageSrc] = useState(
    album.imageUrl ? album.imageUrl : '/black-placeholder.png'
  );

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    if (retryCount < maxRetries && album.imageUrl) {
      setRetryCount(retryCount + 1);
      setImageSrc(`${album.imageUrl}?retry=${new Date().getTime()}`);
    } else {
      console.error('Spare album image failed to load after several retries.');
    }
  };

  return (
    <div className="relative w-full h-full">
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-lg" />
      )}
      <Image
        src={imageSrc}
        alt={album.name || 'Placeholder'}
        width={300}
        height={300}
        onLoadingComplete={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-full object-cover rounded-lg ${
          imageLoaded ? 'block' : 'hidden'
        }`}
      />
    </div>
  );
};

export default SpareAlbumCard;
