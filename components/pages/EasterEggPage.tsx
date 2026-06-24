'use client';
import { useEffect } from 'react';
import { useTeletextStore } from '@/store/teletext';

const EGGS: Record<number, { title: string; color: string; textColor: string; lines: { c: string; t: string }[] }> = {
  404: {
    title: 'PAGE NOT FOUND',
    color: 'bg-tt-red',
    textColor: 'text-white',
    lines: [
      { c: 'text-tt-yellow', t: '' },
      { c: 'text-tt-yellow', t: '         ░░░░░░░░░░░░░░░░░' },
      { c: 'text-tt-yellow', t: '         ░                ░' },
      { c: 'text-tt-yellow', t: '         ░   ERROR: 404   ░' },
      { c: 'text-tt-yellow', t: '         ░                ░' },
      { c: 'text-tt-yellow', t: '         ░  PAGE NOT      ░' },
      { c: 'text-tt-yellow', t: '         ░    FOUND       ░' },
      { c: 'text-tt-yellow', t: '         ░                ░' },
      { c: 'text-tt-yellow', t: '         ░░░░░░░░░░░░░░░░░' },
      { c: 'text-tt-white',  t: '' },
      { c: 'text-tt-white',  t: 'PERHAPS IT CYCLES ON THE NEXT PASS...' },
      { c: 'text-tt-cyan',   t: 'PRESS HOME TO RETURN TO PAGE 100' },
    ],
  },
  666: {
    title: '★ DEVIL\'S PAGE ★',
    color: 'bg-tt-red',
    textColor: 'text-yellow',
    lines: [
      { c: 'text-tt-red',    t: '' },
      { c: 'text-tt-yellow', t: '     ⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀' },
      { c: 'text-tt-white',  t: '  YOU HAVE FOUND THE DEVIL\'S PAGE' },
      { c: 'text-tt-red',    t: '' },
      { c: 'text-tt-yellow', t: '   PAGE 666 — BROADCASTER\'S NIGHTMARE' },
      { c: 'text-tt-white',  t: '' },
      { c: 'text-tt-white',  t: '  IN THE GOLDEN AGE OF CEEFAX, PAGE 666' },
      { c: 'text-tt-white',  t: '  WAS ALWAYS DREADED BY ENGINEERS...' },
      { c: 'text-tt-white',  t: '' },
      { c: 'text-tt-cyan',   t: '  IT WAS ALWAYS SUBTITLES. NOTHING SINISTER.' },
      { c: 'text-tt-white/50', t: '' },
      { c: 'text-tt-white/50', t: '  BUT STILL... SPOOKY.' },
    ],
  },
  747: {
    title: '✈ PLANE SPOTTERS SPECIAL',
    color: 'bg-tt-blue',
    textColor: 'text-white',
    lines: [
      { c: 'text-tt-cyan',  t: '' },
      { c: 'text-tt-white', t: '         __|__' },
      { c: 'text-tt-white', t: '        /  |  \\' },
      { c: 'text-tt-cyan',  t: '   ====(____|____)====' },
      { c: 'text-tt-white', t: '         |   |' },
      { c: 'text-tt-white', t: '' },
      { c: 'text-tt-yellow', t: '    BOEING 747 — QUEEN OF THE SKIES' },
      { c: 'text-tt-white',  t: '    FIRST FLIGHT: FEBRUARY 9, 1969' },
      { c: 'text-tt-white',  t: '    MAX RANGE: 13,450 KM' },
      { c: 'text-tt-white',  t: '    CAPACITY: UP TO 660 PASSENGERS' },
      { c: 'text-tt-cyan',   t: '' },
      { c: 'text-tt-cyan',   t: '    FOR LIVE FLIGHTS: SEE PAGE 200' },
    ],
  },
  888: {
    title: 'P888 SUBTITLES BBC1',
    color: 'bg-tt-white',
    textColor: 'text-black',
    lines: [
      { c: 'text-tt-white', t: '' },
      { c: 'text-tt-white', t: '' },
      { c: 'text-tt-white', t: '' },
      { c: 'text-tt-white', t: '' },
      { c: 'text-tt-white', t: '' },
      { c: 'text-tt-white', t: '' },
      { c: 'text-tt-white', t: '' },
      { c: 'bg-black text-tt-yellow text-center', t: '"AND NOW THE WEATHER..."' },
      { c: 'bg-black text-tt-white text-center', t: 'SUBTITLES FOR THE DEAF: P888' },
      { c: 'text-tt-white', t: '' },
      { c: 'text-tt-white/50 text-center text-[0.8em]', t: 'BBC PAGE 888 HAS CARRIED SUBTITLES SINCE 1979' },
    ],
  },
};

export default function EasterEggPage({ pageNum }: { pageNum: number }) {
  const { navigate, setFastTextLinks } = useTeletextStore();
  const egg = EGGS[pageNum] ?? EGGS[404];

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 100,  label: 'HOME' },
      green:  { page: 999,  label: 'RANDOM' },
      yellow: { page: 1983, label: '1983' },
      blue:   { page: 500,  label: 'QUIZ' },
    });
  }, [setFastTextLinks, pageNum]);

  return (
    <div className="tt-reveal h-full overflow-hidden tt-text">
      <div className={`${egg.color} ${egg.textColor} font-bold text-center py-0.5`}>
        ★ TELETEXT UK — {egg.title} ★
      </div>
      <div className="px-1 mt-0.5 space-y-0.5">
        {egg.lines.map((l, i) => (
          <div key={i} className={l.c}>{l.t || <>&nbsp;</>}</div>
        ))}
      </div>
      <div className="absolute bottom-10 left-1 right-1">
        <div className="text-tt-yellow">{'─'.repeat(38)}</div>
        <button onClick={() => navigate(100)} className="text-tt-cyan hover:text-tt-white">
          ← 100 RETURN TO HOME
        </button>
      </div>
    </div>
  );
}
