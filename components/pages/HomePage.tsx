'use client';
import { useEffect, useState } from 'react';
import { useTeletextStore } from '@/store/teletext';
import { weatherLabel } from '@/lib/teletext-utils';

interface HomeData {
  weather?: { name: string; temp: number; condition: string; conditionCode: number };
  news?: { title: string }[];
  flights?: { callsign: string; altitude: number }[];
}

export default function HomePage() {
  const { navigate, setFastTextLinks } = useTeletextStore();
  const [data, setData] = useState<HomeData>({});

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 101,  label: 'NEWS' },
      green:  { page: 150,  label: 'WEATHER' },
      yellow: { page: 200,  label: 'FLIGHTS' },
      blue:   { page: 500,  label: 'BAMBOOZLE' },
    });

    // Fetch a quick weather snapshot for London
    fetch('/api/weather?city=LONDON')
      .then((r) => r.json())
      .then((d) => {
        const city = d.cities?.[0];
        if (city) setData((p) => ({ ...p, weather: { name: city.name, temp: city.temp, condition: city.condition, conditionCode: city.conditionCode } }));
      })
      .catch(() => {});

    fetch('/api/news?cat=top')
      .then((r) => r.json())
      .then((d) => {
        if (d.items) setData((p) => ({ ...p, news: d.items.slice(0, 3) }));
      })
      .catch(() => {});

    fetch('/api/flights?region=uk')
      .then((r) => r.json())
      .then((d) => {
        if (d.flights?.[0]) setData((p) => ({ ...p, flights: d.flights.slice(0, 2) }));
      })
      .catch(() => {});
  }, [setFastTextLinks]);

  const { icon } = weatherLabel(data.weather?.conditionCode ?? 0);

  return (
    <div className="tt-reveal h-full overflow-hidden p-0 tt-text">
      {/* Title block */}
      <div className="bg-tt-cyan text-black text-center font-bold py-0.5 text-[1.15em]">
        {'★ WELCOME TO TELETEXT UK ★'.padEnd(40, ' ').slice(0, 40)}
      </div>
      <div className="bg-tt-blue text-tt-yellow text-center py-0.5">
        WHERE THE 80s MEET THE INTERNET
      </div>

      <div className="mt-1 px-1 space-y-0.5">
        {/* Live snapshot row */}
        <div className="text-tt-yellow">{'─'.repeat(38)}</div>

        <div className="flex gap-2">
          <span className="text-tt-cyan w-10">WTHR</span>
          <span className="text-tt-white">
            {data.weather
              ? `${data.weather.name} ${data.weather.temp}°C ${icon} ${data.weather.condition}`
              : 'FETCHING...'}
          </span>
        </div>

        <div className="flex gap-2">
          <span className="text-tt-cyan w-10">NEWS</span>
          <span className="text-tt-white truncate max-w-full">
            {data.news?.[0]?.title ?? 'LOADING HEADLINES...'}
          </span>
        </div>

        <div className="flex gap-2">
          <span className="text-tt-cyan w-10">FLT</span>
          <span className="text-tt-white">
            {data.flights?.[0]
              ? `${data.flights[0].callsign.trim()} AT ${Math.round((data.flights[0].altitude || 0) * 3.281 / 100) * 100}FT`
              : 'LOADING FLIGHTS...'}
          </span>
        </div>

        <div className="text-tt-yellow">{'─'.repeat(38)}</div>

        {/* Navigation index */}
        <div className="text-tt-white font-bold mt-1"> QUICK GUIDE</div>
        <div className="grid grid-cols-2 gap-x-4 mt-1">
          {[
            { page: 101, label: 'NEWS', color: 'text-tt-cyan' },
            { page: 150, label: 'WEATHER', color: 'text-tt-cyan' },
            { page: 200, label: 'FLIGHTS', color: 'text-tt-cyan' },
            { page: 300, label: 'FOOTBALL', color: 'text-tt-cyan' },
            { page: 400, label: 'TV GUIDE', color: 'text-tt-cyan' },
            { page: 500, label: 'BAMBOOZLE', color: 'text-tt-yellow' },
            { page: 600, label: 'FINANCE', color: 'text-tt-cyan' },
            { page: 700, label: 'GAMES', color: 'text-tt-green' },
            { page: 800, label: 'HISTORY', color: 'text-tt-cyan' },
            { page: 1983, label: 'TODAY IN 1983', color: 'text-tt-green' },
            { page: 900, label: 'OWN A PAGE', color: 'text-tt-magenta' },
            { page: 999, label: 'RANDOM PAGE', color: 'text-tt-yellow' },
          ].map(({ page, label, color }) => (
            <button
              key={page}
              onClick={() => navigate(page)}
              className={`text-left hover:bg-tt-blue/20 px-0.5 transition-colors`}
            >
              <span className="text-tt-white">{String(page).padEnd(4)}</span>
              <span className={color}>{label}</span>
            </button>
          ))}
        </div>

        <div className="text-tt-yellow mt-1">{'─'.repeat(38)}</div>

        {/* Easter egg teaser */}
        <div className="text-tt-white/50 text-xs mt-0.5">
          HINT: TRY PAGES 404 · 666 · 747 · 1983
        </div>
      </div>

      {/* FastText hint */}
      <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 flex gap-2 text-xs">
        <span className="bg-tt-red text-white px-1">101 NEWS</span>
        <span className="bg-tt-green text-black px-1">150 WEATHR</span>
        <span className="bg-tt-yellow text-black px-1">200 FLIGHT</span>
        <span className="bg-tt-blue text-white px-1">500 QUIZ</span>
      </div>
    </div>
  );
}
