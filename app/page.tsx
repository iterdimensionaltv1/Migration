"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import ModeBar from '@/components/ModeBar';
import GlobeView from '@/components/GlobeView';
import Timeline from '@/components/Timeline';
import { formatYear } from '@/lib/symlog';
import { ROUTES, type Route } from '@/lib/mockData';
import { loadDataset } from '@/lib/dataClient';
import { useRouter, useSearchParams } from 'next/navigation';

type Mode = 'Explore'|'Story'|'What‑If'|'Analyst';

export default function Page(){
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('Explore');
  const [year, setYear] = useState<number>(-500_000);
  const [layers, setLayers] = useState({ paleo: true, ancient: true, modern: true });
  const [q, setQ] = useState('');
  const [routes, setRoutes] = useState<Route[]>(ROUTES);
  const [envFrame, setEnvFrame] = useState<'present'|'lgm'>('present');
  const [envPolys, setEnvPolys] = useState<any[]|null>(null);
  const [seaDelta, setSeaDelta] = useState<number>(0);
  const [evidence, setEvidence] = useState({ archaeology: true, genetics: true, linguistics: true, modern: true, 'historic-forced': true });

  const classifyLayer = useCallback((r: Route): string => {
    const id = r.id || '';
    if (id.includes('slave') || id.includes('partition')) return 'historic-forced';
    if (r.category === 'EarlyModern/Modern') return 'modern';
    return 'archaeology';
  }, []);

  const filterFn = useCallback((a:any)=>{
    const cat = a.category as string;
    if (cat === 'Paleolithic' && !layers.paleo) return false;
    if (cat === 'Holocene/Ancient' && !layers.ancient) return false;
    if (cat === 'EarlyModern/Modern' && !layers.modern) return false;
    const r = routes.find(r => r.id === a.routeId);
    if (r) {
      const lay = classifyLayer(r) as keyof typeof evidence;
      if (!evidence[lay]) return false;
    }
    if (!q) return true;
    const hay = `${r?.id} ${r?.name} ${r?.category}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  }, [layers, q, routes, evidence, classifyLayer]);

  const activeRoutes = useMemo(()=>{
    const tol = year < -10000 ? 4000 : year < 1500 ? 500 : 80;
    return routes
      .filter(r => year >= r.start - tol && year <= r.end + tol)
      .filter(r => filterFn({ routeId: r.id, category: r.category }));
  }, [year, routes, filterFn]);

  // Restore from URL
  useEffect(() => {
    const y = parseInt(searchParams.get('y') || '');
    if (!Number.isNaN(y)) setYear(y);
    const m = searchParams.get('mode') as Mode | null; if (m) setMode(m);
    const p = searchParams.get('p'); const a = searchParams.get('a'); const md = searchParams.get('m');
    setLayers(s => ({
      paleo: p==null ? s.paleo : p==='1',
      ancient: a==null ? s.ancient : a==='1',
      modern: md==null ? s.modern : md==='1'
    }));
    const qq = searchParams.get('q'); if (qq) setQ(qq);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('y', String(year));
    params.set('mode', mode);
    params.set('p', layers.paleo ? '1':'0');
    params.set('a', layers.ancient ? '1':'0');
    params.set('m', layers.modern ? '1':'0');
    if (q) params.set('q', q);
    router.replace('?' + params.toString());
  }, [year, mode, layers, q, router]);

  // Load dataset.json if available
  useEffect(() => {
    let mounted = true;
    (async ()=>{
      const ds = await loadDataset();
      if (mounted && ds && Array.isArray(ds.routes)) {
        setRoutes(ds.routes as unknown as Route[]);
      }
    })();
    return ()=>{ mounted = false; };
  }, []);

  // Load environment polygons when frame is LGM
  useEffect(() => {
    let aborted = false;
    if (envFrame !== 'lgm') { setEnvPolys(null); return; }
    (async ()=>{
      try{
        const res = await fetch('/data/env/ice_lgm.geojson', { cache: 'force-cache' });
        if(res.ok){ const gj = await res.json(); if(!aborted){ setEnvPolys(gj.features || []); } }
      }catch(_e){ if(!aborted) setEnvPolys(null); }
    })();
    return ()=>{ aborted = true; };
  }, [envFrame]);

  // Build dynamic arcs from routes
  const particleArcs = useMemo(()=>{
    const segs: any[] = [];
    for (const r of routes){
      const layer = classifyLayer(r);
      const wps = (r as any).waypoints || [];
      for (let i=0;i<wps.length-1;i++){
        const [lat1, lon1] = wps[i]; const [lat2, lon2] = wps[i+1];
        const baseSeg = {
          id: `${r.id}_seg${i}`,
          routeId: r.id,
          name: r.name,
          category: r.category,
          start: r.start,
          end: r.end,
          magnitude: (r as any).magnitude,
          confidence: (r as any).confidence,
          startLat: lat1, startLng: lon1,
          endLat: lat2, endLng: lon2,
          vizLayer: layer
        } as any;
        const base = Math.max(1, Math.min(5, ((r as any).magnitude || 1)));
        const n = base * 12;
        for(let p=0;p<n;p++){
          const confN = (r as any).confidence === 'high' ? 3 : (r as any).confidence === 'medium' ? 2 : 1;
          const jitter = (4 - confN) / 4;
          segs.push({ ...baseSeg, pid: p, dashOffset: Math.random(), jitter });
        }
      }
    }
    return segs;
  }, [routes, classifyLayer]);

  const colorForLayer = useCallback((layer: string, alpha: number) => {
    const pal: Record<string,string> = {
      archaeology: `rgba(255,193,90,${alpha})`,      // amber
      genetics: `rgba(0,212,255,${alpha})`,         // cyan
      linguistics: `rgba(139,92,246,${alpha})`,     // violet
      modern: `rgba(59,130,246,${alpha})`,          // electric blue
      'historic-forced': `rgba(220,38,38,${alpha})` // crimson
    };
    return pal[layer] || `rgba(255,193,90,${alpha})`;
  }, []);

  function downloadCsv(list: Route[]){
    const rows = [['id','name','category','start','end','confidence']];
    list.forEach(r => rows.push([r.id, r.name, r.category, String(r.start), String(r.end), (r as any).confidence]));
    const csv = rows.map(r => r.map(x => String(x).replaceAll('"','""')).map(x=>`"${x}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='routes_filtered.csv'; a.click(); URL.revokeObjectURL(url);
  }

  function downloadGeoJson(list: Route[]){
    const features = list.map(r => ({
      type: 'Feature',
      properties: { id: r.id, name: r.name, category: r.category, start: r.start, end: r.end, confidence: (r as any).confidence },
      geometry: { type: 'LineString', coordinates: r.waypoints.map(([lat,lon])=>[lon,lat]) }
    }));
    const geo = { type: 'FeatureCollection', features } as any;
    const blob = new Blob([JSON.stringify(geo)], {type:'application/geo+json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='routes_filtered.geojson'; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="topbar">
        <div className="brand">
          <h1>HUMAN MIGRATIONS</h1>
          <div className="sub">Evidence‑driven globe • 500,000 BCE → 2025</div>
        </div>
        <div className="controls">
          <ModeBar mode={mode} setMode={setMode} />
          <div style={{color:'#dce6ff'}}>Year: {formatYear(year)}</div>
          <input type="search" placeholder="Search routes" value={q} onChange={e=>setQ(e.target.value)} style={{height:32,padding:'0 10px',border:'1px solid var(--border)',borderRadius:8,background:'transparent',color:'#fff'}}/>
        </div>
      </div>

      <GlobeView year={year} arcs={particleArcs} filters={filterFn} envPolygons={envPolys || undefined} envAlpha={envFrame==='lgm' ? 0.22 + Math.min(0.2, Math.abs(seaDelta)/100) : 0} colorForLayer={colorForLayer} />

      <div className="panel">
        <div className="section">
          <div className="title">Layers</div>
          <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" checked={layers.paleo} onChange={e=>setLayers(s=>({...s, paleo:e.target.checked}))}/> Paleolithic</label>
          <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" checked={layers.ancient} onChange={e=>setLayers(s=>({...s, ancient:e.target.checked}))}/> Holocene/Ancient</label>
          <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" checked={layers.modern} onChange={e=>setLayers(s=>({...s, modern:e.target.checked}))}/> Early‑Modern/Modern</label>
        </div>

        <Timeline year={year} setYear={setYear} />

        <div className="section">
          <div className="title">Evidence</div>
          <label style={{display:'flex',gap:8,alignItems:'center'}}>
            <input type="checkbox" checked={evidence.archaeology} onChange={e=>setEvidence(s=>({...s, archaeology:e.target.checked}))}/>
            <span style={{display:'inline-flex',alignItems:'center'}}><span style={{display:'inline-block',width:14,height:6,borderRadius:999,background:'#ffc15a',marginRight:6}}/>Archaeology</span>
          </label>
          <label style={{display:'flex',gap:8,alignItems:'center'}}>
            <input type="checkbox" checked={evidence.genetics} onChange={e=>setEvidence(s=>({...s, genetics:e.target.checked}))}/>
            <span style={{display:'inline-flex',alignItems:'center'}}><span style={{display:'inline-block',width:14,height:6,borderRadius:999,background:'#00d4ff',marginRight:6}}/>Genetics</span>
          </label>
          <label style={{display:'flex',gap:8,alignItems:'center'}}>
            <input type="checkbox" checked={evidence.linguistics} onChange={e=>setEvidence(s=>({...s, linguistics:e.target.checked}))}/>
            <span style={{display:'inline-flex',alignItems:'center'}}><span style={{display:'inline-block',width:14,height:6,borderRadius:999,background:'#8b5cf6',marginRight:6}}/>Linguistics</span>
          </label>
          <label style={{display:'flex',gap:8,alignItems:'center'}}>
            <input type="checkbox" checked={evidence['historic-forced']} onChange={e=>setEvidence(s=>({...s, ['historic-forced']:e.target.checked}))}/>
            <span style={{display:'inline-flex',alignItems:'center'}}><span style={{display:'inline-block',width:14,height:6,borderRadius:999,background:'#dc2626',marginRight:6}}/>Historic Forced</span>
          </label>
          <label style={{display:'flex',gap:8,alignItems:'center'}}>
            <input type="checkbox" checked={evidence.modern} onChange={e=>setEvidence(s=>({...s, modern:e.target.checked}))}/>
            <span style={{display:'inline-flex',alignItems:'center'}}><span style={{display:'inline-block',width:14,height:6,borderRadius:999,background:'#3b82f6',marginRight:6}}/>Modern</span>
          </label>
        </div>

        <div className="section">
          <div className="title">Environment</div>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            <label>Frame
              <select value={envFrame} onChange={e=>setEnvFrame(e.target.value as any)} style={{marginLeft:6,background:'transparent',color:'#fff',border:'1px solid var(--border)',borderRadius:8,padding:'6px 8px'}}>
                <option value="present">Present</option>
                <option value="lgm">LGM (~26 ka)</option>
              </select>
            </label>
            <label style={{display:'flex',gap:8,alignItems:'center'}}>Sea level Δ (m)
              <input type="range" min={-20} max={20} step={1} value={seaDelta} onChange={e=>setSeaDelta(parseInt(e.target.value,10))} />
              <span style={{fontSize:12,color:'var(--muted)'}}>{seaDelta} m</span>
            </label>
          </div>
          <div style={{fontSize:11,color:'var(--muted)'}}>LGM ice mask shown as translucent caps (mock). Sea level slider currently affects overlay emphasis.</div>
        </div>

        <div className="section">
          <div className="title">Active migrations</div>
          <div className="list">
            {activeRoutes.map(r=>
              <div key={r.id} className="card">
                <div style={{fontWeight:700,fontSize:13}}>{r.name}</div>
                <div style={{fontSize:11, color:'var(--muted)'}}>{r.category} • {formatYear(r.start)} → {formatYear(r.end)}</div>
              </div>
            )}
          </div>
        </div>

        <div className="section">
          <div className="title">Data & Export</div>
          <div style={{display:'flex', gap:8}}>
            <button className="mode" onClick={()=>downloadCsv(activeRoutes)}>Download CSV</button>
            <button className="mode" onClick={()=>downloadGeoJson(activeRoutes)}>Download GeoJSON</button>
          </div>
          <div style={{marginTop:8,fontSize:11,color:'var(--muted)'}}>
            Confidence encoding: high → longer solid arcs, brighter; low → more dotted, softer, and slightly jittered.
          </div>
        </div>

        {mode === 'Story' && (
          <div className="section">
            <div className="title">Story</div>
            <div className="card">Origins in Africa → Out‑of‑Africa → Sahul (stub)</div>
          </div>
        )}

        {mode === 'Analyst' && (
          <div className="section">
            <div className="title">Analyst</div>
            <div className="card">Filter UI to be expanded with advanced queries.</div>
          </div>
        )}
      </div>
    </div>
  );
}
