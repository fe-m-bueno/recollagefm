import './globals.css';
import { Metadata } from 'next';
import { CollageProvider } from '../context/CollageContext';
import I18nProvider from '@/components/i18nProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://recollagefm.vercel.app'),
  title: 'Recollage - Create Custom Last.fm Album Grids',
  icons: {
    icon: '/favicon.svg',
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
    <html lang="en">
      <head>
        <title>Recollage.fm</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#020617" />
      </head>
      <body aria-live="polite">
        <I18nProvider>
          <CollageProvider>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                {children}
                <Analytics />
                <SpeedInsights />
              </main>
            </div>
          </CollageProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
