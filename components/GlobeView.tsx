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
  const particlesRef = useRef<any[] | null>(null);
  const animRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);

  useEffect(() => {
    let cleanup = () => {};
    let Globe: any;
    let globe: any;
    let mounted = true;
    (async () => {
      Globe = await ensureGlobeCDN();
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
        // Hide arcs; we'll render moving dots instead
        .arcsData([])
        // Points as moving population packets
        .pointsData([])
        .pointAltitude(0.01)
        .pointRadius((d:any)=> 0.22 * (Math.sqrt((d.magnitude||1)) / 2))
        .pointColor((d:any)=>{
          const alpha = d.confidence === 'high' ? 0.95 : d.confidence === 'medium' ? 0.78 : 0.6;
          const layer = d.vizLayer || 'archaeology';
          return colorForLayer(layer, alpha);
        })
        (ref.current);
      globe.controls().autoRotate = false;
      globe.controls().autoRotateSpeed = 0.0;
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

  // Build moving dot particles from active arcs
  useEffect(() => {
    if (!globeRef.current) return;
    // Stop previous animation
    if (animRef.current) cancelAnimationFrame(animRef.current);
    particlesRef.current = activeArcs.map(seg => {
      const t0 = (Math.abs(seg.dashOffset || Math.random()) % 1);
      const speed = 0.02 + 0.02 * (Math.max(1, Math.min(5, seg.magnitude || 1)) / 5) + Math.random()*0.015; // degrees per second-like param
      const pt = gcInterp(seg.startLat, seg.startLng, seg.endLat, seg.endLng, t0);
      return {
        ...seg,
        t: t0,
        speed,
        lat: pt.lat,
        lng: pt.lng
      };
    });
    // Set initial points
    globeRef.current.pointsData(particlesRef.current);
    globeRef.current.pointLat((d:any)=>d.lat);
    globeRef.current.pointLng((d:any)=>d.lng);
    // Animate
    lastTsRef.current = performance.now();
    const tick = (ts:number)=>{
      if (!globeRef.current || !particlesRef.current) return;
      const dt = Math.min(100, ts - lastTsRef.current) / 1000; // seconds
      lastTsRef.current = ts;
      for (const p of particlesRef.current) {
        p.t = (p.t + p.speed * dt) % 1;
        const pt = gcInterp(p.startLat, p.startLng, p.endLat, p.endLng, p.t);
        // subtle jitter by confidence
        const j = (p.jitter || 0) * 0.5;
        p.lat = pt.lat + (Math.random()-0.5) * j;
        p.lng = pt.lng + (Math.random()-0.5) * j;
      }
      // Update the points; Globe.gl recalculates positions on setter
      globeRef.current.pointsData(particlesRef.current);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return ()=>{ if (animRef.current) cancelAnimationFrame(animRef.current); animRef.current = null; };
  }, [activeArcs, colorForLayer]);

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

declare global {
  interface Window { Globe?: any }
}
function ensureGlobeCDN(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.Globe) return Promise.resolve(window.Globe);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/globe.gl@2.36.2';
    script.async = true;
    script.onload = () => resolve(window.Globe);
    script.onerror = () => reject(new Error('Failed to load globe.gl'));
    document.head.appendChild(script);
  });
}

function toVec(lat:number, lon:number){
  const phi = lat * Math.PI/180;
  const lam = lon * Math.PI/180;
  const x = Math.cos(phi) * Math.cos(lam);
  const y = Math.cos(phi) * Math.sin(lam);
  const z = Math.sin(phi);
  return [x,y,z] as const;
}
function fromVec(x:number,y:number,z:number){
  const hyp = Math.sqrt(x*x + y*y);
  const lat = Math.atan2(z, hyp) * 180/Math.PI;
  const lon = Math.atan2(y, x) * 180/Math.PI;
  return { lat, lng: lon };
}
function gcInterp(lat1:number, lon1:number, lat2:number, lon2:number, t:number){
  const [x1,y1,z1] = toVec(lat1, lon1);
  const [x2,y2,z2] = toVec(lat2, lon2);
  const dot = Math.max(-1, Math.min(1, x1*x2 + y1*y2 + z1*z2));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return { lat: lat1, lng: lon1 };
  const so = Math.sin(omega);
  const s1 = Math.sin((1-t)*omega)/so;
  const s2 = Math.sin(t*omega)/so;
  const x = s1*x1 + s2*x2;
  const y = s1*y1 + s2*y2;
  const z = s1*z1 + s2*z2;
  return fromVec(x,y,z);
}
