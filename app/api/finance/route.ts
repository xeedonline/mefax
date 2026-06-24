import { NextResponse } from 'next/server';

export const revalidate = 300; // 5 minutes

interface CoinGeckoPrice {
  usd: number;
  usd_24h_change: number;
  gbp: number;
  gbp_24h_change: number;
}

export async function GET() {
  // Crypto via CoinGecko (free, no key)
  const cryptoUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=gbp,usd&include_24hr_change=true';

  // Exchange rates via free API
  const fxUrl = 'https://open.er-api.com/v6/latest/GBP';

  const [cryptoRes, fxRes] = await Promise.allSettled([
    fetch(cryptoUrl, { next: { revalidate: 300 } }),
    fetch(fxUrl, { next: { revalidate: 3600 } }),
  ]);

  const crypto: Record<string, CoinGeckoPrice> = {};
  if (cryptoRes.status === 'fulfilled' && cryptoRes.value.ok) {
    Object.assign(crypto, await cryptoRes.value.json());
  }

  const fx: Record<string, number> = {};
  if (fxRes.status === 'fulfilled' && fxRes.value.ok) {
    const data = await fxRes.value.json();
    const rates = data.rates || {};
    fx.USD = rates.USD;
    fx.EUR = rates.EUR;
    fx.JPY = rates.JPY;
    fx.CAD = rates.CAD;
    fx.AUD = rates.AUD;
  }

  const markets = [
    // Index data - these would need a paid source; use indicative/static for now
    { symbol: 'FTSE', name: 'FTSE 100',  price: 8287, change: 12.4,   changePct: 0.15,  currency: 'GBP' },
    { symbol: 'SPX',  name: 'S&P 500',   price: 5426, change: -8.2,   changePct: -0.15, currency: 'USD' },
    { symbol: 'IXIC', name: 'NASDAQ',    price: 17193, change: 34.1,  changePct: 0.20,  currency: 'USD' },
    { symbol: 'DAX',  name: 'DAX',       price: 18421, change: -22.3, changePct: -0.12, currency: 'EUR' },
  ];

  const cryptoMarkets = [
    {
      symbol: 'BTC',
      name: 'BITCOIN',
      price: crypto.bitcoin?.gbp ?? 57000,
      change: 0,
      changePct: crypto.bitcoin?.gbp_24h_change ?? 0,
      currency: 'GBP',
    },
    {
      symbol: 'ETH',
      name: 'ETHEREUM',
      price: crypto.ethereum?.gbp ?? 2400,
      change: 0,
      changePct: crypto.ethereum?.gbp_24h_change ?? 0,
      currency: 'GBP',
    },
  ];

  return NextResponse.json(
    { markets, cryptoMarkets, fx, updatedAt: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
  );
}
