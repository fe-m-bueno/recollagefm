import { NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';

export async function POST(request: Request) {
  try {
    const { gridSize, albums } = await request.json();

    let dimension = 3;
    let canvasSize = 900;
    if (gridSize === '3x3') {
      dimension = 3;
      canvasSize = 900;
    } else if (gridSize === '4x4') {
      dimension = 4;
      canvasSize = 1200;
    } else if (gridSize === '5x5') {
      dimension = 5;
      canvasSize = 1500;
    } else if (gridSize === '10x10') {
      dimension = 10;
      canvasSize = 2100;
    }

    const cellSize = Math.floor(canvasSize / dimension);
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < dimension * dimension; i++) {
      const album = albums[i];
      if (!album) continue;
      const row = Math.floor(i / dimension);
      const col = i % dimension;
      const x = col * cellSize;
      const y = row * cellSize;

      try {
        const img = await loadImage(album.imageUrl);
        ctx.drawImage(img, x, y, cellSize, cellSize);
      } catch (error) {
        ctx.fillStyle = '#cccccc';
        ctx.fillRect(x, y, cellSize, cellSize);
      }

      const fontSize = Math.floor(cellSize / 20);
      const lineHeight = fontSize + 4;
      ctx.font = `${fontSize}px system-ui`;
      ctx.textBaseline = 'top';
      ctx.shadowColor = 'black';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 2;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;

      let text = '';
      if (album.displayAlbumName !== false && album.name)
        text += album.name + '\n';
      if (album.displayArtistName !== false && album.artist)
        text += album.artist + '\n';
      if (album.displayPlaycount !== false && album.playcount)
        text += `Plays: ${album.playcount}`;

      const lines = text.split('\n').filter((line) => line.trim() !== '');
      for (let j = 0; j < lines.length; j++) {
        ctx.strokeText(
          lines[j],
          col * cellSize + 5,
          row * cellSize + 5 + j * lineHeight + 0.9
        );
        ctx.fillText(
          lines[j],
          col * cellSize + 5,
          row * cellSize + 5 + j * lineHeight
        );
      }

      ctx.shadowColor = 'transparent';
    }

    const isLargeGrid = dimension === 10;

    const buffer = isLargeGrid
      ? canvas.toBuffer('image/jpeg', { quality: 1 })
      : canvas.toBuffer('image/png');
    return new NextResponse(buffer, {
      headers: { 'Content-Type': isLargeGrid ? 'image/jpeg' : 'image/png' },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to generate collage' },
      { status: 500 }
    );
  }
}
