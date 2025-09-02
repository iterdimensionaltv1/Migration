export type Break = { t: number; y: number };

export const BREAKS: Break[] = [
  { t:   0, y: -500_000 },
  { t:  50, y: -300_000 },
  { t: 120, y: -120_000 },
  { t: 200, y:  -70_000 },
  { t: 350, y:  -10_000 },
  { t: 500, y:        0 },
  { t: 750, y:     1500 },
  { t: 900, y:     1900 },
  { t: 1000, y:    2025 }
];

export function sliderToYear(t: number, breaks: Break[] = BREAKS) {
  const x = Math.max(0, Math.min(1000, t));
  for (let i = 0; i < breaks.length - 1; i++) {
    const a = breaks[i], b = breaks[i + 1];
    if (x >= a.t && x <= b.t) {
      const u = (x - a.t) / (b.t - a.t);
      return Math.round(a.y + u * (b.y - a.y));
    }
  }
  return breaks[0].y;
}

export function yearToSlider(y: number, breaks: Break[] = BREAKS) {
  const yy = Math.max(breaks[0].y, Math.min(breaks[breaks.length - 1].y, y));
  for (let i = 0; i < breaks.length - 1; i++) {
    const a = breaks[i], b = breaks[i + 1];
    if (yy >= a.y && yy <= b.y) {
      const u = (yy - a.y) / (b.y - a.y);
      return Math.round(a.t + u * (b.t - a.t));
    }
  }
  return 0;
}

export function formatYear(y: number) {
  return y < 0 ? `${Math.abs(y).toLocaleString()} BCE` : `${y.toLocaleString()} CE`;
}

