# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recollage.fm is a Next.js 16 (App Router) web app with React 19 that generates customizable album collage images from a user's Last.fm listening data. Users enter their Last.fm username, fetch top albums, reorder/swap/remove them via drag-and-drop, then generate a PNG collage server-side.

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — run Next.js linter
- No test runner is configured in scripts (jest and playwright are in devDependencies but no test command or test files exist yet)

## Environment Variables

- `LASTFM_API_KEY` — required for the `/api/top-albums` route to call the Last.fm API

## Architecture

### Pages (App Router)

- `/` (`app/page.tsx`) — Landing page with username input form, navigates to `/albums` after fetching data
- `/albums` (`app/albums/page.tsx`) — Album grid editor with drag-and-drop (dnd-kit), undo/redo, spare album swapping, and collage generation trigger
- `/results` (`app/results/page.tsx`) — Displays the generated collage image (read from localStorage)

### API Routes

- `POST /api/generate-collage` — Server-side PNG generation using the `canvas` (node-canvas) library. Registers multiple Noto Sans fonts for multilingual text rendering with per-character font fallback. Supports grid sizes: 3x3, 4x4, 5x5, 10x10.
- `GET /api/top-albums` — Proxies Last.fm `user.gettopalbums` API, transforms response into app's album format

### State Management

- `CollageContext` (`context/CollageContext.tsx`) — Single React Context holding all app state: settings (username, timespan, gridSize, display toggles), albums array, spare albums array. Includes undo/redo history stack and album swap logic. State is persisted to sessionStorage.

### Key Patterns

- **Desktop vs Mobile components**: Separate `AlbumCard`/`AlbumCardMobile` and `AlbumOptions`/`AlbumOptionsMobile` components with different interaction patterns (mobile uses touch-optimized controls)
- **Drag-and-drop**: dnd-kit with `rectSortingStrategy` (desktop) / `verticalListSortingStrategy` (mobile)
- **Fluid typography/spacing**: Uses `fluid-tailwind` plugin with `~` prefix syntax (e.g., `~w-[16rem]/[36rem]`) for responsive fluid values
- **Dark mode**: Toggled via `data-mode` attribute + Tailwind `dark:` classes, persisted to localStorage
- **i18n**: react-i18next with browser language detection; translations in `locales/{en,es,pt-br}/translation.json`
- **SVG imports**: Handled as React components via `@svgr/webpack` (configured in `next.config.ts` for both webpack and Turbopack)
- **React 19**: Uses `use()` hook for reading context instead of `useContext()`
- **Custom hooks**: `useIsMobile(breakpoint?)` in `hooks/useIsMobile.ts` for responsive breakpoint detection
