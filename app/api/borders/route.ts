export const runtime = 'nodejs';

const REMOTE_BORDERS_URL = 'https://unpkg.com/three-globe@2.44.0/example/datasets/ne_110m_admin_0_countries.geojson';

function corsHeaders() {
  return new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET() {
  try {
    const r = await fetch(REMOTE_BORDERS_URL, { redirect: 'follow' });
    if (!r.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch borders' }), { status: r.status, headers: corsHeaders() });
    }
    const data = await r.json();
    const h = corsHeaders();
    h.set('Cache-Control', 'public, s-maxage=604800, stale-while-revalidate=86400');
    h.set('Content-Type', 'application/json');
    return new Response(JSON.stringify(data), { status: 200, headers: h });
  } catch (e:any) {
    return new Response(JSON.stringify({ error: 'Borders fetch error', detail: String(e) }), { status: 500, headers: corsHeaders() });
  }
}

