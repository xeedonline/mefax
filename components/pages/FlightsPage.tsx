'use client';
import { useEffect, useState, useCallback } from 'react';
import { useTeletextStore } from '@/store/teletext';
import { fmtAlt, fmtSpeed } from '@/lib/teletext-utils';

interface Flight {
  callsign: string;
  country: string;
  lat: number | null;
  lon: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
}

const REGIONS: Record<number, { region: string; title: string }> = {
  200: { region: 'uk',      title: 'LIVE FLIGHTS OVER UK' },
  201: { region: 'scotland', title: 'FLIGHTS OVER SCOTLAND' },
  202: { region: 'glasgow',  title: 'GLASGOW AREA FLIGHTS' },
  203: { region: 'london',   title: 'LONDON AREA FLIGHTS' },
  204: { region: 'uk',       title: 'MILITARY AIRCRAFT' },
  205: { region: 'uk',       title: 'INTERESTING FLIGHTS' },
};

function headingArrow(deg: number | null): string {
  if (deg === null) return '?';
  const dirs = ['↑','↗','→','↘','↓','↙','←','↖'];
  return dirs[Math.round(deg / 45) % 8];
}

// Simple ASCII UK map
function AsciiMap({ flights }: { flights: Flight[] }) {
  const MAP = [
    '        .....              ',
    '      SCOTLAND             ',
    '       .....               ',
    '     .....ENGLAND.....     ',
    '    ...WALES......         ',
    '   ..............          ',
    '    ..........             ',
  ];
  return (
    <div className="text-tt-green/60 font-mono text-[0.7em] leading-tight">
      {MAP.map((row, i) => <div key={i}>{row}</div>)}
      <div className="text-tt-cyan text-[0.8em] mt-0.5">
        {flights.slice(0, 3).map(f => `✈${f.callsign.trim().slice(0, 6)}`).join('  ')}
      </div>
    </div>
  );
}

export default function FlightsPage({ pageNum }: { pageNum: number }) {
  const { navigate, setFastTextLinks } = useTeletextStore();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState('');
  const [showMap, setShowMap] = useState(false);

  const cfg = REGIONS[pageNum] ?? REGIONS[200];

  const fetchFlights = useCallback(async () => {
    try {
      const r = await fetch(`/api/flights?region=${cfg.region}`);
      const d = await r.json();
      setFlights(d.flights ?? []);
      setTotal(d.total ?? 0);
      setUpdatedAt(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [cfg.region]);

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 200, label: 'ALL UK' },
      green:  { page: 201, label: 'SCOTLAND' },
      yellow: { page: 203, label: 'LONDON' },
      blue:   { page: 202, label: 'GLASGOW' },
    });
    setLoading(true);
    fetchFlights();
    const id = setInterval(fetchFlights, 60_000);
    return () => clearInterval(id);
  }, [pageNum, fetchFlights, setFastTextLinks]);

  const filtered = pageNum === 204
    ? flights.filter(f => {
        const cs = f.callsign.trim();
        return cs.startsWith('RFR') || cs.startsWith('RRR') || cs.startsWith('ZK') || cs.startsWith('NATO');
      })
    : flights;

  return (
    <div className="tt-reveal h-full overflow-hidden px-1 tt-text">
      <div className="bg-tt-blue text-tt-cyan font-bold text-center py-0.5">
        ✈ {cfg.title}
      </div>

      <div className="flex justify-between text-[0.8em] mt-0.5">
        <span className="text-tt-yellow">{total > 0 ? `${total} A/C TRACKED` : 'SCANNING...'}</span>
        <span className="text-tt-white/50">{updatedAt || 'LOADING...'}</span>
        <button onClick={() => setShowMap(m => !m)} className="text-tt-cyan hover:text-tt-white">
          {showMap ? 'TABLE' : 'MAP'}
        </button>
      </div>

      {loading ? (
        <div className="text-tt-cyan mt-4 text-center tt-blink">■ CONTACTING OPENSKY NETWORK... ■</div>
      ) : showMap ? (
        <AsciiMap flights={filtered} />
      ) : (
        <div className="mt-0.5">
          {/* Column headers */}
          <div className="flex text-tt-yellow font-bold text-[0.85em]">
            <span className="w-[8ch]">CALLSIGN</span>
            <span className="w-[6ch]">CTRY</span>
            <span className="w-[8ch] text-right">ALT</span>
            <span className="w-[7ch] text-right">SPD</span>
            <span className="ml-1">HDG</span>
          </div>
          <div className="text-tt-yellow">{'─'.repeat(38)}</div>

          {filtered.slice(0, 14).map((f, i) => (
            <div key={i} className="flex text-tt-white hover:bg-tt-blue/20 text-[0.9em]">
              <span className="w-[8ch] text-tt-cyan font-bold">{f.callsign.trim().slice(0, 7)}</span>
              <span className="w-[6ch] text-tt-white/60">{f.country.slice(0, 5).toUpperCase()}</span>
              <span className="w-[8ch] text-right text-tt-yellow">{fmtAlt(f.altitude)}</span>
              <span className="w-[7ch] text-right text-tt-white">{fmtSpeed(f.speed)}</span>
              <span className="ml-1 text-tt-green">{headingArrow(f.heading)}</span>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-tt-white/60 mt-2 text-center">NO FLIGHTS IN THIS AREA</div>
          )}
        </div>
      )}

      <div className="absolute bottom-8 left-1 right-1">
        <div className="text-tt-yellow">{'─'.repeat(38)}</div>
        <div className="flex gap-3 text-sm">
          <button onClick={() => navigate(200)} className="text-tt-cyan hover:text-tt-white">200 ALL</button>
          <button onClick={() => navigate(201)} className="text-tt-cyan hover:text-tt-white">201 SCO</button>
          <button onClick={() => navigate(203)} className="text-tt-cyan hover:text-tt-white">203 LDN</button>
          <button onClick={() => navigate(202)} className="text-tt-cyan hover:text-tt-white">202 GLA</button>
          <button onClick={() => navigate(204)} className="text-tt-cyan hover:text-tt-white">204 MIL</button>
        </div>
      </div>
    </div>
  );
}
