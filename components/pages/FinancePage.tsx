'use client';
import { useEffect, useState } from 'react';
import { useTeletextStore } from '@/store/teletext';

interface Market { symbol: string; name: string; price: number; change: number; changePct: number; currency: string }
interface FinanceData { markets: Market[]; cryptoMarkets: Market[]; fx: Record<string, number>; updatedAt: string }

export default function FinancePage() {
  const { navigate, setFastTextLinks } = useTeletextStore();
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 600, label: 'MARKETS' },
      green:  { page: 601, label: 'CRYPTO' },
      yellow: { page: 602, label: 'FX' },
      blue:   { page: 100, label: 'HOME' },
    });

    fetch('/api/finance')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));

    const id = setInterval(() => {
      fetch('/api/finance').then(r => r.json()).then(setData).catch(() => {});
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [setFastTextLinks]);

  const updatedAt = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className="tt-reveal h-full overflow-hidden px-1 tt-text">
      <div className="bg-tt-yellow text-black font-bold text-center py-0.5">
        £ MARKET DATA {updatedAt && `— ${updatedAt}`}
      </div>

      {loading ? (
        <div className="text-tt-cyan mt-4 text-center tt-blink">■ LOADING MARKET DATA... ■</div>
      ) : (
        <>
          {/* Stock indices */}
          <div className="mt-1">
            <div className="text-tt-cyan font-bold"> STOCK INDICES</div>
            <div className="text-tt-yellow">{'─'.repeat(38)}</div>
            <div className="flex text-tt-yellow/70 text-[0.8em] font-bold">
              <span className="w-[6ch]">CODE</span>
              <span className="w-[12ch]">NAME</span>
              <span className="flex-1 text-right">PRICE</span>
              <span className="w-[8ch] text-right">CHANGE</span>
            </div>
            {data?.markets.map(m => (
              <div key={m.symbol} className="flex text-[0.9em]">
                <span className="w-[6ch] text-tt-cyan font-bold">{m.symbol}</span>
                <span className="w-[12ch] text-tt-white">{m.name.slice(0, 11)}</span>
                <span className="flex-1 text-right text-tt-yellow">{m.price.toLocaleString()}</span>
                <span className={`w-[8ch] text-right font-bold ${m.changePct >= 0 ? 'text-tt-green' : 'text-tt-red'}`}>
                  {m.changePct >= 0 ? '▲' : '▼'}{Math.abs(m.changePct).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>

          {/* Crypto */}
          <div className="mt-2">
            <div className="text-tt-cyan font-bold"> CRYPTOCURRENCY</div>
            <div className="text-tt-yellow">{'─'.repeat(38)}</div>
            {data?.cryptoMarkets.map(m => (
              <div key={m.symbol} className="flex text-[0.9em]">
                <span className="w-[6ch] text-tt-cyan font-bold">{m.symbol}</span>
                <span className="w-[12ch] text-tt-white">{m.name.slice(0, 11)}</span>
                <span className="flex-1 text-right text-tt-yellow">£{Math.round(m.price).toLocaleString()}</span>
                <span className={`w-[8ch] text-right font-bold ${m.changePct >= 0 ? 'text-tt-green' : 'text-tt-red'}`}>
                  {m.changePct >= 0 ? '▲' : '▼'}{Math.abs(m.changePct).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>

          {/* FX */}
          {data?.fx && Object.keys(data.fx).length > 0 && (
            <div className="mt-2">
              <div className="text-tt-cyan font-bold"> EXCHANGE RATES (GBP)</div>
              <div className="text-tt-yellow">{'─'.repeat(38)}</div>
              <div className="grid grid-cols-3 gap-x-2 text-[0.9em]">
                {Object.entries(data.fx).map(([code, rate]) => rate && (
                  <div key={code} className="flex gap-1">
                    <span className="text-tt-cyan w-[4ch]">{code}</span>
                    <span className="text-tt-yellow">{Number(rate).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="absolute bottom-8 left-1 text-tt-white/40 text-[0.75em]">
        ⚠ INDICES ARE INDICATIVE ONLY
      </div>
    </div>
  );
}
