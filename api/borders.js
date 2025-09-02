// Vercel serverless function: returns country borders GeoJSON with CORS and caching
// Runtime: Node 18+ (global fetch available)

const REMOTE_BORDERS_URL = 'https://unpkg.com/three-globe@2.44.0/example/datasets/ne_110m_admin_0_countries.geojson';

module.exports = async (req, res) => {
  // Allow cross-origin use if embedded elsewhere
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const r = await fetch(REMOTE_BORDERS_URL, { redirect: 'follow' });
    if (!r.ok) {
      return res.status(r.status).json({ error: 'Failed to fetch borders' });
    }
    const data = await r.json();
    // Cache at the edge (CDN) for a week; allow SWR revalidation
    res.setHeader('Cache-Control', 'public, s-maxage=604800, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(data));
  } catch (e) {
    return res.status(500).json({ error: 'Borders fetch error', detail: String(e) });
  }
};

