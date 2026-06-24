import { lazy, Suspense } from 'react';

// Lazy load every section to keep initial bundle small
const HomePage        = lazy(() => import('./pages/HomePage'));
const NewsPage        = lazy(() => import('./pages/NewsPage'));
const WeatherPage     = lazy(() => import('./pages/WeatherPage'));
const FlightsPage     = lazy(() => import('./pages/FlightsPage'));
const FootballPage    = lazy(() => import('./pages/FootballPage'));
const TVGuidePage     = lazy(() => import('./pages/TVGuidePage'));
const BamboozlePage   = lazy(() => import('./pages/BamboozlePage'));
const FinancePage     = lazy(() => import('./pages/FinancePage'));
const GamesPage       = lazy(() => import('./pages/GamesPage'));
const HistoryPage     = lazy(() => import('./pages/HistoryPage'));
const History1983Page = lazy(() => import('./pages/History1983Page'));
const RandomPage      = lazy(() => import('./pages/RandomPage'));
const OwnAPagePage    = lazy(() => import('./pages/OwnAPagePage'));
const NotFoundPage    = lazy(() => import('./pages/NotFoundPage'));
const EasterEggPage   = lazy(() => import('./pages/EasterEggPage'));

function Loading() {
  return (
    <div className="flex items-center justify-center h-full text-tt-cyan tt-text">
      <div>
        <div className="tt-blink">■ PLEASE WAIT ■</div>
        <div className="text-tt-white/50 mt-2">LOADING PAGE...</div>
      </div>
    </div>
  );
}

interface Props {
  page: number;
}

export default function PageRouter({ page }: Props) {
  let Component: React.ComponentType<{ pageNum: number }>;
  let key = String(page); // remount on page change for tt-reveal animation

  if (page === 100) {
    Component = HomePage as React.ComponentType<{ pageNum: number }>;
  } else if (page >= 101 && page <= 149) {
    Component = NewsPage;
  } else if (page >= 150 && page <= 199) {
    Component = WeatherPage;
  } else if (page >= 200 && page <= 299) {
    Component = FlightsPage;
  } else if (page >= 300 && page <= 399) {
    Component = FootballPage;
  } else if (page >= 400 && page <= 499) {
    Component = TVGuidePage;
  } else if (page >= 500 && page <= 599) {
    Component = BamboozlePage;
  } else if (page >= 600 && page <= 699) {
    Component = FinancePage;
  } else if (page >= 700 && page <= 799) {
    Component = GamesPage;
  } else if (page >= 800 && page <= 899) {
    Component = HistoryPage;
  } else if (page === 999) {
    Component = RandomPage;
  } else if (page === 1983) {
    Component = History1983Page;
  } else if (page === 404 || page === 666 || page === 747 || page === 888) {
    Component = EasterEggPage;
  } else if (page >= 900 && page <= 998) {
    Component = OwnAPagePage;
  } else {
    Component = NotFoundPage;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Component key={key} pageNum={page} />
    </Suspense>
  );
}
