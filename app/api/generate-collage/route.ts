import { NextResponse } from 'next/server';
import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';

registerFont(path.join(process.cwd(), './public/fonts/NotoSans.ttf'), {
  family: 'NotoSans',
});
registerFont(path.join(process.cwd(), './public/fonts/Inter.ttf'), {
  family: 'Inter',
});
registerFont(path.join(process.cwd(), './public/fonts/NotoSansArabic.ttf'), {
  family: 'NotoSansArabic',
});
registerFont(
  path.join(process.cwd(), './public/fonts/NotoSansDevanagari.ttf'),
  {
    family: 'NotoSansDevanagari',
  }
);
registerFont(path.join(process.cwd(), './public/fonts/NotoSansJP.ttf'), {
  family: 'NotoSansJP',
});
registerFont(path.join(process.cwd(), './public/fonts/NotoSansKR.ttf'), {
  family: 'NotoSansKR',
});
registerFont(path.join(process.cwd(), './public/fonts/NotoSansSC.ttf'), {
  family: 'NotoSansSC',
});
registerFont(path.join(process.cwd(), './public/fonts/NotoSansThai.ttf'), {
  family: 'NotoSansThai',
});
registerFont(path.join(process.cwd(), './public/fonts/NotoSerifHebrew.ttf'), {
  family: 'NotoSerifHebrew',
});

const FONT_FALLBACKS = [
  { name: 'Inter', languages: /[\u0000-\u00FF]/ }, // Inglês e latim básico
  { name: 'NotoSans', languages: /[\u0000-\u00FF]/ }, // Caracteres básicos latinos
  { name: 'NotoSansJP', languages: /[\u3040-\u30FF\u31F0-\u31FF]/ }, // Japonês
  { name: 'NotoSansKR', languages: /[\uAC00-\uD7AF]/ }, // Coreano
  { name: 'NotoSansArabic', languages: /[\u0600-\u06FF]/ }, // Árabe
  { name: 'NotoSansSC', languages: /[\u4E00-\u9FFF]/ }, // Chinês Simplificado
  { name: 'NotoSansThai', languages: /[\u0E00-\u0E7F]/ }, // Tailandês
  { name: 'NotoSansDevanagari', languages: /[\u0900-\u097F]/ }, // Hindi e Devanagari
  { name: 'NotoSerifHebrew', languages: /[\u0590-\u05FF]/ }, // Hebraico
];

function getBestFontForChar(char: string): string {
  for (const font of FONT_FALLBACKS) {
    if (font.languages.test(char)) {
      return font.name;
    }
  }
  return 'NotoSans';
}

function drawTextWithFallback(
  ctx: any,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  maxWidth: number
) {
  let offsetX = x;
  const lineHeight = fontSize + 4;

  for (const char of text) {
    const fontToUse = getBestFontForChar(char);
    ctx.font = `${fontSize}px ${fontToUse}`;

    ctx.textBaseline = 'top';
    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 2;
    ctx.lineWidth = 1;

    if (offsetX + ctx.measureText(char).width > x + maxWidth) {
      offsetX = x;
      y += lineHeight;
    }

    ctx.strokeText(char, offsetX, y + 0.9);
    ctx.fillText(char, offsetX, y);

    ctx.shadowColor = 'transparent';

    offsetX += ctx.measureText(char).width;
  }
}

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
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, cellSize, cellSize);
      }

      let text = '';
      if (album.displayAlbumName !== false && album.name)
        text += album.name + '\n';
      if (album.displayArtistName !== false && album.artist)
        text += album.artist + '\n';
      if (album.displayPlaycount !== false && album.playcount)
        text += `Plays: ${album.playcount}`;

      const fontSize = Math.floor(cellSize / 20);
      const lineHeight = fontSize + 4;
      const maxTextWidth = cellSize - 10;

      const lines = text.split('\n').filter((line) => line.trim() !== '');
      for (let j = 0; j < lines.length; j++) {
        drawTextWithFallback(
          ctx,
          lines[j],
          col * cellSize + 5,
          row * cellSize + 5 + j * lineHeight,
          fontSize,
          maxTextWidth
        );
      }
    }

    const isLargeGrid = dimension === 10;
    console.log(ctx.font);

    const buffer = isLargeGrid
      ? canvas.toBuffer('image/jpeg', { quality: 0.8 })
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
