import './globals.css';
import type { Metadata, Viewport } from 'next';
import { CollageProvider } from '../context/CollageContext';
import I18nProvider from '@/components/i18nProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#020617',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://recollagefm.vercel.app'),
  title: 'Recollage.fm',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  description:
    'Generate personalized album collages from your Last.fm top albums with customizable layouts.',
  keywords:
    'last.fm, collage, album grid, music collage, album artwork, top albums',
  authors: { name: 'Felipe B.' },
  applicationName: 'Recollage - Last.fm Collage Maker',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://recollagefm.com',
    title: 'Recollage - Create Custom Last.fm Album Grids',
    description: 'Generate custom collages from your top Last.fm albums.',
    images: [
      {
        url: '/ogcard.png',
        width: 1200,
        height: 630,
        alt: 'Preview of Recollage Last.fm Collage Maker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recollage - Last.fm Collage Maker',
    description:
      'Create a personalized album grid from your top Last.fm albums.',
    images: ['https://recollagefm.vercel.app/ogcard.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme') || 'light';
                  const theme = storedTheme === 'dark' ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-mode', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Fallback para light se houver erro
                  document.documentElement.setAttribute('data-mode', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body aria-live="polite">
        <I18nProvider>
          <CollageProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">{children}</main>
            </div>
          </CollageProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
