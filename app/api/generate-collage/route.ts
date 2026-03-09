import { NextResponse } from "next/server";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

registerFont(path.join(process.cwd(), "./public/fonts/NotoSans.ttf"), {
  family: "NotoSans",
});
registerFont(path.join(process.cwd(), "./public/fonts/Inter.ttf"), {
  family: "Inter",
});
registerFont(path.join(process.cwd(), "./public/fonts/NotoSansArabic.ttf"), {
  family: "NotoSansArabic",
});
registerFont(
  path.join(process.cwd(), "./public/fonts/NotoSansDevanagari.ttf"),
  { family: "NotoSansDevanagari" }
);
registerFont(path.join(process.cwd(), "./public/fonts/NotoSansJP.ttf"), {
  family: "NotoSansJP",
});
registerFont(path.join(process.cwd(), "./public/fonts/NotoSansKR.ttf"), {
  family: "NotoSansKR",
});
registerFont(path.join(process.cwd(), "./public/fonts/NotoSansSC.ttf"), {
  family: "NotoSansSC",
});
registerFont(path.join(process.cwd(), "./public/fonts/NotoSansThai.ttf"), {
  family: "NotoSansThai",
});
registerFont(path.join(process.cwd(), "./public/fonts/NotoSerifHebrew.ttf"), {
  family: "NotoSerifHebrew",
});

const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

const FONT_FALLBACKS = [
  { name: "Inter", languages: /[\u0000-\u00FF]/ },
  { name: "NotoSans", languages: /[\u0000-\u00FF]/ },
  { name: "NotoSansJP", languages: /[\u3040-\u30FF\u31F0-\u31FF]/ },
  { name: "NotoSansKR", languages: /[\uAC00-\uD7AF]/ },
  { name: "NotoSansArabic", languages: /[\u0600-\u06FF]/ },
  { name: "NotoSansSC", languages: /[\u4E00-\u9FFF]/ },
  { name: "NotoSansThai", languages: /[\u0E00-\u0E7F]/ },
  { name: "NotoSansDevanagari", languages: /[\u0900-\u097F]/ },
  { name: "NotoSerifHebrew", languages: /[\u0590-\u05FF]/ },
];

const VALID_GRID_SIZES = new Set(["3x3", "4x4", "5x5", "10x10"]);
const IMAGE_FETCH_TIMEOUT = 5000;

function getBestFontForChar(char: string): string {
  for (const font of FONT_FALLBACKS) {
    if (font.languages.test(char)) {
      return font.name;
    }
  }
  return "NotoSans";
}

interface FontRun {
  font: string;
  text: string;
  width: number;
  x: number;
  y: number;
}

interface MeasuredGrapheme {
  char: string;
  font: string;
  width: number;
}

function measureGraphemes(
  ctx: any,
  text: string,
  fontSize: number
): MeasuredGrapheme[] {
  const segments = Array.from(segmenter.segment(text)).map(
    (seg) => seg.segment
  );
  return segments.map((grapheme) => {
    const font = getBestFontForChar(grapheme);
    ctx.font = `${fontSize}px ${font}`;
    return { char: grapheme, font, width: ctx.measureText(grapheme).width };
  });
}

function splitIntoWords(
  graphemes: MeasuredGrapheme[]
): MeasuredGrapheme[][] {
  const words: MeasuredGrapheme[][] = [];
  let current: MeasuredGrapheme[] = [];

  for (const g of graphemes) {
    if (g.char === " " || g.char === "\t") {
      // Attach the space to the end of the current word
      current.push(g);
      words.push(current);
      current = [];
    } else {
      current.push(g);
    }
  }
  if (current.length > 0) words.push(current);
  return words;
}

function wordWidth(word: MeasuredGrapheme[]): number {
  return word.reduce((sum, g) => sum + g.width, 0);
}

function drawTextWithFallback(
  ctx: any,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  maxWidth: number,
  isLargeGrid: boolean
): number {
  let offsetX = x;
  let currentY = y;
  const lineHeight = fontSize + 4;

  const graphemes = measureGraphemes(ctx, text, fontSize);
  const words = splitIntoWords(graphemes);

  // Set styles once before the loop
  ctx.textBaseline = "top";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  if (!isLargeGrid) {
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 2;
    ctx.lineWidth = 1;
  } else {
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
  }

  // Build font runs with word-level wrapping
  const runs: FontRun[] = [];
  let currentRun: FontRun | null = null;

  const flushRun = () => {
    if (currentRun) {
      runs.push(currentRun);
      currentRun = null;
    }
  };

  const pushGrapheme = (g: MeasuredGrapheme) => {
    if (currentRun && currentRun.font === g.font && currentRun.y === currentY) {
      currentRun.text += g.char;
      currentRun.width += g.width;
    } else {
      flushRun();
      currentRun = { font: g.font, text: g.char, width: g.width, x: offsetX, y: currentY };
    }
    offsetX += g.width;
  };

  for (const word of words) {
    const ww = wordWidth(word);

    if (offsetX > x && offsetX + ww > x + maxWidth) {
      // Word doesn't fit on current line — wrap to next line
      flushRun();
      offsetX = x;
      currentY += lineHeight;
    }

    // If a single word is wider than maxWidth, break it character-by-character
    if (ww > maxWidth) {
      for (const g of word) {
        if (offsetX + g.width > x + maxWidth) {
          flushRun();
          offsetX = x;
          currentY += lineHeight;
        }
        pushGrapheme(g);
      }
    } else {
      for (const g of word) {
        pushGrapheme(g);
      }
    }
  }
  flushRun();

  // Draw all runs
  for (const run of runs) {
    ctx.font = `${fontSize}px ${run.font}`;
    if (!isLargeGrid) {
      ctx.shadowColor = "black";
    }
    ctx.strokeText(run.text, run.x, run.y + 0.9);
    ctx.fillText(run.text, run.x, run.y);
  }

  if (!isLargeGrid) {
    ctx.shadowColor = "transparent";
  }

  return currentY + lineHeight;
}

function loadImageWithTimeout(url: string, timeout: number): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  return fetch(url, { signal: controller.signal })
    .then((res) => res.arrayBuffer())
    .then((buf) => loadImage(Buffer.from(buf)))
    .finally(() => clearTimeout(timer));
}

export async function POST(request: Request) {
  try {
    const { gridSize, albums } = await request.json();

    if (!VALID_GRID_SIZES.has(gridSize)) {
      return NextResponse.json(
        { error: "Invalid gridSize. Must be one of: 3x3, 4x4, 5x5, 10x10" },
        { status: 400 }
      );
    }

    if (!Array.isArray(albums) || albums.length === 0 || albums.length > 100) {
      return NextResponse.json(
        { error: "albums must be an array with 1-100 items" },
        { status: 400 }
      );
    }

    let dimension = 3;
    let canvasSize = 900;
    if (gridSize === "4x4") {
      dimension = 4;
      canvasSize = 1200;
    } else if (gridSize === "5x5") {
      dimension = 5;
      canvasSize = 1500;
    } else if (gridSize === "10x10") {
      dimension = 10;
      canvasSize = 1800;
    }

    const isLargeGrid = dimension === 10;
    const cellSize = Math.floor(canvasSize / dimension);
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    const images = await Promise.allSettled(
      albums.map(async (album: any) => {
        try {
          const img = await loadImageWithTimeout(album.imageUrl, IMAGE_FETCH_TIMEOUT);
          return { img, album };
        } catch {
          return { img: null, album };
        }
      })
    );

    images.forEach((result, i) => {
      if (result.status !== "fulfilled" || !result.value) return;

      const { img, album } = result.value;
      const row = Math.floor(i / dimension);
      const col = i % dimension;
      const x = col * cellSize;
      const y = row * cellSize;

      if (img) {
        ctx.drawImage(img, x, y, cellSize, cellSize);
      } else {
        ctx.fillStyle = "#cccccc";
        ctx.fillRect(x, y, cellSize, cellSize);
      }

      const fontSize = isLargeGrid
        ? Math.floor(cellSize / 22)
        : Math.floor(cellSize / 20);
      const maxTextWidth = cellSize - 10;

      let currentY = y + 5;

      if (album.displayAlbumName !== false && album.name) {
        currentY = drawTextWithFallback(
          ctx,
          album.name,
          x + 5,
          currentY,
          fontSize,
          maxTextWidth,
          isLargeGrid
        );
      }

      if (album.displayArtistName !== false && album.artist) {
        currentY = drawTextWithFallback(
          ctx,
          album.artist,
          x + 5,
          currentY,
          fontSize,
          maxTextWidth,
          isLargeGrid
        );
      }

      if (album.displayPlaycount !== false && album.playcount) {
        drawTextWithFallback(
          ctx,
          `Plays: ${album.playcount}`,
          x + 5,
          currentY,
          fontSize,
          maxTextWidth,
          isLargeGrid
        );
      }
    });

    const buffer = canvas.toBuffer("image/png", { compressionLevel: 6 });

    return new NextResponse(new Uint8Array(buffer), {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate collage" },
      { status: 500 }
    );
  }
}
