export type YearBP = number; // e.g., 23000 (present=1950)
export type YearCE = number; // e.g., 2025; BCE as negative CE

export interface EvidenceRef {
  id: string;
  title: string;
  authors?: string[];
  year?: number;
  doi?: string;
  url?: string;
  note?: string;
}

export interface Site {
  id: string;
  name: string;
  lat: number;
  lon: number;
  startBP?: YearBP;
  endBP?: YearBP;
  culture?: string; // e.g., MSA, IUP, Lapita, Cardial
  evidenceTypes: ("archaeology" | "genetics" | "linguistics")[];
  references: EvidenceRef[];
  confidence: 0 | 1 | 2 | 3; // 0=tentative … 3=high
}

export interface MigrationEdge {
  id: string;
  fromSite: string;
  toSite: string; // Site ids
  earliestBP?: YearBP;
  latestBP?: YearBP;
  routeGeometry: { type: "LineString"; coordinates: [number, number][] };
  drivers?: ("climate" | "technology" | "demography" | "conflict" | "trade" | "forced")[];
  evidence: EvidenceRef[];
  confidence: 0 | 1 | 2 | 3;
}

export interface RasterLayer {
  id: string;
  name: string;
  kind: "seaLevel" | "ice" | "precip" | "temp" | "biome";
  times: YearBP[]; // frames keyed to timestamps
  tilesetURL: string; // vector/raster tiles
  metadataRefs: EvidenceRef[];
}

export function formatBPRange(startBP?: YearBP, endBP?: YearBP): string {
  const fmt = (bp?: number) => (bp == null ? "?" : `${Math.round(bp / 1000)}\u202Fka`);
  if (startBP != null && endBP != null) return `${fmt(startBP)}–${fmt(endBP)}`;
  if (startBP != null) return `${fmt(startBP)}`;
  if (endBP != null) return `${fmt(endBP)}`;
  return "?";
}

export function formatCE(y: YearCE): string {
  return y < 0 ? `${Math.abs(y)}\u202FBCE` : `${y}\u202FCE`;
}

