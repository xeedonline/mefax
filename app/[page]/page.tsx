import { Metadata } from 'next';
import TeletextApp from '@/components/TeletextApp';

interface PageProps {
  params: Promise<{ page: string }>;
}

const PAGE_TITLES: Record<number, string> = {
  100: 'HOME',
  101: 'UK NEWS',
  110: 'WORLD NEWS',
  120: 'TECH NEWS',
  130: 'BUSINESS',
  150: 'WEATHER',
  200: 'LIVE FLIGHTS',
  300: 'FOOTBALL',
  400: 'TV GUIDE',
  500: 'BAMBOOZLE',
  600: 'FINANCE',
  700: 'GAMES',
  800: 'HISTORY',
  999: 'RANDOM',
  1983: 'TODAY IN 1983',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNum = parseInt(page, 10);
  const title = PAGE_TITLES[pageNum] || `PAGE ${pageNum}`;
  return {
    title: `P${pageNum} ${title} — TELETEXT UK`,
    description: `Teletext UK page ${pageNum}: ${title}. The authentic British Teletext experience.`,
  };
}

export default async function TeletextPage({ params }: PageProps) {
  const { page } = await params;
  const pageNum = parseInt(page, 10) || 100;
  const clampedPage = isNaN(pageNum) ? 100 : Math.max(100, pageNum);

  return <TeletextApp initialPage={clampedPage} />;
}
