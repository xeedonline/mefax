'use client';
import { useEffect, useState, useCallback } from 'react';
import { useTeletextStore } from '@/store/teletext';

interface City {
  name: string;
  temp: number;
  feelsLike?: number;
  windSpeed: number;
  windDir: string;
  condition: string;
  icon?: string;
  humidity?: number;
  forecast?: { date: string; maxTemp: number; minTemp: number; condition: string; rain: number }[];
}

const REGIONS: Record<number, { region: string; title: string }> = {
  150: { region: 'all',     title: 'UK WEATHER TODAY' },
  151: { region: 'scotland', title: 'SCOTLAND' },
  152: { region: 'england',  title: 'ENGLAND' },
  153: { region: 'wales',    title: 'WALES' },
  154: { region: 'ni',       title: 'NORTHERN IRELAND' },
};

const DAY_ABBR = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

export default function WeatherPage({ pageNum }: { pageNum: number }) {
  const { navigate, setFastTextLinks } = useTeletextStore();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState('');

  const cfg = REGIONS[pageNum] ?? REGIONS[150];

  const fetchWeather = useCallback(async () => {
    try {
      const r = await fetch(`/api/weather?region=${cfg.region}`);
      const d = await r.json();
      setCities(d.cities ?? []);
      setUpdatedAt(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [cfg.region]);

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 151, label: 'SCOTLAND' },
      green:  { page: 152, label: 'ENGLAND' },
      yellow: { page: 153, label: 'WALES' },
      blue:   { page: 154, label: 'N IRELAND' },
    });
    setLoading(true);
    fetchWeather();
    const id = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [pageNum, fetchWeather, setFastTextLinks]);

  // If we have a single city with full forecast, show detail view
  const showDetail = cities.length === 1 && cities[0].forecast;

  return (
    <div className="tt-reveal h-full overflow-hidden px-1 tt-text">
      <div className="bg-tt-cyan text-black font-bold text-center py-0.5">
        ☁ {cfg.title} {updatedAt && <span>— {updatedAt}</span>}
      </div>

      {loading ? (
        <div className="text-tt-cyan mt-4 text-center tt-blink">■ FETCHING WEATHER DATA... ■</div>
      ) : showDetail ? (
        <DetailView city={cities[0]} />
      ) : (
        <div className="mt-1">
          {/* Header row */}
          <div className="flex text-tt-yellow font-bold">
            <span className="w-[13ch]">LOCATION</span>
            <span className="w-[5ch] text-right">TEMP</span>
            <span className="w-[5ch] text-right">WIND</span>
            <span className="ml-2 flex-1">CONDITIONS</span>
          </div>
          <div className="text-tt-yellow">{'─'.repeat(38)}</div>

          {cities.slice(0, 14).map((city) => (
            <div key={city.name} className="flex text-tt-white hover:bg-tt-blue/20">
              <span className="w-[13ch] text-tt-cyan">{city.name.slice(0, 12)}</span>
              <span className="w-[5ch] text-right text-tt-yellow">{city.temp}°</span>
              <span className="w-[5ch] text-right text-tt-white/70">{city.windSpeed}kph</span>
              <span className="ml-2 flex-1 text-tt-white">{city.icon} {city.condition}</span>
            </div>
          ))}
        </div>
      )}

      {/* Forecast strip if we have data for the main index */}
      {!loading && !showDetail && cities[0]?.forecast && (
        <div className="mt-1">
          <div className="text-tt-yellow">{'─'.repeat(38)}</div>
          <div className="text-tt-white font-bold">5-DAY FORECAST — {cities[0]?.name}</div>
          <div className="flex gap-2 mt-0.5 overflow-x-auto">
            {cities[0].forecast.slice(0, 5).map((d, i) => {
              const day = new Date(d.date);
              return (
                <div key={i} className="text-center min-w-[6ch]">
                  <div className="text-tt-cyan">{DAY_ABBR[day.getDay()]}</div>
                  <div className="text-tt-yellow">{d.maxTemp}°</div>
                  <div className="text-tt-white/60">{d.minTemp}°</div>
                  <div className="text-tt-white text-[0.8em]">{d.condition.slice(0, 6)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="absolute bottom-8 left-1 right-1">
        <div className="text-tt-yellow">{'─'.repeat(38)}</div>
        <div className="flex gap-3 text-sm">
          <button onClick={() => navigate(150)} className="text-tt-cyan hover:text-tt-white">150 UK</button>
          <button onClick={() => navigate(151)} className="text-tt-cyan hover:text-tt-white">151 SCO</button>
          <button onClick={() => navigate(152)} className="text-tt-cyan hover:text-tt-white">152 ENG</button>
          <button onClick={() => navigate(153)} className="text-tt-cyan hover:text-tt-white">153 WAL</button>
          <button onClick={() => navigate(154)} className="text-tt-cyan hover:text-tt-white">154 NI</button>
        </div>
      </div>
    </div>
  );
}

function DetailView({ city }: { city: City }) {
  return (
    <div className="mt-1 space-y-0.5">
      <div className="text-tt-yellow font-bold text-[1.1em]">{city.icon} {city.name}</div>
      <div className="text-tt-white">TEMPERATURE: <span className="text-tt-yellow">{city.temp}°C</span></div>
      {city.feelsLike !== undefined && (
        <div className="text-tt-white">FEELS LIKE:  <span className="text-tt-yellow">{city.feelsLike}°C</span></div>
      )}
      <div className="text-tt-white">WIND:        <span className="text-tt-cyan">{city.windDir} {city.windSpeed}KPH</span></div>
      {city.humidity !== undefined && (
        <div className="text-tt-white">HUMIDITY:    <span className="text-tt-cyan">{city.humidity}%</span></div>
      )}
      <div className="text-tt-white">CONDITIONS:  <span className="text-tt-green">{city.condition}</span></div>
    </div>
  );
}
