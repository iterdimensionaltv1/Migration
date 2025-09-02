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
        <span>–500k</span><span>–300k</span><span>–120k</span><span>–70k</span><span>–10k</span><span>0</span><span>1500</span><span>1900</span><span>2025</span>
      </div>
      <div className="chips" style={{marginTop:8}}>
        {[{y:-120000,l:'MIS 5'},{y:-26000,l:'LGM'},{y:-10000,l:'Early Holocene'},{y:-7000,l:'Neolithic'},{y:-500,l:'Classical'},{y:1600,l:'1500–1900'},{y:1950,l:'1900–2025'}].map(c=>
          <button key={c.l} className="chip" onClick={()=>setYear(c.y)}>{c.l}</button>
        )}
        <span style={{marginLeft:'auto', fontSize:12, color:'var(--muted)'}}>{formatYear(year)}</span>
      </div>
    </div>
  );
}

