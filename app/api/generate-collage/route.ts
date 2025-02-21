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
  { family: 'NotoSansDevanagari' }
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
  { name: 'Inter', languages: /[\u0000-\u00FF]/ },
  { name: 'NotoSans', languages: /[\u0000-\u00FF]/ },
  { name: 'NotoSansJP', languages: /[\u3040-\u30FF\u31F0-\u31FF]/ },
  { name: 'NotoSansKR', languages: /[\uAC00-\uD7AF]/ },
  { name: 'NotoSansArabic', languages: /[\u0600-\u06FF]/ },
  { name: 'NotoSansSC', languages: /[\u4E00-\u9FFF]/ },
  { name: 'NotoSansThai', languages: /[\u0E00-\u0E7F]/ },
  { name: 'NotoSansDevanagari', languages: /[\u0900-\u097F]/ },
  { name: 'NotoSerifHebrew', languages: /[\u0590-\u05FF]/ },
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
  maxWidth: number,
  isLargeGrid: boolean
) {
  let offsetX = x;
  const lineHeight = fontSize + 4;

  for (const char of text) {
    const fontToUse = getBestFontForChar(char);
    ctx.font = `${fontSize}px ${fontToUse}`;

    ctx.textBaseline = 'top';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';

    if (!isLargeGrid) {
      ctx.shadowColor = 'black';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 2;
      ctx.lineWidth = 1;
    } else {
      ctx.shadowBlur = 0;
    }

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
    if (gridSize === '4x4') {
      dimension = 4;
      canvasSize = 1200;
    } else if (gridSize === '5x5') {
      dimension = 5;
      canvasSize = 1500;
    } else if (gridSize === '10x10') {
      dimension = 10;
      canvasSize = 1800;
    }

    const isLargeGrid = dimension === 10;
    const cellSize = Math.floor(canvasSize / dimension);
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 📌 Carregamento de imagens mais rápido
    const images = await Promise.allSettled(
      albums.map(async (album: any) => {
        try {
          return { img: await loadImage(album.imageUrl), album };
        } catch {
          return { img: null, album };
        }
      })
    );

    // 📌 Renderiza os álbuns na grade
    images.forEach((result, i) => {
      if (result.status !== 'fulfilled' || !result.value) return;

      const { img, album } = result.value;
      const row = Math.floor(i / dimension);
      const col = i % dimension;
      const x = col * cellSize;
      const y = row * cellSize;

      if (img) {
        ctx.drawImage(img, x, y, cellSize, cellSize);
      } else {
        ctx.fillStyle = '#cccccc';
        ctx.fillRect(x, y, cellSize, cellSize);
      }

      let text = '';
      if (album.displayAlbumName !== false && album.name)
        text += album.name + '\n';
      if (album.displayArtistName !== false && album.artist)
        text += album.artist + '\n';
      if (album.displayPlaycount !== false && album.playcount)
        text += `Plays: ${album.playcount}`;

      const fontSize = isLargeGrid
        ? Math.floor(cellSize / 22)
        : Math.floor(cellSize / 20);
      const maxTextWidth = cellSize - 10;
      const lines = text.split('\n').filter((line) => line.trim() !== '');
      lines.forEach((line, j) => {
        drawTextWithFallback(
          ctx,
          line,
          x + 5,
          y + 5 + j * fontSize * 1.2,
          fontSize,
          maxTextWidth,
          isLargeGrid
        );
      });
    });

    console.log(ctx.font);

    const buffer = canvas.toBuffer('image/png');

    return new NextResponse(buffer, {
      headers: { 'Content-Type': 'image/png' },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to generate collage' },
      { status: 500 }
    );
  }
}
