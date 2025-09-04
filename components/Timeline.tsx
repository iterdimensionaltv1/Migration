"use client";

import { sliderToYear, yearToSlider, formatYear } from '@/lib/symlog';
import { useEffect, useState } from 'react';

export default function Timeline({year, setYear}:{year:number; setYear:(y:number)=>void}){
  const [t, setT] = useState<number>(yearToSlider(year));

  useEffect(()=>{ setT(yearToSlider(year)); }, [year]);

  function onInput(x:string){
    const v = parseInt(x,10);
    setT(v);
    setYear(sliderToYear(v));
  }

  return (
    <div className="section">
      <div className="title">Timeline</div>
      <input type="range" min={0} max={1000} step={1} value={t} onChange={e=>onInput(e.target.value)} />
      <div style={{display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--muted)', marginTop:4}}>
        <span>–470M</span><span>–300M</span><span>–200M</span><span>–100M</span><span>–10M</span><span>–500k</span><span>–10k</span><span>0</span><span>1500</span><span>1900</span><span>2025</span>
      </div>
      <div className="chips" style={{marginTop:8}}>
        {/* Deep-Time epochs (compressed) */}
        {[{y:-470_000_000,l:'Ordovician'},{y:-428_000_000,l:'Silurian'},{y:-395_000_000,l:'Devonian'},{y:-320_000_000,l:'Carboniferous'},{y:-275_000_000,l:'Permian'},{y:-230_000_000,l:'Triassic'},{y:-160_000_000,l:'Jurassic'},{y:-90_000_000,l:'Cretaceous'},{y:-50_000_000,l:'Paleogene'},{y:-5_000_000,l:'Neogene'}].map(c=>
          <button key={c.l} className="chip" onClick={()=>setYear(c.y)}>{c.l}</button>
        )}
        {/* Sapiens zone */}
        {[{y:-120000,l:'MIS 5'},{y:-26000,l:'LGM'},{y:-10000,l:'Early Holocene'},{y:-7000,l:'Neolithic'},{y:-500,l:'Classical'},{y:1600,l:'1500–1900'},{y:1950,l:'1900–2025'}].map(c=>
          <button key={c.l} className="chip" onClick={()=>setYear(c.y)}>{c.l}</button>
        )}
        <span style={{marginLeft:'auto', fontSize:12, color:'var(--muted)'}}>{formatYear(year)}</span>
      </div>
    </div>
  );
}
