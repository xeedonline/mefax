'use client';
import { useEffect } from 'react';
import { useTeletextStore } from '@/store/teletext';

// Static football data (live API integration is a future phase)
const TABLES: Record<string, { team: string; p: number; w: number; d: number; l: number; gd: number; pts: number }[]> = {
  premier: [
    { team: 'MANCHESTER CITY', p:38,w:28,d:5,l:5,  gd:52,pts:89 },
    { team: 'ARSENAL',         p:38,w:28,d:5,l:5,  gd:60,pts:89 },
    { team: 'LIVERPOOL',       p:38,w:24,d:7,l:7,  gd:45,pts:79 },
    { team: 'CHELSEA',         p:38,w:20,d:6,l:12, gd:21,pts:66 },
    { team: 'ASTON VILLA',     p:38,w:20,d:8,l:10, gd:22,pts:68 },
    { team: 'TOTTENHAM',       p:38,w:17,d:6,l:15, gd:18,pts:57 },
    { team: 'MAN UNITED',      p:38,w:14,d:4,l:20, gd:-12,pts:46 },
    { team: 'NEWCASTLE',       p:38,w:18,d:4,l:16, gd:14,pts:58 },
  ],
  scottish: [
    { team: 'CELTIC',          p:38,w:29,d:5,l:4,  gd:73,pts:92 },
    { team: 'RANGERS',         p:38,w:25,d:7,l:6,  gd:55,pts:82 },
    { team: 'HEARTS',          p:38,w:19,d:7,l:12, gd:20,pts:64 },
    { team: 'ABERDEEN',        p:38,w:16,d:8,l:14, gd:12,pts:56 },
    { team: 'HIBERNIAN',       p:38,w:13,d:9,l:16, gd:-4,pts:48 },
    { team: 'MOTHERWELL',      p:38,w:11,d:8,l:19, gd:-18,pts:41 },
    { team: 'DUNDEE UNITED',   p:38,w:9, d:7,l:22, gd:-31,pts:34 },
    { team: 'ROSS COUNTY',     p:38,w:7, d:5,l:26, gd:-42,pts:26 },
  ],
};

const RESULTS = [
  { home: 'ARSENAL',         hasg: 3, ag: 1, away: 'MAN UNITED'  },
  { home: 'LIVERPOOL',       hasg: 2, ag: 2, away: 'CHELSEA'     },
  { home: 'MAN CITY',        hasg: 4, ag: 0, away: 'TOTTENHAM'   },
  { home: 'CELTIC',          hasg: 3, ag: 0, away: 'RANGERS'     },
  { home: 'HEARTS',          hasg: 1, ag: 1, away: 'ABERDEEN'    },
];

export default function FootballPage({ pageNum }: { pageNum: number }) {
  const { navigate, setFastTextLinks } = useTeletextStore();

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 301, label: 'SCOTTISH' },
      green:  { page: 303, label: 'PREMIER' },
      yellow: { page: 306, label: 'RESULTS' },
      blue:   { page: 307, label: 'TABLES' },
    });
  }, [setFastTextLinks]);

  if (pageNum === 301 || pageNum === 307) return <TableView league={pageNum === 301 ? 'scottish' : 'premier'} />;
  if (pageNum === 303) return <TableView league="premier" />;
  if (pageNum === 306) return <ResultsView />;

  return (
    <div className="tt-reveal h-full overflow-hidden px-1 tt-text">
      <div className="bg-tt-green text-black font-bold text-center py-0.5">
        ⚽ FOOTBALL ON TELETEXT UK
      </div>
      <div className="mt-2 space-y-1">
        {[
          { page: 301, label: 'SCOTTISH PREMIERSHIP TABLE', color: 'text-tt-cyan' },
          { page: 303, label: 'PREMIER LEAGUE TABLE',       color: 'text-tt-yellow' },
          { page: 305, label: 'FIXTURES',                   color: 'text-tt-white' },
          { page: 306, label: 'RESULTS',                    color: 'text-tt-white' },
          { page: 307, label: 'LEAGUE TABLES',              color: 'text-tt-white' },
        ].map(item => (
          <button
            key={item.page}
            onClick={() => navigate(item.page)}
            className="w-full text-left flex gap-2 hover:bg-tt-blue/20 px-1 py-0.5"
          >
            <span className="text-tt-white">{item.page}</span>
            <span className={item.color}>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 text-tt-white/50 text-[0.8em]">
        LIVE SCORES UPDATE EVERY 60 SECONDS
      </div>
      <div className="mt-1 text-tt-yellow/50 text-[0.8em]">
        LIVE SCORE API INTEGRATION COMING SOON
      </div>
    </div>
  );
}

function TableView({ league }: { league: 'premier' | 'scottish' }) {
  const teams = TABLES[league] ?? [];
  const title = league === 'premier' ? 'PREMIER LEAGUE' : 'SCOTTISH PREMIERSHIP';

  return (
    <div className="tt-reveal h-full overflow-hidden px-1 tt-text">
      <div className="bg-tt-green text-black font-bold text-center py-0.5">⚽ {title}</div>
      <div className="flex text-tt-yellow font-bold text-[0.8em] mt-0.5">
        <span className="flex-1">TEAM</span>
        <span className="w-[3ch] text-center">P</span>
        <span className="w-[3ch] text-center">W</span>
        <span className="w-[3ch] text-center">D</span>
        <span className="w-[3ch] text-center">L</span>
        <span className="w-[4ch] text-center">GD</span>
        <span className="w-[4ch] text-center">PTS</span>
      </div>
      <div className="text-tt-yellow">{'─'.repeat(38)}</div>
      {teams.map((t, i) => (
        <div key={t.team} className={`flex text-[0.85em] ${i < 3 ? 'text-tt-cyan' : i >= teams.length - 2 ? 'text-tt-red' : 'text-tt-white'}`}>
          <span className="text-tt-white/40 w-[2ch]">{i+1}</span>
          <span className="flex-1">{t.team.slice(0,16)}</span>
          <span className="w-[3ch] text-center">{t.p}</span>
          <span className="w-[3ch] text-center">{t.w}</span>
          <span className="w-[3ch] text-center">{t.d}</span>
          <span className="w-[3ch] text-center">{t.l}</span>
          <span className="w-[4ch] text-center">{t.gd > 0 ? `+${t.gd}` : t.gd}</span>
          <span className="w-[4ch] text-center font-bold">{t.pts}</span>
        </div>
      ))}
      <div className="text-tt-white/40 text-[0.75em] mt-1">DATA MAY NOT REFLECT CURRENT SEASON</div>
    </div>
  );
}

function ResultsView() {
  return (
    <div className="tt-reveal h-full overflow-hidden px-1 tt-text">
      <div className="bg-tt-green text-black font-bold text-center py-0.5">⚽ RECENT RESULTS</div>
      <div className="mt-1 space-y-0.5">
        {RESULTS.map((r, i) => (
          <div key={i} className="flex gap-1 items-center text-[0.9em]">
            <span className="flex-1 text-right text-tt-cyan">{r.home.slice(0,12)}</span>
            <span className="text-tt-yellow font-bold w-[5ch] text-center">{r.hasg}-{r.ag}</span>
            <span className="flex-1 text-tt-cyan">{r.away.slice(0,12)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
