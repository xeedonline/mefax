'use client';
import { useEffect } from 'react';
import { useTeletextStore } from '@/store/teletext';

const FEATURED_PAGES = [
  { page: 777, owner: "DINO'S CHIP SHOP", location: 'AYRSHIRE', desc: 'AUTHENTIC ITALIAN FISH & CHIPS', color: 'text-tt-yellow' },
  { page: 111, owner: 'RETRO CORNER',     location: 'LONDON',   desc: 'VINTAGE COLLECTABLES & RARITIES', color: 'text-tt-cyan' },
  { page: 321, owner: 'THE HIGHLAND CAFE', location: 'INVERNESS', desc: 'CAKES · COFFEE · VIEWS', color: 'text-tt-green' },
  { page: 747, owner: 'EASTER EGG',        location: 'HIDDEN',   desc: '???', color: 'text-tt-magenta' },
];

const PRICING = [
  { tier: 'STANDARD PAGE',  price: '£19',     period: 'ONE-OFF', desc: 'YOUR CHOSEN PAGE NUMBER', color: 'bg-tt-cyan text-black' },
  { tier: 'PREMIUM PAGE',   price: '£49',     period: 'ONE-OFF', desc: 'FEATURED PLACEMENT + LOGO', color: 'bg-tt-yellow text-black' },
  { tier: 'BUSINESS PAGE',  price: '£99',     period: 'PER YEAR', desc: 'ORDERING LINK + ANALYTICS', color: 'bg-tt-green text-black' },
];

export default function OwnAPagePage({ pageNum }: { pageNum: number }) {
  const { navigate, setFastTextLinks } = useTeletextStore();

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 901, label: 'BUY A PAGE' },
      green:  { page: 902, label: 'FEATURED' },
      yellow: { page: 903, label: 'DIRECTORY' },
      blue:   { page: 100, label: 'HOME' },
    });
  }, [setFastTextLinks]);

  // Show featured pages on 902, pricing on 901, directory on 903
  if (pageNum === 902) return <FeaturedPages navigate={navigate} />;
  if (pageNum === 903) return <Directory navigate={navigate} />;

  // Default: 900 = overview/buy
  return (
    <div className="tt-reveal h-full overflow-y-auto px-1 tt-text">
      <div className="bg-tt-magenta text-black font-bold text-center py-0.5">
        ★ OWN A TELETEXT PAGE ★
      </div>
      <div className="mt-1 text-tt-white text-center">
        CLAIM YOUR PIECE OF TELETEXT HISTORY
      </div>
      <div className="mt-1 text-tt-yellow text-center">
        SELECT ANY AVAILABLE PAGE NUMBER
      </div>

      <div className="mt-2 space-y-1">
        {PRICING.map(p => (
          <div key={p.tier} className={`${p.color} px-2 py-1`}>
            <div className="font-bold">{p.tier}</div>
            <div className="flex justify-between">
              <span>{p.desc}</span>
              <span className="font-bold">{p.price}/{p.period}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-tt-cyan font-bold">POPULAR PAGE NUMBERS:</div>
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
        {[111,123,234,345,456,567,678,789,777,888,999].map(n => (
          <span key={n} className="text-tt-yellow">■ {n}</span>
        ))}
      </div>

      <div className="mt-3 bg-tt-blue/30 border border-tt-blue px-2 py-1">
        <div className="text-tt-cyan font-bold">COMING SOON</div>
        <div className="text-tt-white text-[0.9em]">THE MARKETPLACE IS UNDER DEVELOPMENT.</div>
        <div className="text-tt-white text-[0.9em]">REGISTER INTEREST AT TELETEXTUK.COM</div>
      </div>

      <div className="mt-2 flex gap-3 text-[0.85em]">
        <button onClick={() => navigate(902)} className="text-tt-cyan hover:text-tt-white">902 FEATURED</button>
        <button onClick={() => navigate(903)} className="text-tt-cyan hover:text-tt-white">903 DIRECTORY</button>
      </div>
    </div>
  );
}

function FeaturedPages({ navigate }: { navigate: (p: number) => void }) {
  return (
    <div className="tt-reveal h-full overflow-y-auto px-1 tt-text">
      <div className="bg-tt-magenta text-black font-bold text-center py-0.5">
        ★ FEATURED PAGES ★
      </div>
      <div className="mt-1 space-y-2">
        {FEATURED_PAGES.map(fp => (
          <div key={fp.page} className="border border-tt-yellow/30 p-1">
            <div className="flex justify-between">
              <span className="text-tt-yellow font-bold">PAGE {fp.page}</span>
              <span className="text-tt-white/50 text-[0.85em]">{fp.location}</span>
            </div>
            <div className={`font-bold ${fp.color}`}>{fp.owner}</div>
            <div className="text-tt-white/70 text-[0.85em]">{fp.desc}</div>
            <button onClick={() => navigate(fp.page)} className="text-tt-cyan text-[0.8em] hover:text-tt-white mt-0.5">
              VISIT PAGE {fp.page} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Directory({ navigate }: { navigate: (p: number) => void }) {
  return (
    <div className="tt-reveal h-full overflow-y-auto px-1 tt-text">
      <div className="bg-tt-magenta text-black font-bold text-center py-0.5">
        ★ BUSINESS DIRECTORY ★
      </div>
      <div className="mt-1 text-tt-white/50 text-[0.85em]">
        BUSINESSES WITH A TELETEXT UK PAGE:
      </div>
      <div className="mt-1">
        <div className="flex text-tt-yellow font-bold text-[0.85em]">
          <span className="w-[5ch]">PAGE</span>
          <span className="flex-1">BUSINESS</span>
          <span className="w-[10ch]">TYPE</span>
        </div>
        <div className="text-tt-yellow">{'─'.repeat(38)}</div>
        {FEATURED_PAGES.filter(fp => fp.page !== 747).map(fp => (
          <div key={fp.page} className="flex text-[0.85em]">
            <button onClick={() => navigate(fp.page)} className="text-tt-cyan font-bold w-[5ch] hover:text-tt-yellow">{fp.page}</button>
            <span className="flex-1 text-tt-white">{fp.owner.slice(0,16)}</span>
            <span className="w-[10ch] text-tt-white/60">FOOD</span>
          </div>
        ))}
        <div className="mt-2 text-tt-white/40 text-[0.8em]">
          YOUR BUSINESS COULD BE HERE
        </div>
      </div>
    </div>
  );
}
