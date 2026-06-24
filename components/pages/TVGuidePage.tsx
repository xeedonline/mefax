'use client';
import { useEffect } from 'react';
import { useTeletextStore } from '@/store/teletext';

// Static TV listings (live integration is a future phase)
const CHANNELS: Record<number, { name: string; schedule: { time: string; show: string; desc: string }[] }> = {
  401: {
    name: 'BBC ONE',
    schedule: [
      { time: '06:00', show: 'BREAKFAST', desc: 'NEWS AND CURRENT AFFAIRS' },
      { time: '09:15', show: 'MR BLOBBY RETURNS', desc: 'CLASSIC NINETIES COMEDY' },
      { time: '10:00', show: 'HOMES UNDER THE HAMMER', desc: 'PROPERTY PROGRAMME' },
      { time: '12:00', show: 'BBC NEWS AT ONE', desc: 'NATIONAL AND WORLD NEWS' },
      { time: '13:45', show: 'BARGAIN HUNT', desc: 'ANTIQUES CHALLENGE' },
      { time: '15:00', show: 'ESCAPE TO THE COUNTRY', desc: 'RURAL PROPERTY SEARCH' },
      { time: '18:30', show: 'THE ONE SHOW', desc: 'MAGAZINE PROGRAMME' },
      { time: '19:00', show: 'EASTENDERS', desc: 'SOAP OPERA' },
      { time: '19:30', show: 'BBC NEWS AT SEVEN', desc: 'NATIONAL NEWS' },
      { time: '20:00', show: 'STRICTLY COME DANCING', desc: 'DANCE COMPETITION' },
      { time: '21:00', show: 'DRAMA SERIES', desc: 'PRIME TIME DRAMA' },
      { time: '22:00', show: 'BBC NEWS AT TEN', desc: 'NATIONAL AND WORLD NEWS' },
    ],
  },
  402: {
    name: 'BBC TWO',
    schedule: [
      { time: '07:00', show: 'BBC LEARNING', desc: 'EDUCATIONAL PROGRAMMES' },
      { time: '12:00', show: 'FLOG IT!', desc: 'ANTIQUES ROADSHOW SPIN-OFF' },
      { time: '14:00', show: 'GREAT BRITISH BAKE OFF', desc: 'BAKING COMPETITION REPEAT' },
      { time: '17:30', show: 'POINTLESS', desc: 'QUIZ PROGRAMME' },
      { time: '18:30', show: 'FLOG IT!', desc: 'ANTIQUE APPRAISALS' },
      { time: '19:00', show: 'MASTERMIND', desc: 'GENERAL KNOWLEDGE QUIZ' },
      { time: '20:00', show: 'DOCUMENTARY', desc: 'BAFTA AWARD-WINNING' },
      { time: '21:00', show: 'NEWSNIGHT', desc: 'IN-DEPTH NEWS ANALYSIS' },
      { time: '22:00', show: 'THE LATE FILM', desc: 'CLASSIC CINEMA' },
    ],
  },
  403: {
    name: 'ITV',
    schedule: [
      { time: '06:00', show: 'GOOD MORNING BRITAIN', desc: 'BREAKFAST NEWS AND CHAT' },
      { time: '09:30', show: 'LORRAINE', desc: 'CHAT AND CELEBRITY INTERVIEWS' },
      { time: '10:30', show: 'THIS MORNING', desc: 'DAYTIME MAGAZINE' },
      { time: '12:30', show: 'LOOSE WOMEN', desc: 'PANEL DEBATE SHOW' },
      { time: '13:00', show: 'ITV NEWS', desc: 'LUNCHTIME NEWS' },
      { time: '13:30', show: 'THE CHASE', desc: 'QUIZ SHOW' },
      { time: '17:30', show: 'THE CHASE', desc: 'MORE CHASING' },
      { time: '18:30', show: 'EMMERDALE', desc: 'YORKSHIRE SOAP' },
      { time: '19:00', show: 'ITV EVENING NEWS', desc: 'NATIONAL NEWS' },
      { time: '19:30', show: 'CORONATION STREET', desc: 'MANCHESTER SOAP' },
      { time: '20:00', show: 'PRIME TIME DRAMA', desc: 'POPULAR DRAMA' },
      { time: '21:00', show: 'CORRIE', desc: 'CORONATION STREET' },
    ],
  },
  404: {
    name: 'CHANNEL 4',
    schedule: [
      { time: '07:00', show: 'CHANNEL 4 NEWS', desc: 'MORNING BULLETIN' },
      { time: '10:00', show: 'EVERYBODY LOVES RAYMOND', desc: 'AMERICAN SITCOM REPEAT' },
      { time: '12:00', show: 'COUNTDOWN', desc: 'LETTERS AND NUMBERS GAME' },
      { time: '14:00', show: 'DEAL OR NO DEAL', desc: 'CLASSIC GAMESHOW REPEAT' },
      { time: '17:00', show: 'CHANNEL 4 NEWS', desc: 'EARLY EVENING BULLETIN' },
      { time: '17:55', show: '8 OUT OF 10 CATS DOES COUNTDOWN', desc: 'COMEDY PANEL SHOW' },
      { time: '19:00', show: 'HOLLYOAKS', desc: 'CHESTER-BASED SOAP' },
      { time: '20:00', show: 'THE GREAT BRITISH BAKE OFF', desc: 'BAKING COMPETITION' },
      { time: '21:00', show: 'CHANNEL 4 FILM', desc: 'EVENING FILM' },
    ],
  },
  405: {
    name: 'CHANNEL 5',
    schedule: [
      { time: '06:00', show: 'MILKSHAKE', desc: 'CHILDREN\'S PROGRAMMING' },
      { time: '09:15', show: 'JEREMY VINE', desc: 'DAYTIME CHAT AND NEWS' },
      { time: '11:30', show: 'RICH HOUSE POOR HOUSE', desc: 'SOCIAL EXPERIMENT' },
      { time: '13:00', show: 'CHANNEL 5 NEWS', desc: 'LUNCHTIME NEWS' },
      { time: '14:00', show: 'HOME AND AWAY', desc: 'AUSTRALIAN SOAP' },
      { time: '14:30', show: 'NEIGHBOURS', desc: 'CLASSIC AUSSIE SOAP' },
      { time: '17:30', show: 'CHANNEL 5 NEWS', desc: 'EARLY EVENING NEWS' },
      { time: '18:00', show: 'TONIGHT WITH JANE HILL', desc: 'CURRENT AFFAIRS' },
      { time: '19:00', show: 'GBN EVENING NEWS', desc: 'EVENING BULLETIN' },
      { time: '21:00', show: 'PARAMOUNT+ FILM', desc: 'EVENING ENTERTAINMENT' },
    ],
  },
};

function getNowAndNext(schedule: typeof CHANNELS[401]['schedule']) {
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const toMins = (t: string) => { const [h,m] = t.split(':').map(Number); return h*60+m; };
  let nowIdx = 0;
  for (let i = 0; i < schedule.length - 1; i++) {
    if (toMins(schedule[i].time) <= currentMins && toMins(schedule[i+1].time) > currentMins) {
      nowIdx = i;
      break;
    }
  }
  return { now: schedule[nowIdx], next: schedule[nowIdx + 1] ?? null };
}

export default function TVGuidePage({ pageNum }: { pageNum: number }) {
  const { navigate, setFastTextLinks } = useTeletextStore();

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 401, label: 'BBC ONE' },
      green:  { page: 402, label: 'BBC TWO' },
      yellow: { page: 403, label: 'ITV' },
      blue:   { page: 404, label: 'CH4' },
    });
  }, [setFastTextLinks]);

  const channel = CHANNELS[pageNum];

  if (!channel) {
    // Index page
    return (
      <div className="tt-reveal h-full overflow-hidden px-1 tt-text">
        <div className="bg-tt-magenta text-black font-bold text-center py-0.5">
          📺 TV GUIDE — SELECT CHANNEL
        </div>
        <div className="mt-2 space-y-1">
          {Object.entries(CHANNELS).map(([p, ch]) => {
            const { now } = getNowAndNext(ch.schedule);
            return (
              <button key={p} onClick={() => navigate(Number(p))} className="w-full text-left hover:bg-tt-blue/20 px-1 py-0.5">
                <span className="text-tt-yellow font-bold">{p} {ch.name}</span>
                <span className="text-tt-white/60 ml-2 text-[0.85em]">NOW: {now.show}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-tt-white/40 text-[0.8em] text-center">
          LISTINGS ARE INDICATIVE — CHECK CHANNEL FOR CHANGES
        </div>
      </div>
    );
  }

  const { now, next } = getNowAndNext(channel.schedule);
  const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="tt-reveal h-full overflow-hidden px-1 tt-text">
      <div className="bg-tt-magenta text-black font-bold text-center py-0.5">
        📺 {channel.name} — TV GUIDE
      </div>

      {/* NOW / NEXT highlight */}
      <div className="mt-1 bg-tt-blue/30 border border-tt-blue px-1 py-0.5">
        <div className="text-tt-yellow font-bold">NOW {nowTime}</div>
        <div className="text-tt-white font-bold">{now.show}</div>
        <div className="text-tt-white/60 text-[0.85em]">{now.desc}</div>
      </div>
      {next && (
        <div className="mt-0.5 px-1">
          <span className="text-tt-cyan">NEXT {next.time}: </span>
          <span className="text-tt-white">{next.show}</span>
        </div>
      )}

      {/* Full schedule */}
      <div className="text-tt-yellow mt-1">{'─'.repeat(38)}</div>
      <div className="overflow-y-auto">
        {channel.schedule.map((item, i) => (
          <div key={i} className={`flex gap-2 text-[0.85em] ${item.show === now.show ? 'text-tt-yellow' : 'text-tt-white/80'}`}>
            <span className="text-tt-cyan w-[6ch]">{item.time}</span>
            <span className="font-bold">{item.show.slice(0, 20)}</span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-1 flex gap-3 text-[0.8em]">
        {[401,402,403,404,405].map(p => (
          <button key={p} onClick={() => navigate(p)} className={`hover:text-tt-white ${p===pageNum ? 'text-tt-yellow font-bold' : 'text-tt-white/50'}`}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
