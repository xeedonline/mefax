import type { Metadata, Viewport } from 'next';
import { VT323 } from 'next/font/google';
import './globals.css';

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TELETEXT UK',
  description: 'The authentic British Teletext experience — live news, weather, flights, sport and more. Like Ceefax never died.',
  keywords: ['teletext', 'ceefax', 'BBC', 'retro', 'UK news', 'weather', 'flights'],
  openGraph: {
    title: 'TELETEXT UK',
    description: 'Like Ceefax never died. Live news, weather, flights and more.',
    type: 'website',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={vt323.variable}>
      <body className="bg-black text-white overflow-hidden h-dvh">{children}</body>
    </html>
  );
}
