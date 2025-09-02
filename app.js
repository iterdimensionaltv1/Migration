(function(){
  const globeEl = document.getElementById('globeContainer');
  const yearLabel = document.getElementById('yearLabel');
  const timeSlider = document.getElementById('timeSlider');
  const playBtn = document.getElementById('playBtn');
  const speedSelect = document.getElementById('speedSelect');
  const resetBtn = document.getElementById('resetBtn');
  const activeList = document.getElementById('activeList');
  const sourceList = document.getElementById('sourceList');
  const layerPaleo = document.getElementById('layerPaleo');
  const layerAncient = document.getElementById('layerAncient');
  const layerModern = document.getElementById('layerModern');
  const layerBorders = document.getElementById('layerBorders');
  const layerGraticules = document.getElementById('layerGraticules');
  const downloadBtn = document.getElementById('downloadDataBtn');
  const aboutBtn = document.getElementById('aboutBtn');
  const aboutModal = document.getElementById('aboutModal');
  const aboutClose = document.getElementById('aboutClose');
  const loadingEl = document.getElementById('loading');

  // --- Globe setup ---
  const globe = Globe()
    // High‑fidelity Earth texture (NASA Blue Marble via example CDN)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .showAtmosphere(true)
    .atmosphereColor('#88c7ff')
    .atmosphereAltitude(0.25)
    // Country outlines overlay for visual accuracy reference
    .polygonsData([])
    .polygonCapColor(()=>'rgba(0,0,0,0)')
    .polygonSideColor(()=>'rgba(0,0,0,0)')
    .polygonStrokeColor(()=>'rgba(255,255,255,0.20)')
    .polygonsTransitionDuration(0)
    // Migration arcs and points
    .arcStroke(0.9)
    .arcAltitude(d => 0.06 + 0.01 * (d.magnitude || 1))
    .arcDashLength(0.9)
    .arcDashGap(0.7)
    .arcDashAnimateTime(3500)
    .arcLabel(d => `${d.name}\n${fmtEra(d.category)} • ${fmtRange(d.start,d.end)}\n${d.description || ''}`)
    .pointAltitude(0.01)
    .pointColor(()=>'rgba(255,255,255,0.8)')
    .pointRadius(0.25)
    (globeEl);

  // Optional features depending on Globe.gl version
  if (typeof globe.showGraticules === 'function') {
    globe.showGraticules(true);
  }
  if (typeof globe.graticuleColor === 'function') {
    globe.graticuleColor('#ffffff18');
  } else if (typeof globe.graticulesColor === 'function') {
    globe.graticulesColor('#ffffff18');
  }

  // Initial camera pose
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.35;

  // Fit renderer
  function resize(){
    // Set numeric width/height (avoid passing arrays which yields NaN)
    globe.width(window.innerWidth);
    globe.height(window.innerHeight);
  }
  window.addEventListener('resize', resize);
  resize();

  // Load country borders preferring same-origin asset to avoid CORS
  const LOCAL_BORDERS_URL = 'assets/ne_110m_admin_0_countries.geojson';
  const API_BORDERS_URL = '/api/borders';
  const REMOTE_BORDERS_URL = 'https://unpkg.com/three-globe@2.44.0/example/datasets/ne_110m_admin_0_countries.geojson';

  let bordersLoading = false;
  function loadBorders(){
    if (bordersLoading) return Promise.resolve();
    bordersLoading = true;
    return fetch(LOCAL_BORDERS_URL, { cache: 'force-cache' })
      .then(r => { if(!r.ok) throw new Error('local_not_found'); return r.json(); })
      .catch(() => fetch(API_BORDERS_URL).then(r => { if(!r.ok) throw new Error('api_not_found'); return r.json(); }))
      .catch(err => {
        // As a last resort in localhost/dev, try remote (may CORS fail in prod)
        const isLocalhost = location.origin.startsWith('http://localhost') || location.origin.startsWith('http://127.0.0.1');
        if(isLocalhost){
          return fetch(REMOTE_BORDERS_URL).then(r=>r.json());
        }
        throw err;
      })
      .then(world => {
        if(world && (world.features || (world.type==='Topology'))){
          const features = world.features || world;
          window.__WORLD_FEATURES = features;
          if(!layerBorders || layerBorders.checked){
            globe.polygonsData(features);
          }
        }
        bordersLoading = false;
      })
      .catch(()=>{ bordersLoading = false; /* no borders available; continue without */ });
  }
  // Do not fetch borders on load; fetched when toggled on

  // Layer toggles: borders and graticules
  if(layerBorders){
    layerBorders.addEventListener('change', ()=>{
      if (layerBorders.checked) {
        if (window.__WORLD_FEATURES && window.__WORLD_FEATURES.length) {
          globe.polygonsData(window.__WORLD_FEATURES);
        } else {
          loadBorders().catch(()=>{
            // If borders still unavailable, turn toggle off to avoid repeated 404s
            layerBorders.checked = false;
          });
        }
      } else {
        globe.polygonsData([]);
      }
    });
  }
  if(layerGraticules){
    layerGraticules.addEventListener('change', ()=>{
      if (typeof globe.showGraticules === 'function') {
        globe.showGraticules(layerGraticules.checked);
      }
    });
  }

  // --- Build arcs from ROUTES ---
  // Convert route waypoints into segment arcs
  function expandRouteToArcs(route){
    const res = [];
    const wps = route.waypoints;
    for(let i=0;i<wps.length-1;i++){
      const [lat1, lon1] = wps[i];
      const [lat2, lon2] = wps[i+1];
      res.push({
        id: `${route.id}_seg${i}`,
        routeId: route.id,
        name: route.name,
        category: route.category,
        start: route.start,
        end: route.end,
        magnitude: route.magnitude,
        confidence: route.confidence,
        sources: route.sources,
        description: route.description,
        startLat: lat1, startLng: lon1,
        endLat: lat2, endLng: lon2
      });
    }
    return res;
  }
  const ALL_ARCS = window.ROUTES.flatMap(expandRouteToArcs);

  // Colors per era + confidence → alpha
  function baseColorFor(d){
    const c = {
      "Paleolithic": [122,208,255],
      "Holocene/Ancient": [255,193,90],
      "EarlyModern/Modern": [255,110,199]
    }[d.category] || [200,200,200];

    const alpha = { high: 0.95, medium: 0.75, low: 0.50 }[d.confidence] || 0.7;
    return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
  }
  let highlightedRouteId = null;
  let selectedRouteId = null;
  function colorWithHighlight(d){
    const base = baseColorFor(d);
    if (!highlightedRouteId && !selectedRouteId) return base;
    const isFocus = (d.routeId === highlightedRouteId) || (d.routeId === selectedRouteId);
    if (isFocus) return base;
    return base.replace(/rgba\(([^)]+),\s*([0-9.]+)\)/, (m, rgb, a) => `rgba(${rgb}, ${Math.min(0.15, parseFloat(a)||0.15)})`);
  }

  globe
    .arcsData([])
    .arcColor(colorWithHighlight)
    .arcStroke(d => ((d.routeId === highlightedRouteId || d.routeId === selectedRouteId) ? 1.3 : 0.9));

  // Points at waypoints (origins only for clarity)
  const points = window.ROUTES.map(r => {
    const [lat, lon] = r.waypoints[0];
    return { lat, lng: lon, name: r.name, category: r.category };
  });
  globe.pointsData(points);

  // --- Timeline state ---
  const minYear = parseInt(timeSlider.min,10);
  const maxYear = parseInt(timeSlider.max,10);
  let currentYear = minYear;
  let playing = false;
  let timer = null;

  function setYear(y){
    currentYear = Math.max(minYear, Math.min(maxYear, y));
    timeSlider.value = currentYear;
    yearLabel.textContent = `Year: ${formatYear(currentYear)}`;
    render();
  }

  // Which layers are enabled?
  function layerEnabled(cat){
    if(cat === "Paleolithic") return layerPaleo.checked;
    if(cat === "Holocene/Ancient") return layerAncient.checked;
    if(cat === "EarlyModern/Modern") return layerModern.checked;
    return true;
  }

  function render(){
    // Wider tolerance earlier; narrower in modern era
    const tol = currentYear < -10000 ? 4000
              : currentYear < 1500    ? 500
              : 80;

    const arcs = ALL_ARCS.filter(a =>
      (currentYear >= a.start - tol && currentYear <= a.end + tol) &&
      layerEnabled(a.category)
    );

    globe.arcsData(arcs);

    // Active list
    activeList.innerHTML = '';
    const routesActive = dedupe(arcs.map(a => a.routeId));
    routesActive.slice(0,40).forEach(rid => {
      const r = window.ROUTES.find(rr => rr.id === rid);
      const colorClass = r.category === 'Paleolithic' ? 'chip-paleo' : (r.category === 'Holocene/Ancient' ? 'chip-ancient' : 'chip-modern');
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div>
          <div class="title">${r.name}</div>
          <div class="era"><span class="chip ${colorClass}"></span>${fmtEra(r.category)} • ${fmtRange(r.start, r.end)}</div>
        </div>
        <div class="meta">${r.confidence === 'high' ? 'High confidence' : r.confidence === 'medium' ? 'Moderate confidence' : 'Low confidence'}</div>
        <div class="desc">${escapeHtml(r.description || '')}</div>
        <div class="meta" style="grid-column:1/-1">Sources: ${r.sources.map(sid => `<a target="_blank" href="${window.SOURCES[sid].url}">${window.SOURCES[sid].label}</a>`).join(' • ')}</div>
      `;
      card.addEventListener('mouseenter', ()=>{ highlightedRouteId = r.id; globe.arcsData(globe.arcsData()); });
      card.addEventListener('mouseleave', ()=>{ highlightedRouteId = null; globe.arcsData(globe.arcsData()); });
      card.addEventListener('click', ()=>{
        selectedRouteId = (selectedRouteId === r.id ? null : r.id);
        const centroid = centroidOf(r.waypoints);
        globe.pointOfView({ lat: centroid[0], lng: centroid[1], altitude: 1.8 }, 1200);
        const mid = Math.round((r.start + r.end)/2);
        setYear(mid);
        globe.arcsData(globe.arcsData());
      });
      activeList.appendChild(card);
    });
  }

  // Controls
  timeSlider.addEventListener('input', e => setYear(parseInt(e.target.value,10)));
  [layerPaleo, layerAncient, layerModern].forEach(el => el.addEventListener('change', render));

  playBtn.addEventListener('click', togglePlay);
  if (resetBtn) {
    resetBtn.addEventListener('click', ()=>{
      selectedRouteId = null;
      highlightedRouteId = null;
      globe.controls().autoRotate = true;
      globe.pointOfView({ lat: 10, lng: 10, altitude: 2.2 }, 800);
      globe.arcsData(globe.arcsData());
    });
  }
  document.addEventListener('keydown', (e)=>{
    if(e.code === 'Space'){ e.preventDefault(); togglePlay(); }
    if(e.code === 'ArrowRight'){ setYear(currentYear + step()); }
    if(e.code === 'ArrowLeft'){ setYear(currentYear - step()); }
  });

  function step(){
    // variable step by era (coarser in deep past)
    if(currentYear < -100000) return 5000;
    if(currentYear < -10000)  return 1000;
    if(currentYear < 1500)    return 100;
    if(currentYear < 1900)    return 10;
    return 1;
  }

  function togglePlay(){
    playing = !playing;
    playBtn.textContent = playing ? '❚❚' : '▶';
    if(playing){
      const frame = ()=>{
        if(!playing) return;
        const spd = parseInt(speedSelect.value,10);
        setYear(currentYear + step());
        timer = setTimeout(()=>requestAnimationFrame(frame), spd);
        if(currentYear >= maxYear) { playing = false; playBtn.textContent = '▶'; }
      };
      frame();
    }else{
      clearTimeout(timer);
    }
  }

  // Sources section
  sourceList.innerHTML = Object.entries(window.SOURCES).map(([k,v]) => {
    return `<div>• <a target="_blank" href="${v.url}">${v.label}</a></div>`;
  }).join('');

  // Download JSON
  downloadBtn.addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify({ routes: window.ROUTES, sources: window.SOURCES }, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'human_migrations_dataset.json'; a.click();
    URL.revokeObjectURL(url);
  });

  // Helpers
  function fmtEra(cat){ return cat; }
  function fmtRange(a,b){ return `${formatYear(a)} → ${formatYear(b)}`; }
  function formatYear(y){
    if(y < 0) return `${Math.abs(y).toLocaleString()} BCE`;
    return `${y.toLocaleString()} CE`;
  }
  function dedupe(arr){ return [...new Set(arr)]; }
  function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
  function centroidOf(points){
    if(!points || !points.length) return [0,0];
    let lat=0,lng=0; points.forEach(p=>{ lat+=p[0]; lng+=p[1]; });
    return [lat/points.length, lng/points.length];
  }

  // About modal
  if (aboutBtn && aboutModal && aboutClose) {
    const openAbout = ()=>{ aboutModal.classList.remove('hidden'); aboutModal.setAttribute('aria-hidden','false'); };
    const closeAbout = ()=>{ aboutModal.classList.add('hidden'); aboutModal.setAttribute('aria-hidden','true'); };
    aboutBtn.addEventListener('click', openAbout);
    aboutClose.addEventListener('click', closeAbout);
    aboutModal.addEventListener('click', (e)=>{ if(e.target.classList && e.target.classList.contains('modal-backdrop')) closeAbout(); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeAbout(); });
  }

  // Hide loading overlay on first animation frame
  if (loadingEl) requestAnimationFrame(()=>{ loadingEl.style.display = 'none'; });

  // Kick off
  setYear(parseInt(timeSlider.value,10));
})();
