export type Break = { t: number; y: number };

// Two-zone symlog mapping
// Deep-Time (compressed): 470 Ma → 500 ka
// Sapiens (expanded): 500 ka → 2025
export const BREAKS: Break[] = [
  // Deep-Time (0..200)
  { t:    0, y: -470_000_000 }, // 470 Ma
  { t:  100, y: -300_000_000 },
  { t:  140, y: -200_000_000 },
  { t:  170, y: -100_000_000 },
  { t:  190, y:  -10_000_000 },
  { t:  200, y:     -500_000 },
  // Sapiens (200..1000)
  { t:  350, y:      -10_000 },
  { t:  500, y:             0 },
  { t:  750, y:          1500 },
  { t:  900, y:          1900 },
  { t: 1000, y:          2025 }
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
