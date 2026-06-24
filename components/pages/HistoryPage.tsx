'use client';
import { useEffect } from 'react';
import { useTeletextStore } from '@/store/teletext';

const TIMELINE = [
  { year: '1974', event: 'CEEFAX LAUNCHES ON BBC — THE WORLD\'S FIRST TELETEXT SERVICE' },
  { year: '1976', event: 'ORACLE LAUNCHES ON ITV' },
  { year: '1979', event: 'TELETEXT RECEIVERS BECOME WIDELY AVAILABLE IN UK HOMES' },
  { year: '1982', event: 'CHANNEL 4 LAUNCHES WITH TELETEXT FROM DAY ONE' },
  { year: '1983', event: 'BAMBOOZLE QUIZ LAUNCHES ON CHANNEL 4 TELETEXT' },
  { year: '1984', event: 'TELETEXT IN 8 MILLION UK HOMES' },
  { year: '1992', event: 'TELETEXT LTD TAKES OVER ORACLE ON ITV/C4/C5' },
  { year: '1997', event: 'CHANNEL 4 TELETEXT RELAUNCHED' },
  { year: '2001', event: 'DIGITAL TELETEXT LAUNCHES ON FREEVIEW' },
  { year: '2007', event: 'TELETEXT TRAVEL AGENCY CLOSES' },
  { year: '2009', event: 'ITV CEASES TELETEXT SERVICE' },
  { year: '2012', event: 'CEEFAX ENDS PERMANENTLY — FINAL BROADCAST 23 OCT' },
  { year: '2026', event: 'TELETEXT UK RELAUNCHES — THE LEGEND LIVES ON!' },
];

export default function HistoryPage({ pageNum }: { pageNum: number }) {
  const { navigate, setFastTextLinks } = useTeletextStore();

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 800,  label: 'ABOUT' },
      green:  { page: 801,  label: 'HOW IT WORKED' },
      yellow: { page: 802,  label: 'TIMELINE' },
      blue:   { page: 1983, label: 'TODAY 1983' },
    });
  }, [setFastTextLinks]);

  if (pageNum === 801) return <HowItWorked />;
  if (pageNum === 802) return <TimelinePage />;
  if (pageNum === 888) return <SubtitlesPage />;

  // 800 — About Teletext
  return (
    <div className="tt-reveal h-full overflow-y-auto px-1 tt-text">
      <div className="bg-tt-cyan text-black font-bold text-center py-0.5">
        ■ ABOUT TELETEXT ■
      </div>
      <div className="mt-1 space-y-1 text-tt-white">
        <div className="text-tt-yellow font-bold">WHAT WAS TELETEXT?</div>
        <p>TELETEXT WAS A BROADCAST DATA SERVICE TRANSMITTED ALONGSIDE ANALOGUE TV SIGNALS IN THE UK FROM 1974.</p>
        <p>USING A SPECIAL DECODER BUILT INTO YOUR TELEVISION, VIEWERS COULD ACCESS HUNDREDS OF PAGES OF INFORMATION AT THE PRESS OF A BUTTON.</p>
        <div className="text-tt-yellow font-bold mt-1">THE UK SERVICES</div>
        <div className="flex gap-2"><span className="text-tt-cyan">BBC:</span><span>CEEFAX (1974–2012)</span></div>
        <div className="flex gap-2"><span className="text-tt-cyan">ITV:</span><span>ORACLE (1976–1992)</span></div>
        <div className="flex gap-2"><span className="text-tt-cyan">CH4:</span><span>TELETEXT (1982–2009)</span></div>
        <div className="flex gap-2"><span className="text-tt-cyan">CH5:</span><span>TELETEXT (1997–2009)</span></div>
        <div className="text-tt-yellow font-bold mt-1">PAGES</div>
        <p>PAGES WERE NUMBERED 100-899. BBC PAGE 888 WAS FAMOUSLY USED FOR SUBTITLES FOR THE DEAF AND HARD OF HEARING.</p>
        <div className="text-tt-yellow font-bold mt-1">LEGACY</div>
        <p>TELETEXT UK CONTINUES THIS GREAT TRADITION INTO THE INTERNET AGE.</p>
      </div>
      <div className="mt-2 flex gap-3 text-[0.85em]">
        <button onClick={() => navigate(801)} className="text-tt-cyan hover:text-tt-white">801 HOW IT WORKED</button>
        <button onClick={() => navigate(802)} className="text-tt-cyan hover:text-tt-white">802 TIMELINE</button>
        <button onClick={() => navigate(1983)} className="text-tt-green hover:text-tt-white">1983 HISTORY</button>
      </div>
    </div>
  );
}

function HowItWorked() {
  return (
    <div className="tt-reveal h-full overflow-y-auto px-1 tt-text">
      <div className="bg-tt-cyan text-black font-bold text-center py-0.5">
        ■ HOW CEEFAX WORKED ■
      </div>
      <div className="mt-1 space-y-1 text-tt-white">
        <p>TELETEXT DATA WAS HIDDEN IN THE VERTICAL BLANKING INTERVAL (VBI) OF THE TV SIGNAL — THE BLACK BAR YOU SAW WHEN THE PICTURE ROLLED.</p>
        <div className="text-tt-yellow font-bold">THE CHARACTERS</div>
        <p>EACH PAGE WAS 40 COLUMNS × 25 ROWS. CHARACTERS WERE FORMED BY A DEDICATED CHIP — THE MULLARD SAA5050 — WHICH GENERATED 7×9 PIXEL CELLS AT 960×625 RESOLUTION.</p>
        <div className="text-tt-yellow font-bold">THE COLOURS</div>
        <div className="flex gap-2 flex-wrap mt-0.5">
          {[
            {c:'bg-tt-white',  t:'text-black', l:'WHITE'},
            {c:'bg-tt-yellow', t:'text-black', l:'YELLOW'},
            {c:'bg-tt-cyan',   t:'text-black', l:'CYAN'},
            {c:'bg-tt-green',  t:'text-black', l:'GREEN'},
            {c:'bg-tt-magenta',t:'text-black', l:'MAGENTA'},
            {c:'bg-tt-red',    t:'text-white', l:'RED'},
            {c:'bg-tt-blue',   t:'text-white', l:'BLUE'},
          ].map(({c,t,l}) => (
            <span key={l} className={`${c} ${t} px-1 text-[0.8em]`}>{l}</span>
          ))}
        </div>
        <div className="text-tt-yellow font-bold mt-1">FASTTEXT</div>
        <p>INTRODUCED IN 1988, FASTTEXT ALLOWED COLOURED BUTTONS ON THE REMOTE CONTROL TO JUMP DIRECTLY TO LINKED PAGES — MUCH FASTER THAN TYPING PAGE NUMBERS.</p>
        <div className="text-tt-yellow font-bold">LOADING TIME</div>
        <p>PAGES BROADCAST REPEATEDLY IN A CYCLE. WITH 800 PAGES AT 8 PAGES PER SECOND, YOU MIGHT WAIT OVER A MINUTE FOR YOUR PAGE!</p>
      </div>
    </div>
  );
}

function TimelinePage() {
  return (
    <div className="tt-reveal h-full overflow-y-auto px-1 tt-text">
      <div className="bg-tt-yellow text-black font-bold text-center py-0.5">
        ■ TELETEXT TIMELINE ■
      </div>
      <div className="mt-1 space-y-0.5">
        {TIMELINE.map(({ year, event }) => (
          <div key={year} className="flex gap-2">
            <span className={`text-tt-cyan font-bold shrink-0 w-[5ch] ${year === '2026' ? 'text-tt-yellow' : ''}`}>
              {year}
            </span>
            <span className={`text-tt-white text-[0.9em] ${year === '2026' ? 'text-tt-green' : ''}`}>
              {event}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubtitlesPage() {
  return (
    <div className="tt-reveal h-full flex flex-col tt-text px-1">
      <div className="bg-tt-white text-black font-bold text-center py-0.5">
        P888  SUBTITLES  BBC1
      </div>
      <div className="flex-1 flex items-end pb-16">
        <div className="w-full">
          <div className="bg-black/80 text-tt-yellow text-center py-1 text-[1.1em]">
            "...AND THAT IS THE NEWS AT SIX."
          </div>
          <div className="bg-black/80 text-tt-white text-center py-0.5 text-[0.9em]">
            BBC ONE SUBTITLES — PAGE 888
          </div>
        </div>
      </div>
      <div className="text-tt-white/50 text-[0.8em] text-center pb-1">
        BBC PAGE 888 PROVIDED SUBTITLES FOR THE DEAF AND HARD OF HEARING FROM 1979 ONWARDS
      </div>
    </div>
  );
}
