# Simulation Engine: Animals-on-Land → Present

Vision
- Build a unified, source-driven simulation engine from the first vertebrates on land (Devonian) through hominins to modern human migrations.
- Present a time-aware globe whose basemap, climate context, and biogeography evolve across geologic time, while preserving a high-quality, citation-first approach.

Time & Units
- Global time axis: −400,000,000 to 2025 (years; BCE negative, CE positive). For readability, UI labels show Ma for deep time (e.g., 370 Ma) and BCE/CE for the late Quaternary.
- Piecewise timescale: compress deep time, expand the last 2.5 Ma, and further expand the last 10 kyr and 500 yr for human detail. The slider and playback step sizes adapt by era.

Geography & Basemaps
- Basemap provider abstraction:
  - PresentDayBasemap: current Earth (satellite, borders, graticules).
  - PaleoBasemap: paleogeographic coastlines/landmasses reconstructed per timeslice (e.g., every 5–10 Ma).
- Data sources (non-exhaustive; to be vetted and pinned):
  - GPlates/pyGPlates + GPlates Web Services for plate reconstructions and coastlines.
  - Scotese PALEOMAP/Atlas for curated paleogeography rasters (licensing applies).
  - ETOPO modern topography/bathymetry for present-day.
- Strategy: cache a low-res tileset per timeslice; crossfade textures as time advances; hide modern borders outside the last ~20 kyr.

Engine Concepts
- Entities (examples):
  - TaxonRange: spatial range envelope or corridor for a clade (e.g., early tetrapods, mammals, hominins).
  - Flow (Route): directed dispersal arc or corridor within a time window (used already for Homo sapiens).
  - Barrier/Bridge: dynamic features like ice sheets, land bridges (Beringia), deserts, forest belts.
  - ContextLayer: climate zone, biome boundary, coastline linework per timeslice.
- Processes:
  - Dispersal: range expansions with velocity/uncertainty.
  - Vicariance/Barrier change: splits/merges in ranges due to geography/climate.
  - Admixture/Replacement: lineage or population interactions (late Quaternary, humans).

Data Model v2 (additive to current ROUTES/SOURCES)
- sources: unchanged in spirit (key → {label,url}).
- entities:
  - type: "taxon_range" | "flow" | "context" | "barrier" | "human_flow" | "hominin_flow" | "note".
  - id, name, description, confidence: extend to include "very_low" for deep-time.
  - time: { start: year, end: year }
  - geometry:
    - kind: "arc" | "polyline" | "polygon" | "bbox" | "multipolygon".
    - coords: GeoJSON-like arrays in lat/lon (on the reconstructed paleoglobe for the given time slice).
  - magnitude: optional visual weight (retain 1–5 convention where headcounts are absent); for humans, notes may include quantitative stats.
  - tags: ["tetrapod","mammal","hominin","h_sapiens","pleistocene","holocene", ...]

Rendering & UI
- Basemap switching: swap textures/coastlines by nearest timeslice; fade transitions; LOD by zoom.
- Timeline UI: multi-scale ticks (Devonian → Mesozoic → Cenozoic → Pleistocene → Holocene → CE). Mousewheel/gesture to zoom the timeline scale.
- Layering: toggles for Eras, Taxa (tetrapods/mammals/hominins/humans), Barriers/Bridges, and Climate.
- Interaction: hover highlight; click to focus and fly-to; story mode chapters per era; data download per active window.

Performance & Packaging
- Lazy-load datasets per era; chunk large geometries; simplify polygons at runtime by zoom.
- Pre-bake paleomaps to web-friendly rasters; pin versions and consider an offline `assets/` package.

Data & Source Candidates (to evaluate and cite precisely)
- Paleogeography/plates: GPlates (and GPlates Web Services), Scotese PALEOMAP.
- Fossil occurrences: Paleobiology Database (PBDB) for occurrence points by time and taxon.
- Paleoclimate/biomes: published reconstructions (e.g., BIOME/BIOME4 grids; specific models per period) with licensing checks.
- Quaternary ice/sea level: ICE-6G/GLAC-1D references, LGM datasets, shoreline change literature.
- Hominins/humans: existing peer‑reviewed syntheses and databases already listed in `migrations.js`, plus curated additions for earlier hominins.

Roadmap (Phased)
1) Framework & UX
- Add multi-scale timeline, eras, and layer toggles; define basemap provider API; stub timeslice loading.

2) Paleogeography MVP
- Integrate low‑res paleocoastlines every 10 Ma (GPlates/PALEOMAP); hide modern borders pre‑Holocene.

3) Deep-Time Entities
- Add curated exemplar ranges: early tetrapods (Devonian), synapsids (Permian), early mammals (Mesozoic), primate lineages (Cenozoic).

4) Hominins → Humans Bridge
- Add hominin dispersals (e.g., Homo erectus, Neanderthals, Denisovans) with uncertainty envelopes; stitch to existing H. sapiens routes.

5) Context Layers
- Add generalized barriers (ice sheets, Beringia, Sahara arid/humid phases) and climate belts for key windows (e.g., LGM, mid‑Holocene).

6) Data Quality & Tooling
- Data validator/lint; link checker; uncertainty visualization; citation completeness checks.

7) Performance & Release
- Code splitting by era; pre-baked assets; deployment with pinned assets and an offline option.

Open Questions
- Licensing and usage terms for paleogeography textures and plate models.
- Level of taxonomic resolution vs. visual clarity for deep-time.
- How to encode uncertainty bands intuitively at vastly different timescales.

Notes
- All pre‑human layers are schematic and should be treated as didactic—accurate to the best of current consensus but simplified for clarity. Confidence is often low/very low at deep-time; we will reflect that explicitly in data and rendering.


Milestone Epochs (Anchors)
Use these anchors for timeline ticks, basemap swaps, story chapters, and data loading boundaries. Values are approximate and may be refined with source‑backed timeslices.

- 375 Ma: First land vertebrates (early tetrapods) establish on land.
- 65 Ma: K–Pg extinction; rise and radiation of mammals in the Cenozoic.
- 6–7 Ma: Earliest hominins (e.g., Sahelanthropus, Orrorin, Ardipithecus).
- 2 Ma: Homo erectus dispersals beyond Africa begin.
- 300 ka: Emergence of Homo sapiens (mosaic across Africa).
- 100–50 ka: Out‑of‑Africa dispersals (multiple windows and routes).
- 10 ka: Agricultural revolution; permanent settlements expand.
- 1500–1900 CE: Colonization, early modern to industrial/globalization phases.
- 2025 CE: Digital age; refugee crises; climate‑related migration patterns.

Recommended basemap timeslices for MVP
- 375 Ma, 300 Ma, 200 Ma, 100 Ma, 65 Ma, 30 Ma, 7 Ma, 2 Ma, 300 ka, 80 ka, 20 ka, 10 ka, 1500 CE, 1900 CE, 2025 CE.
  - Load nearest paleogeography for any in‑between time; crossfade between adjacent slices.

Story Mode (first pass)
- Chapter 1: Landfall (375 Ma)
- Chapter 2: Mammal ascendance (65 Ma)
- Chapter 3: Hominins emerge (7–2 Ma)
- Chapter 4: Homo sapiens (300 ka)
- Chapter 5: Out‑of‑Africa (100–50 ka)
- Chapter 6: Holocene settlers (10 ka)
- Chapter 7: Empires and industry (1500–1900 CE)
- Chapter 8: Globalization to climate migration (1900–2025 CE)
