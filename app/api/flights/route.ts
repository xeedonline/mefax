import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 60; // 1 minute

// UK bounding box
const UK_BOX = { lamin: 49.9, lomin: -8.6, lamax: 60.8, lomax: 1.8 };

// UK airports (ICAO)
const UK_AIRPORTS: Record<string, string> = {
  EGLL: 'LHR', EGKK: 'LGW', EGSS: 'STN', EGGW: 'LTN', EGCC: 'MAN',
  EGBB: 'BHX', EGLC: 'LCY', EGPH: 'EDI', EGPF: 'GLA', EGPD: 'ABZ',
  EGGD: 'BRS', EGFF: 'CWL', EGHI: 'SOU', EGNX: 'EMA', EGNT: 'NCL',
  EGSH: 'NWI', EGBJ: 'GCE', EGAC: 'BHD', EIDW: 'DUB', EGSC: 'CBG',
};

function resolveAirport(icao: string | null): string {
  if (!icao) return '???';
  const upper = icao.toUpperCase();
  return UK_AIRPORTS[upper] || upper.slice(1); // strip leading E
}

interface OpenSkyState {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
}

export async function GET(req: NextRequest) {
  const region = req.nextUrl.searchParams.get('region') || 'uk';

  let box = UK_BOX;
  if (region === 'scotland')    box = { lamin: 54.6, lomin: -7.6, lamax: 60.8, lomax: 0.0 };
  if (region === 'london')      box = { lamin: 51.0, lomin: -1.0, lamax: 52.0, lomax: 1.0 };
  if (region === 'glasgow')     box = { lamin: 55.5, lomin: -5.0, lamax: 56.5, lomax: -3.5 };

  const url = `https://opensky-network.org/api/states/all?lamin=${box.lamin}&lomin=${box.lomin}&lamax=${box.lamax}&lomax=${box.lomax}`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`OpenSky HTTP ${res.status}`);

    const data = await res.json() as { states?: unknown[][] | null };
    const states: OpenSkyState[] = (data.states || [])
      .map((s: unknown[]) => ({
        icao24:         String(s[0] || ''),
        callsign:       s[1] ? String(s[1]).trim() : null,
        origin_country: String(s[2] || ''),
        last_contact:   Number(s[4] || 0),
        longitude:      s[5] != null ? Number(s[5]) : null,
        latitude:       s[6] != null ? Number(s[6]) : null,
        baro_altitude:  s[7] != null ? Number(s[7]) : null,
        on_ground:      Boolean(s[8]),
        velocity:       s[9] != null ? Number(s[9]) : null,
        true_track:     s[10] != null ? Number(s[10]) : null,
      }))
      .filter((s: OpenSkyState) => !s.on_ground && s.callsign);

    // Sort by altitude descending, take top 20
    const flights = states
      .sort((a, b) => (b.baro_altitude || 0) - (a.baro_altitude || 0))
      .slice(0, 20)
      .map((s) => ({
        callsign:    s.callsign || '??????',
        icao24:      s.icao24,
        country:     s.origin_country,
        lat:         s.latitude,
        lon:         s.longitude,
        altitude:    s.baro_altitude,
        speed:       s.velocity,
        heading:     s.true_track,
        lastSeen:    s.last_contact,
      }));

    return NextResponse.json({ flights, total: states.length, updatedAt: new Date().toISOString() }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
    });
  } catch (err) {
    console.error('OpenSky error:', err);
    // Return mock flight data
    return NextResponse.json({
      flights: [
        { callsign: 'BA0250', icao24: '400943', country: 'United Kingdom', lat: 51.5, lon: -0.3, altitude: 11280, speed: 235, heading: 270 },
        { callsign: 'EZY1234', icao24: '40611b', country: 'United Kingdom', lat: 53.2, lon: -2.1, altitude: 9150, speed: 218, heading: 45 },
        { callsign: 'RYR7890', icao24: '4ca7b6', country: 'Ireland', lat: 55.8, lon: -3.9, altitude: 10668, speed: 241, heading: 180 },
        { callsign: 'DLH456', icao24: '3c4b2a', country: 'Germany', lat: 51.8, lon: 0.1, altitude: 12192, speed: 252, heading: 95 },
        { callsign: 'VIR22', icao24: '4008f4', country: 'United Kingdom', lat: 51.4, lon: -0.5, altitude: 3048, speed: 185, heading: 262 },
      ],
      total: 5,
      updatedAt: new Date().toISOString(),
      mock: true,
    });
  }
}
