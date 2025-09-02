"use client";

import { useEffect, useMemo, useRef } from 'react';
type ArcSeg = {
  id: string;
  routeId: string;
  name: string;
  category: string;
  start: number;
  end: number;
  magnitude: number;
  confidence: 'low'|'medium'|'high';
  startLat: number; startLng: number;
  endLat: number; endLng: number;
  dashOffset: number;
  jitter?: number;
  vizLayer?: string; // archaeology | genetics | linguistics | modern | historic-forced
};

function baseColor(d: any) {
  const alpha = d.confidence === 'high' ? 0.95 : d.confidence === 'medium' ? 0.78 : 0.6;
  return `rgba(90,255,140,${alpha})`;
}

export default function GlobeView({ year, arcs, filters, envPolygons, envAlpha, colorForLayer }:{ year:number; arcs: ArcSeg[]; filters:(seg:ArcSeg)=>boolean; envPolygons?: any[]; envAlpha?: number; colorForLayer:(layer:string, alpha:number)=>string }){
  const ref = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    let cleanup = () => {};
    let Globe: any;
    let globe: any;
    let mounted = true;
    (async () => {
      const mod = await import('globe.gl');
      Globe = mod.default || mod;
      if (!mounted || !ref.current) return;
      globe = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .showAtmosphere(true)
        .atmosphereColor('#88c7ff')
        .atmosphereAltitude(0.25)
        .polygonsData([])
        .polygonCapColor((d:any)=> d && d.properties && d.properties.__kind === 'ice' ? `rgba(180,220,255,${envAlpha ?? 0.18})` : 'rgba(0,0,0,0)')
        .polygonSideColor(()=> 'rgba(0,0,0,0)')
        .polygonStrokeColor(()=> 'rgba(0,0,0,0)')
        .polygonsTransitionDuration(0)
        .arcStroke(0.7)
        .arcAltitude((d: any) => 0.02 + 0.005 * (d.magnitude || 1) + (d.jitter||0) * (Math.random()*0.005))
        .arcDashLength((d:any)=> d.confidence === 'high' ? 0.08 : d.confidence === 'medium' ? 0.04 : 0.02)
        .arcDashGap(1)
        .arcDashAnimateTime(2500)
        .arcColor((d:any)=>{
          const alpha = d.confidence === 'high' ? 0.95 : d.confidence === 'medium' ? 0.78 : 0.6;
          const layer = d.vizLayer || 'archaeology';
          return colorForLayer(layer, alpha);
        })
        .arcDashInitialGap((d:any)=>d.dashOffset)
        .arcLabel((d:any)=> `${d.name}\n${formatYear(d.start)} → ${formatYear(d.end)}\nConfidence: ${d.confidence}`)
        (ref.current);
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.35;
      globe.width(window.innerWidth);
      globe.height(window.innerHeight);
      const onResize = ()=>{ globe.width(window.innerWidth); globe.height(window.innerHeight); };
      window.addEventListener('resize', onResize);
      globeRef.current = globe;
      cleanup = ()=>{ window.removeEventListener('resize', onResize); globeRef.current = null; };
    })();
    return () => { mounted = false; cleanup(); };
  }, []);

  const activeArcs = useMemo(() => {
    const tol = year < -10000 ? 4000 : year < 1500 ? 500 : 80;
    const active = new Set(
      arcs.filter(a => (year >= a.start - tol && year <= a.end + tol) && filters(a)).map(a => a.id)
    );
    return arcs.filter(p => active.has(p.id));
  }, [year, filters, arcs]);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.arcsData(activeArcs);
    }
  }, [activeArcs]);

  // Environment polygons
  useEffect(() => {
    if (!globeRef.current) return;
    const polys = (envPolygons || []).map((f:any)=>({ ...f, properties: { ...(f.properties||{}), __kind: 'ice' } }));
    globeRef.current.polygonsData(polys);
  }, [envPolygons, envAlpha]);

  // Update polygon color when alpha changes
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.polygonCapColor((d:any)=> d && d.properties && d.properties.__kind === 'ice' ? `rgba(180,220,255,${envAlpha ?? 0.18})` : 'rgba(0,0,0,0)');
    const curr = globeRef.current.polygonsData();
    globeRef.current.polygonsData(curr);
  }, [envAlpha]);

  return <div ref={ref} className="globe" />;
}

function formatYear(y: number){
  return y < 0 ? `${Math.abs(y).toLocaleString()} BCE` : `${y.toLocaleString()} CE`;
}
