'use client';
import { useState, useEffect } from 'react';
import { useTeletextStore } from '@/store/teletext';
import historyData from '@/data/history-data.json';

type YearStr = keyof typeof historyData.years;

const VALID_YEARS: YearStr[] = ['1980','1981','1982','1983','1984','1985','1986','1987','1988','1989'];

export default function History1983Page() {
  const { navigate, setFastTextLinks } = useTeletextStore();
  const [year, setYear] = useState<YearStr>('1983');
  const [tab, setTab] = useState<'singles' | 'news' | 'prices'>('singles');

  const data = historyData.years[year];
  const now = historyData.nowPrices;
  const currentMonth = new Date().getMonth() + 1;

  // Find the Number 1 for the current month
  const monthN1 = data.number1s.find(n => n.month === currentMonth) ?? data.number1s[0];

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 1983, label: 'SINGLES' },
      green:  { page: 1983, label: 'NEWS' },
      yellow: { page: 1983, label: 'PRICES' },
      blue:   { page: 800,  label: 'HISTORY' },
    });
  }, [setFastTextLinks]);

  return (
    <div className="tt-reveal h-full overflow-hidden tt-text">
      {/* Header */}
      <div className="bg-tt-green text-black font-bold text-center py-0.5">
        ⏮ TODAY IN {year} ⏮
      </div>

      {/* Year selector */}
      <div className="flex items-center gap-1 px-1 mt-0.5 overflow-x-auto">
        <span className="text-tt-white/50 text-[0.8em] shrink-0">YEAR:</span>
        {VALID_YEARS.map(y => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={`px-1 text-[0.85em] shrink-0 transition-colors ${
              year === y ? 'bg-tt-green text-black font-bold' : 'text-tt-cyan hover:text-tt-white'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Tab selector */}
      <div className="flex gap-0 mt-0.5 border-b border-tt-yellow/30">
        {(['singles', 'news', 'prices'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-0.5 text-[0.85em] transition-colors ${
              tab === t ? 'bg-tt-yellow text-black font-bold' : 'text-tt-yellow/60 hover:text-tt-yellow'
            }`}
          >
            {t === 'singles' ? '🎵 SINGLES' : t === 'news' ? '📰 NEWS' : '💰 PRICES'}
          </button>
        ))}
      </div>

      <div className="px-1 mt-0.5 overflow-y-auto">
        {/* ── SINGLES TAB ── */}
        {tab === 'singles' && (
          <div>
            <div className="bg-tt-cyan text-black font-bold py-0.5 px-1">
              THIS MONTH IN {year}: UK NUMBER ONE
            </div>
            <div className="mt-1 text-tt-yellow text-[1.1em]">
              "{monthN1.title}"
            </div>
            <div className="text-tt-white">by {monthN1.artist}</div>

            <div className="mt-2 text-tt-cyan font-bold">ALL {year} NUMBER ONES:</div>
            <div className="mt-0.5 space-y-0.5">
              {data.number1s.map((n, i) => {
                const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
                return (
                  <div key={i} className="flex gap-2">
                    <span className="text-tt-white/50 w-[4ch]">{months[n.month - 1]}</span>
                    <span className="text-tt-yellow">{n.title}</span>
                    <span className="text-tt-white/70 ml-auto shrink-0">— {n.artist.slice(0, 15)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── NEWS TAB ── */}
        {tab === 'news' && (
          <div>
            <div className="bg-tt-red text-white font-bold py-0.5 px-1">
              MAJOR EVENTS OF {year}
            </div>
            <div className="mt-1 space-y-1">
              {data.news.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-tt-yellow">▶</span>
                  <span className="text-tt-white">{item}</span>
                </div>
              ))}
            </div>
            {('albums' in data) && (data as { albums?: { month: number; title: string; artist: string }[] }).albums && (
              <div className="mt-2">
                <div className="text-tt-cyan font-bold">NUMBER ONE ALBUMS:</div>
                {(data as { albums: { month: number; title: string; artist: string }[] }).albums.map((a, i) => {
                  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
                  return (
                    <div key={i} className="text-tt-white">
                      <span className="text-tt-white/50">{months[a.month - 1]} </span>
                      <span className="text-tt-yellow">{a.title}</span>
                      <span className="text-tt-white"> — {a.artist}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── PRICES TAB ── */}
        {tab === 'prices' && (
          <div>
            <div className="bg-tt-yellow text-black font-bold py-0.5 px-1">
              THEN vs NOW — {year} vs 2026
            </div>
            <div className="mt-1">
              <div className="flex gap-2 text-[0.85em] text-tt-white/50 font-bold">
                <span className="flex-1">ITEM</span>
                <span className="w-[8ch] text-right">IN {year}</span>
                <span className="w-[8ch] text-right">TODAY</span>
                <span className="w-[8ch] text-right">CHANGE</span>
              </div>
              <div className="text-tt-yellow">{'─'.repeat(38)}</div>

              {[
                { label: 'PETROL (LITRE)',    then: data.prices.petrol_ppl/100, now: now.petrol_ppl/100, fmt: (v:number) => `${v.toFixed(2)}p` },
                { label: 'AVERAGE HOUSE',     then: data.prices.house_avg, now: now.house_avg, fmt: (v:number) => `£${Math.round(v/1000)}k` },
                { label: 'AVERAGE WAGE',      then: data.prices.wage_avg, now: now.wage_avg, fmt: (v:number) => `£${Math.round(v/1000)}k` },
                { label: 'PINT OF BEER',      then: data.prices.pint_beer/100, now: now.pint_beer/100, fmt: (v:number) => `£${v.toFixed(2)}` },
              ].map(row => {
                const pct = Math.round(((row.now - row.then) / row.then) * 100);
                return (
                  <div key={row.label} className="flex gap-2 items-center text-[0.9em]">
                    <span className="flex-1 text-tt-cyan">{row.label}</span>
                    <span className="w-[8ch] text-right text-tt-white">{row.fmt(row.then)}</span>
                    <span className="w-[8ch] text-right text-tt-white">{row.fmt(row.now)}</span>
                    <span className={`w-[8ch] text-right ${pct > 200 ? 'text-tt-red' : pct > 100 ? 'text-tt-yellow' : 'text-tt-green'}`}>
                      +{pct}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 text-tt-white/50 text-[0.8em]">
              ALL PRICES ARE APPROXIMATE
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="absolute bottom-8 left-1 right-1">
        <div className="flex gap-3 text-[0.85em]">
          <button onClick={() => navigate(800)} className="text-tt-cyan">800 HISTORY</button>
          <button onClick={() => navigate(100)} className="text-tt-white/50">100 HOME</button>
        </div>
      </div>
    </div>
  );
}
