export type Route = {
  id: string;
  name: string;
  category: 'Paleolithic'|'Holocene/Ancient'|'EarlyModern/Modern';
  start: number;
  end: number;
  magnitude: 1|2|3|4|5;
  confidence: 'low'|'medium'|'high';
  waypoints: [number, number][]; // [lat, lon]
};

export const ROUTES: Route[] = [
  {
    id: 'southern_oa_85_55ka',
    name: 'Major Out‑of‑Africa via Arabia (southern route)',
    category: 'Paleolithic',
    start: -85000,
    end: -55000,
    magnitude: 2,
    confidence: 'medium',
    waypoints: [[10,45],[18,47],[20,75]]
  },
  {
    id: 'to_sahul_65ka',
    name: 'Sahul (Australia/New Guinea) reached',
    category: 'Paleolithic',
    start: -65000,
    end: -50000,
    magnitude: 3,
    confidence: 'high',
    waypoints: [[1,124],[-10,135],[-6,147]]
  },
  {
    id: 'slave_trade_1501_1867',
    name: 'Trans‑Atlantic slave trade (macro flows)',
    category: 'EarlyModern/Modern',
    start: 1501,
    end: 1867,
    magnitude: 5,
    confidence: 'high',
    waypoints: [[6,-3],[-12,-55],[18.5,-72],[29,-90]]
  }
];

export function expandRouteToArcs(route: Route) {
  const res: any[] = [];
  const wps = route.waypoints;
  for (let i = 0; i < wps.length - 1; i++) {
    const [lat1, lon1] = wps[i];
    const [lat2, lon2] = wps[i + 1];
    res.push({
      id: `${route.id}_seg${i}`,
      routeId: route.id,
      name: route.name,
      category: route.category,
      start: route.start,
      end: route.end,
      magnitude: route.magnitude,
      confidence: route.confidence,
      startLat: lat1, startLng: lon1,
      endLat: lat2, endLng: lon2
    });
  }
  return res;
}

export const ALL_ARCS = ROUTES.flatMap(expandRouteToArcs);

export function makeParticleCopies(seg: any) {
  const copies: any[] = [];
  const base = Math.max(1, Math.min(5, seg.magnitude || 1));
  const n = base * 12;
  for (let i = 0; i < n; i++) {
    const conf = seg.confidence === 'high' ? 3 : seg.confidence === 'medium' ? 2 : 1;
    const jitter = (4 - conf) / 4;
    copies.push({ ...seg, pid: i, dashOffset: Math.random(), jitter });
  }
  return copies;
}

export const ALL_PARTICLE_ARCS = ALL_ARCS.flatMap(makeParticleCopies);

