# Human Migration Simulator — Experience & Data Design v1

## 0) North Star

A living, evidence‑driven globe that lets you watch Homo sapiens spread from Africa to the entire planet (500,000 BCE → 2025 CE). It’s scientific first, cinematic second: sources visible at every step, uncertainty encoded in the visuals, and tools that let you compare narratives and test counterfactuals.

---

## 1) Core Modes

### A. Explore (default)

* 3D Globe with time‑aware basemap (ice sheets, coastlines, biomes), smooth camera, mouse/touch.
* Time Scrubber (log‑aware) covering 500,000 BCE → 2025 CE. Continuous drag, +/- speed, and jump “Epoch Chips” (e.g., MIS 5, LGM, Early Holocene, Neolithic, Classical, 1500–1900, 1900–2025).
* Evidence Toggles: Genetics (ancient DNA), Archaeology (sites/industries), Linguistics (language families), Environment (sea level/ice/greening Sahara), Historic Flows (e.g., Atlantic slave trade), Modern Migration (UN DESA).
* Confidence Encoding: solid vs. dashed flows; alpha/blur for uncertainty; per‑route confidence tooltip.
* Context Cards on hover/click: site snapshot (name, date range, culture/industry, evidence type), with micro‑gallery and references.
* Compare Lens: split‑view or drag lens to compare layers or time slices (e.g., 26 ka coastlines vs. today; or genetics vs. archaeology evidence).

### B. Story

A cinematic, chaptered walkthrough:

1. Origins in Africa → early Homo sapiens and contemporaries
2. Multiple Out‑of‑Africa Waves → northern/southern corridors
3. Sahul → first Australians and Papuans
4. Into Eurasia → IUP/UP, Neanderthal contact
5. Americas → windows of entry and coastal/inland routes
6. Holocene Expansions → Bantu, Austronesian, Indo‑European
7. State Systems & Empires → long‑range networks (Silk Roads, Indian Ocean)
8. Forced & Free Flows (1500–1900) → Atlantic slave trade, indenture, mass European/Asian diasporas
9. Contemporary Mobility (1900–2025) → global migration corridors
   Each chapter has narrator text, deep‑dive sidebars, and citations tile pinned to the viewport.

### C. What‑If

Simple parameterized counterfactuals:

* Sea Level: vary −20 m to +20 m from baseline to see coastlines/land bridges change (Beringia, Sunda/Sahul).
* Climate Corridor: toggle “Green Sahara” persistence or reduced monsoon strength.
* Route Costs: increase/decrease desert/ice/forest friction to see least‑cost paths shift.

### D. Analyst

* Query builder to filter by evidence type, date range, region, culture/industry (e.g., “MSA → LSA transitions 60–20 ka in N. Africa”).
* Download filtered CSV/GeoJSON with embedded BibTeX/DOI list.

---

## 2) Interaction & HUD

* Timeline: symlog scale with ticks that densify for recent centuries; “Hold to Scrub” for micro‑scrubbing;
* Speed: 1×, 2×, 5×, “jump by event”.
* Event Markers: small timeline flags (e.g., Toba, LGM, Younger Dryas, Neolithic starts per region).
* Search: sites, cultures, haplogroups, language families, dates.
* Bookmarking: save a camera/time/layer state as a shareable permalink.

---

## 3) Visual System

* Palette: deep charcoal oceans; land in matte neutrals; evidence flows in layered neon (Genetics=cyan, Archaeology=amber, Linguistics=violet, Environment=teal for overlays, Historic Forced=crimson, Modern=electric blue).
* Flow Aesthetic: millions of GPU‑instanced particles following spline routes; velocity mapped to period intensity; additive glow in Story mode, subdued in Analyst.
* Uncertainty: jitter, softness, and opacity encode confidence.
* Typography: Inter for UI; Source Serif Pro for long‑form.
* Audio (optional): subtle ambience that changes per epoch; soft percussive ticks when passing major markers.

---

## 4) Data Model (TypeScript)

```ts
// Absolute dates: years before present (BP, present=1950) and BCE/CE helpers
export type YearBP = number; // e.g., 23000
export type YearCE = number; // e.g., 2025; BCE stored as negative CE for sorting

export interface EvidenceRef { id: string; title: string; authors?: string[]; year?: number; doi?: string; url?: string; note?: string; }

export interface Site {
  id: string;
  name: string;
  lat: number; lon: number;
  startBP?: YearBP; endBP?: YearBP; // uncertainty ranges allowed
  culture?: string; // e.g., MSA, IUP, Lapita, Cardial, etc.
  evidenceTypes: ("archaeology"|"genetics"|"linguistics")[];
  references: EvidenceRef[];
  confidence: 0|1|2|3; // 0=tentative … 3=high
}

export interface MigrationEdge {
  id: string;
  fromSite: string; toSite: string; // Site ids
  earliestBP?: YearBP; latestBP?: YearBP;
  routeGeometry: { type: "LineString"; coordinates: [number, number][] }; // GeoJSON
  drivers?: ("climate"|"technology"|"demography"|"conflict"|"trade"|"forced")[];
  evidence: EvidenceRef[]; // papers backing the route
  confidence: 0|1|2|3;
}

export interface RasterLayer { // time‑varying environment
  id: string; name: string; kind: "seaLevel"|"ice"|"precip"|"temp"|"biome";
  times: YearBP[]; // frames keyed to timestamps
  tilesetURL: string; // vector/raster tiles
  metadataRefs: EvidenceRef[];
}
```

Design notes

* Store BCE/CE and BP; display user‑friendly strings (e.g., “23–21 ka”, “315 ± 34 ka”).
* Per‑entity confidence feeds shader parameters for softness/opacity.

---

## 5) Data Layers (v1 scope)

1. Ancient DNA points (AADR): place individuals with date, context, ancestry summary; optional haplogroups.
2. Key archaeological sites: curated set for major milestones (e.g., earliest Homo sapiens fossils, earliest IUP sites, Sahul first settlement, Americas early evidence).
3. Holocene expansions: Bantu, Austronesian, Indo‑European—represented as time‑windowed, thickness‑weighted arcs between anchor regions.
4. Environment: Sea level curve → dynamic coastlines; LGM ice masks; African Humid Period extent overlay.
5. Historic forced migration: Trans‑Atlantic Slave Trade flows by decade.
6. Modern migration: origin↔destination corridors (1990→2024) with bandwidth scaled to stock.

---

## 6) Sourcing & Provenance (displayed in‑app per layer)

Links/DOIs listed in the live app; summarized here.

* Early Homo sapiens & dispersals: Jebel Irhoud (Morocco); Bacho Kiro (Bulgaria) early H. sapiens; earliest Australia (Madjedbebe); early Americas (White Sands footprints). Plus Smithsonian Human Origins context and Max Planck ancient DNA syntheses.
* Holocene expansions: Bantu (recent genomic syntheses), Austronesian (Lapita chronology + genetic papers), Indo‑European steppe ancestry (ancient DNA).
* Environment: Sea‑level since LGM (Lambeck et al.), ICE‑6G/PMIP ice reconstructions, African Humid Period syntheses.
* Historic & Modern: SlaveVoyages database; UN DESA International Migrant Stock 2024; IOM World Migration Report 2024.

---

## 7) Simulation Engine

Route animation

* Hybrid: anchored keyframes (expert‑defined corridors) + least‑cost path refinement over dynamic friction rasters (ice, aridity, slope, sea).
* GPU‑instanced particles follow cubic splines; particle density ~ migration intensity; uncertainty modulates jitter.

Environment

* Precompute dynamic coastlines from sea‑level rasters at key frames (e.g., 120, 80, 50, 26, 18, 12, 8 ka, then 5→0 ka).
* Switch ice masks and biome overlays per frame.

Performance

* Vector‑tile all arcs/sites (Tippecanoe/PMTiles).
* Level‑of‑detail & frustum culling; batched draw calls; WebGL2/WebGPU fallback chain.

---

## 8) UX for Truthfulness

* Hover source‑chips: tiny DOI/URL badges that expand on click.
* Disputed labels: red dot shows contested dates/interpretations; a mini‑panel lists alternative views.
* Confidence legend explaining opacity/jitter semantics.
* Per‑frame changelog: “What changed at this time index?” (new coastlines, route activation, sites appearing).

---

## 9) Tech Stack

* Frontend: Next.js (App Router), TypeScript, React 18.
* Globe: three‑fiber + drei or CesiumJS (for built‑in time‑dynamic primitives). Start with three for flexibility.
* Viz: deck.gl for arcs/flows; d3‑scale/time; react‑spring/motion for UI.
* Tiles: Vector/raster tiles via PMTiles (static hosting) or Mapbox/MapLibre.
* Data: Git‑versioned CSV/GeoJSON + PMTiles;
* Search: client Lunr/Fuse.
* Build: Vercel static export + edge functions for on‑demand tiles; Cloudflare R2 for assets.

---

## 10) Accessibility & Intl

* Keyboard‑operable timeline and camera (WASD + arrow + tab index);
* Colorblind‑safe palettes; WCAG AA text contrast; captions for narration; metric/imperial toggles.

---

## 11) MVP Cut

1. Globe + timeline + dynamic coastlines/ice.
2. Curated milestones: ~30 sites (Africa, Levant, Sahul, East Asia, Europe, Siberia, Americas).
3. 3 Holocene expansions (Bantu, Austronesian, Indo‑European) as time‑windowed arcs.
4. Atlantic Slave Trade flows (decadal) + UN migrant stock corridors (1990→2024).
5. Story chapter 1–3.

---

## 12) Example Data (compact)

```json
{
  "sites": [
    {"id":"irhoud","name":"Jebel Irhoud","lat":31.95,"lon":-8.0,
     "startBP":349000,"endBP":281000,"culture":"MSA",
     "evidenceTypes":["archaeology"],
     "references":[{"id":"hublin2017","title":"Jebel Irhoud and the pan-African origin of Homo sapiens","year":2017}],
     "confidence":3},
    {"id":"madjedbebe","name":"Madjedbebe","lat":-12.56,"lon":132.95,
     "startBP":70000,"endBP":50000,"evidenceTypes":["archaeology"],
     "references":[{"id":"clarkson2017","title":"Human occupation of northern Australia by 65,000 years ago","year":2017}],
     "confidence":3}
  ],
  "edges": [
    {"id":"lev_sinai_iup","fromSite":"north_africa","toSite":"levant",
     "earliestBP":70000,"latestBP":50000,
     "routeGeometry":{"type":"LineString","coordinates":[[20,25],[35,31]]},
     "drivers":["climate","technology"],
     "evidence":[{"id":"abbas2023"}],
     "confidence":2}
  ]
}
```

---

## 13) Roadmap Highlights

* Integrate ROAD and AADR subsets (curated, cited) into tiles.
* Add per‑region Neolithic starts and language‑family overlays.
* Expand Story to modern diasporas; add remittances overlay.
* Open data download + in‑app “Report an issue” per item.

---

## 14) Risks & Mitigations

* Contested dates → show alternate date ranges and label confidence.
* Over‑deterministic visuals → emphasize corridors/intervals, not single paths; expose assumptions in What‑If.
* Performance → strict budgets (draw calls, tiles), precomputed frames, dynamic LOD.

---

## 15) Credits & Licensing

* Prefer open datasets (CC‑BY/ODC‑BY) and link to original DOIs.
* Provide export of visible data + machine‑readable citations.

---

### Ready to Build

Starter plan: migrate to Next.js + three‑fiber with deck.gl/PMTiles for scalable layers and a symlog timeline. This repository currently hosts a static Globe.gl prototype; the UI and code have been updated to align with this North Star and provide a migration path.

