import { PMTiles } from 'pmtiles';
import { VectorTile } from '@mapbox/vector-tile';
import Pbf from 'pbf';

export type Feature = {
  type: 'Feature';
  properties: Record<string, any>;
  geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: any };
};

export async function tryLoadPmtilesPolys(pmtilesUrl: string, maxZ = 1): Promise<Feature[] | null> {
  try {
    const source = new PMTiles(pmtilesUrl);
    // probe header
    await source.getHeader();
    const feats: Feature[] = [];
    // choose low zoom tiles for global overlay
    const zooms = [0, 1].filter(z => z <= maxZ);
    for (const z of zooms) {
      const max = Math.max(1, 1 << z);
      for (let x = 0; x < max; x++) {
        for (let y = 0; y < max; y++) {
          const entry = await source.getZxy(z, x, y);
          if (!entry || !entry.data) continue;
          const vt = new VectorTile(new Pbf(new Uint8Array(entry.data)));
          for (const layerName of Object.keys(vt.layers || {})) {
            const layer = vt.layers[layerName];
            if (!layer) continue;
            for (let i = 0; i < layer.length; i++) {
              const f = layer.feature(i);
              const gj = f.toGeoJSON(x, y, z) as any;
              if (!gj || !gj.geometry) continue;
              if (gj.geometry.type === 'Polygon' || gj.geometry.type === 'MultiPolygon') {
                feats.push({
                  type: 'Feature',
                  properties: gj.properties || {},
                  geometry: gj.geometry
                });
              }
            }
          }
        }
      }
    }
    return feats.length ? feats : null;
  } catch (_e) {
    return null;
  }
}

