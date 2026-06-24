'use client';
import { useEffect, useState } from 'react';
import { useTeletextStore } from '@/store/teletext';
import { randPick } from '@/lib/teletext-utils';

const RANDOM_PAGES = [
  {
    title: 'ALIEN WEATHER REPORT',
    color: 'bg-tt-green',
    textColor: 'text-black',
    content: () => ({
      header: '☄ INTERGALACTIC WEATHER SERVICE',
      lines: [
        { c: 'text-tt-yellow', t: 'MARS:       -63°C  DUST STORM  VERY WINDY' },
        { c: 'text-tt-cyan',   t: 'VENUS:     465°C  ACID RAIN    DANGEROUS' },
        { c: 'text-tt-white',  t: 'MOON:      -173°C  NO ATMOSPHERE' },
        { c: 'text-tt-green',  t: 'JUPITER:   -108°C  GREAT RED SPOT' },
        { c: 'text-tt-yellow', t: 'SATURN:    -138°C  ICY RINGS    LOVELY' },
        { c: 'text-tt-cyan',   t: '' },
        { c: 'text-tt-white',  t: 'EARTH:      VARIABLE. COULD BE WORSE.' },
      ],
    }),
  },
  {
    title: 'MARS FOOTBALL SCORES',
    color: 'bg-tt-red',
    textColor: 'text-white',
    content: () => ({
      header: '⚽ INTERPLANETARY FOOTBALL — FINAL',
      lines: [
        { c: 'text-tt-cyan',   t: '' },
        { c: 'text-tt-yellow', t: 'MARS ROVERS         3-1  VENUS UNITED' },
        { c: 'text-tt-white',  t: 'MOON CITY           0-0  SATURN FC' },
        { c: 'text-tt-yellow', t: 'JUPITER WANDERERS   7-2  PLUTO AFC' },
        { c: 'text-tt-white',  t: 'NEPTUNE TOWN        1-4  MILKY WAY XI' },
        { c: 'text-tt-cyan',   t: '' },
        { c: 'text-tt-white/60', t: 'NEXT MATCH: EARTH VS ANDROMEDA (TBC)' },
      ],
    }),
  },
  {
    title: 'FAKE TELETEXT NEWS',
    color: 'bg-tt-cyan',
    textColor: 'text-black',
    content: () => {
      const headlines = [
        ['LOCAL MAN CONFUSED BY SELF-CHECKOUT AGAIN', 'FOURTH TIME THIS WEEK, SOURCES CONFIRM'],
        ['BRITAIN\'S LAST PHONEBOX BECOMES A LIBRARY', 'CONTAINS ONE BOOK. IT IS THE PHONEBOOK.'],
        ['SEAGULL EATS CHIP. BRITAIN IN SHOCK', 'PM CALLS EMERGENCY COBRAS MEETING'],
        ['TRAIN 3 MINUTES LATE', 'PASSENGERS DECLARE INDEPENDENCE'],
        ['SOMEONE LEFT THE MILK OUT AGAIN', 'OFFICE SINK IMPLICATED IN GROWING SCANDAL'],
        ['MAN IN PARKA CLAIMS WEATHER FINE', 'WEATHERMAN DISAGREES. BRITAIN DIVIDED'],
      ];
      const h = randPick(headlines);
      return {
        header: '■ BREAKING NEWS ■',
        lines: [
          { c: 'text-tt-red', t: '' },
          { c: 'text-tt-yellow', t: h[0] },
          { c: 'text-tt-white',  t: h[1] },
          { c: 'text-tt-white/50', t: '' },
          { c: 'text-tt-white/50', t: 'DISCLAIMER: NOT REAL NEWS' },
          { c: 'text-tt-cyan',    t: 'FOR REAL NEWS SEE PAGE 101' },
        ],
      };
    },
  },
  {
    title: 'RETRO CLASSIFIED ADS',
    color: 'bg-tt-yellow',
    textColor: 'text-black',
    content: () => ({
      header: '★ SMALL ADS ★',
      lines: [
        { c: 'text-tt-cyan',   t: 'FOR SALE: VHS TAPES. CLASSIC FILMS.' },
        { c: 'text-tt-white',  t: 'ALL REWOUND. SOME HAVE BITS TAPED OVER.' },
        { c: 'text-tt-cyan',   t: '' },
        { c: 'text-tt-cyan',   t: 'WANTED: CEEFAX DECODER. NOSTALGIC REASONS.' },
        { c: 'text-tt-white',  t: 'WILL SWAP FOR HALF-EATEN BAG OF SPACE DUST.' },
        { c: 'text-tt-cyan',   t: '' },
        { c: 'text-tt-yellow', t: 'FREE TO GOOD HOME: ONE BETAMAX PLAYER.' },
        { c: 'text-tt-white',  t: 'TECHNICALLY SUPERIOR. NOBODY CARES.' },
      ],
    }),
  },
  {
    title: 'TIME TRAVEL TIMETABLE',
    color: 'bg-tt-blue',
    textColor: 'text-white',
    content: () => ({
      header: '⏱ TEMPORAL TRANSIT — DEPARTURES',
      lines: [
        { c: 'text-tt-yellow', t: 'DEST          DEPARTS    PLATFORM' },
        { c: 'text-tt-yellow', t: '────────────────────────────────────' },
        { c: 'text-tt-white',  t: '1983          NOW        4' },
        { c: 'text-tt-cyan',   t: '  ↳ STAND: ANY BAR IN BRITAIN' },
        { c: 'text-tt-white',  t: '1066          DELAYED    TBC' },
        { c: 'text-tt-white',  t: '2099          ON TIME    7' },
        { c: 'text-tt-cyan',   t: '  ↳ BRING SUNSCREEN' },
        { c: 'text-tt-white/50', t: 'THE FUTURE    UNKNOWN    ???' },
      ],
    }),
  },
  {
    title: 'FORTUNE TELLER',
    color: 'bg-tt-magenta',
    textColor: 'text-white',
    content: () => {
      const star = randPick(['ARIES','TAURUS','GEMINI','CANCER','LEO','VIRGO','LIBRA','SCORPIO','SAGITTARIUS','CAPRICORN','AQUARIUS','PISCES']);
      const fortunes = [
        'TODAY IS A GOOD DAY TO PRESS BUTTONS.',
        'A STRANGER WILL ASK YOU ABOUT YOUR TV SETUP.',
        'THE ANSWER IS YES. THE QUESTION: NO IDEA.',
        'AVOID DECISIONS UNTIL AFTER A CUP OF TEA.',
        'AN OLD FRIEND WILL TEXT YOU. REPLY WITHIN THE DECADE.',
        'MERCURY IS IN RETROGRADE. BIN COLLECTION UNAFFECTED.',
      ];
      return {
        header: `★ YOUR STARS — ${star} ★`,
        lines: [
          { c: 'text-tt-yellow', t: '' },
          { c: 'text-tt-white',  t: randPick(fortunes) },
          { c: 'text-tt-yellow', t: '' },
          { c: 'text-tt-cyan',   t: 'LUCKY NUMBERS:' },
          { c: 'text-tt-yellow', t: [7,13,42,99,3].map(n => Math.floor(Math.random()*n+1)).join('  ') },
          { c: 'text-tt-white/50', t: '' },
          { c: 'text-tt-white/30', t: 'ACCURACY NOT GUARANTEED' },
        ],
      };
    },
  },
];

export default function RandomPage() {
  const { navigate, setFastTextLinks } = useTeletextStore();
  const [pageData, setPageData] = useState(() => {
    const p = randPick(RANDOM_PAGES);
    return { ...p, built: p.content() };
  });

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 999, label: 'ANOTHER!' },
      green:  { page: 100, label: 'HOME' },
      yellow: { page: 101, label: 'NEWS' },
      blue:   { page: 500, label: 'QUIZ' },
    });
  }, [setFastTextLinks]);

  const refresh = () => {
    const p = randPick(RANDOM_PAGES);
    setPageData({ ...p, built: p.content() });
  };

  const { built, color, textColor } = pageData;

  return (
    <div className="tt-reveal h-full overflow-hidden tt-text">
      <div className={`${color} ${textColor} font-bold text-center py-0.5`}>
        P999 {built.header}
      </div>
      <div className="px-1 mt-1 space-y-0.5">
        {built.lines.map((l, i) => (
          <div key={i} className={l.c}>{l.t || <>&nbsp;</>}</div>
        ))}
      </div>
      <div className="absolute bottom-10 left-1 right-1">
        <div className="text-tt-yellow">{'─'.repeat(38)}</div>
        <div className="flex gap-4 mt-0.5">
          <button onClick={refresh} className="text-tt-red hover:text-tt-white font-bold">
            ▶ ANOTHER RANDOM PAGE
          </button>
          <button onClick={() => navigate(100)} className="text-tt-white/50 hover:text-tt-white ml-auto">
            100 HOME
          </button>
        </div>
      </div>
    </div>
  );
}
