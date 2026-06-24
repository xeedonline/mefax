import { NextRequest, NextResponse } from 'next/server';
import { weatherLabel, windDir } from '@/lib/teletext-utils';

export const revalidate = 600; // 10 minutes

const CITIES = [
  { name: 'LONDON',       lat: 51.5074,  lon: -0.1278  },
  { name: 'BIRMINGHAM',   lat: 52.4862,  lon: -1.8904  },
  { name: 'MANCHESTER',   lat: 53.4808,  lon: -2.2426  },
  { name: 'EDINBURGH',    lat: 55.9533,  lon: -3.1883  },
  { name: 'GLASGOW',      lat: 55.8642,  lon: -4.2518  },
  { name: 'CARDIFF',      lat: 51.4816,  lon: -3.1791  },
  { name: 'BELFAST',      lat: 54.5973,  lon: -5.9301  },
  { name: 'NEWCASTLE',    lat: 54.9783,  lon: -1.6178  },
  { name: 'LEEDS',        lat: 53.8008,  lon: -1.5491  },
  { name: 'BRISTOL',      lat: 51.4545,  lon: -2.5879  },
  { name: 'LIVERPOOL',    lat: 53.4084,  lon: -2.9916  },
  { name: 'SHEFFIELD',    lat: 53.3811,  lon: -1.4701  },
  { name: 'ABERDEEN',     lat: 57.1497,  lon: -2.0943  },
  { name: 'INVERNESS',    lat: 57.4778,  lon: -4.2247  },
  { name: 'EXETER',       lat: 50.7236,  lon: -3.5275  },
  { name: 'NORWICH',      lat: 52.6309,  lon:  1.2974  },
  { name: 'SOUTHAMPTON',  lat: 50.9097,  lon: -1.4044  },
  { name: 'NOTTINGHAM',   lat: 52.9548,  lon: -1.1581  },
];

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    relative_humidity_2m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

async function fetchCity(city: (typeof CITIES)[number]) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=5&timezone=Europe%2FLondon`;

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as OpenMeteoResponse;

  const { label, icon } = weatherLabel(data.current.weather_code);
  return {
    name: city.name,
    temp: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDir: windDir(data.current.wind_direction_10m),
    condition: label,
    conditionCode: data.current.weather_code,
    humidity: data.current.relative_humidity_2m,
    icon,
    forecast: data.daily.time.map((date, i) => ({
      date,
      maxTemp: Math.round(data.daily.temperature_2m_max[i]),
      minTemp: Math.round(data.daily.temperature_2m_min[i]),
      condition: weatherLabel(data.daily.weather_code[i]).label,
      conditionCode: data.daily.weather_code[i],
      rain: data.daily.precipitation_probability_max[i],
    })),
  };
}

export async function GET(req: NextRequest) {
  const cityParam = req.nextUrl.searchParams.get('city')?.toUpperCase();
  const regionParam = req.nextUrl.searchParams.get('region');

  let citiesToFetch = CITIES;
  if (cityParam) {
    const match = CITIES.find((c) => c.name === cityParam);
    if (match) citiesToFetch = [match];
  } else if (regionParam === 'scotland') {
    citiesToFetch = CITIES.filter((c) => ['EDINBURGH', 'GLASGOW', 'ABERDEEN', 'INVERNESS'].includes(c.name));
  } else if (regionParam === 'england') {
    citiesToFetch = CITIES.filter((c) => !['EDINBURGH', 'GLASGOW', 'ABERDEEN', 'INVERNESS', 'CARDIFF', 'BELFAST'].includes(c.name));
  } else if (regionParam === 'wales') {
    citiesToFetch = CITIES.filter((c) => ['CARDIFF'].includes(c.name));
  } else if (regionParam === 'ni') {
    citiesToFetch = CITIES.filter((c) => ['BELFAST'].includes(c.name));
  }

  try {
    const results = await Promise.allSettled(citiesToFetch.map(fetchCity));
    const cities = results
      .map((r) => (r.status === 'fulfilled' ? r.value : null))
      .filter(Boolean);

    return NextResponse.json({ cities, updatedAt: new Date().toISOString() }, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120' },
    });
  } catch (err) {
    return NextResponse.json({ cities: [], error: true }, { status: 500 });
  }
}
