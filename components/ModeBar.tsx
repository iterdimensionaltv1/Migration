"use client";

type Mode = 'Explore'|'Story'|'What‑If'|'Analyst';

export default function ModeBar({mode, setMode}:{mode:Mode; setMode:(m:Mode)=>void}){
  const modes: Mode[] = ['Explore','Story','What‑If','Analyst'];
  return (
    <div className="controls" role="tablist" aria-label="Modes">
      {modes.map(m=>
        <button key={m} role="tab" aria-selected={mode===m} className={`mode ${mode===m?'active':''}`} onClick={()=>setMode(m)}>{m}</button>
      )}
    </div>
  );
}

