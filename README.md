# Human Migrations: 500,000 BCE → 2025

An interactive web app that visualizes the migration of Homo sapiens across the globe from 500,000 BCE to 2025. Explore a beautiful, animated 3D globe with a time slider, play/pause controls, and layered views from Paleolithic dispersals to modern migration corridors. Every route includes sources and confidence notes, and the full dataset can be downloaded as JSON.


Quick Start
- Requirements: a modern desktop or mobile browser. Run over a local web server (recommended) to avoid cross‑origin issues with textures.
- Start a static server from the project root:
  - Python: `python -m http.server 5500` then open `http://localhost:5500`
  - Node: `npx serve` (or your preferred static server)
  - VS Code: “Live Server” extension

Open `index.html` and interact:
- Space: play/pause the timeline
- Left/Right arrows: step time backward/forward (step size varies by era)
- Toggle layers: Paleolithic, Holocene/Ancient, Early‑Modern/Modern
- Adjust speed: Cinematic → Insane
- “Download data (JSON)”: exports all routes and sources


What This Is
- Scope: macro‑scale human migrations since the emergence of Homo sapiens. Earliest phases emphasize dispersal ranges and corridors, not precise paths. Post‑1500 routes include large historical and contemporary movements with official statistics where available.
- Time range: 500,000 BCE to 2025 CE. Years before 0 are treated as negative (e.g., −50,000 = 50,000 BCE).
- Visual encoding: color encodes era, line thickness encodes relative magnitude (1–5), and transparency encodes dating confidence (low/medium/high).
- Sources: each route lists its supporting references (peer‑reviewed literature, official statistics, or established databases). See the Sources panel in the app and `migrations.js`.


How It Works
- Globe and rendering: `Globe.gl` (bundles Three.js) via CDN; arcs for routes; points indicate common origins.
- Timeline: a range slider and play loop advance the current year; step size adapts by era (coarser in deep time, finer in recent centuries).
- Layers: filter by era to reduce visual density or focus on a period.
- Data export: click “Download data (JSON)” to save the exact dataset currently embedded in the app.


Data Model
Data lives in `migrations.js` as two globals: `SOURCES` and `ROUTES`.

- `SOURCES`: a dictionary of citations keyed by a stable id.
  - `label` (string): human‑readable citation text
  - `url` (string): link to the source

- `ROUTES`: an array of route objects:
  - `id` (string): stable identifier
  - `name` (string): route label
  - `category` (string): one of "Paleolithic", "Holocene/Ancient", "EarlyModern/Modern"
  - `start` (number): start year (BCE negative; CE positive)
  - `end` (number): end year
  - `magnitude` (1–5): relative flow weight for visual emphasis (not a headcount)
  - `confidence` ("low"|"medium"|"high"): dating/interpretation confidence
  - `waypoints` (array of `[lat, lon]`): sequential points that form the route’s arc segments
  - `sources` (array of `SOURCES` keys): supporting citations
  - `description` (string): short note on interpretation, context, or scope

Example (abridged):
```
const SOURCES = {
  NATURE_Hublin2017_JebelIrhoud: {
    label: "Hublin et al. 2017 (Nature): Jebel Irhoud ~315±34 ka",
    url: "https://www.nature.com/articles/nature22336"
  }
};

const ROUTES = [
  {
    id: "southern_oa_85_55ka",
    name: "Major Out‑of‑Africa via Arabia (southern route)",
    category: "Paleolithic",
    start: -85000,
    end: -55000,
    magnitude: 2,
    confidence: "medium",
    waypoints: [[10,45],[18,47],[20,75]],
    sources: ["NATURE_Hublin2017_JebelIrhoud"],
    description: "Main sustained dispersal of H. sapiens into Arabia and South Asia."
  }
];
```


Methodology & Caveats
- Synthesis: deep‑time routes summarize consensus corridors and ranges from archaeology, paleoanthropology, and genetics; modern routes leverage official statistics (UN DESA, IOM) and well‑maintained databases (e.g., SlaveVoyages).
- Uncertainty: dates and paths are uncertain in the Paleolithic; lines are schematic and scaled for narrative clarity. Confidence levels are provided and encoded visually.
- Magnitude: the `magnitude` field is a relative, visual weight—not a direct headcount. When robust counts exist (e.g., slave trade, modern corridors), they are described in the route text and sources.
- Calendars: BCE is negative; CE is positive. Labels display “BCE/CE”.


Architecture
- `index.html`: layout, panels, and Globe.gl script
- `app.js`: globe setup, animation loop, filtering, UI bindings
- `migrations.js`: data schema (`SOURCES`, `ROUTES`) and curated routes
- `styles.css`: glass‑style UI, legend, responsive tweaks
- External assets: Earth textures from unpkg via Globe.gl examples
 - Borders: prefer same-origin `assets/ne_110m_admin_0_countries.geojson` to avoid CORS; see `docs/assets.md`


Contributing Data
1) Add or refine sources in `SOURCES` with a clear `label` and `url`.
2) Add a route in `ROUTES` with:
   - Schematic `waypoints` in `[lat, lon]` degrees (keep to several points to avoid visual clutter)
   - A balanced `magnitude` across the dataset (1=minor, 5=very large)
   - Honest `confidence` and a concise `description` summarizing assumptions
   - At least one reputable citation in `sources`
3) Test locally, scrub for typos, and ensure the new route renders and filters properly.


Roadmap (Implementation Plan)
Phase 1 — Core experience (done/partial)
- Interactive 3D globe, timeline, and playback controls
- Era layers; visual encoding for magnitude and confidence
- Initial dataset spanning key dispersals and corridors with sources
- Sources panel and JSON export

Phase 2 — Data enrichment and coverage
- Deepen Paleolithic coverage (Africa‑wide dynamics, multiple Levant windows, Asia detail)
- Refine Americas entry scenarios with latest footprints and archaeology debates
- Expand Holocene flows (Neolithic China, Sahara wet/dry phases, Central/SE Asia networks)
- Broaden Austronesian, Polynesian, and Madagascar narratives with high‑precision chronologies
- Add major post‑1500 flows beyond those included (indentured labor, intra‑Asian, intra‑African)
- Cite robust quantitative baselines where available; annotate uncertainty elsewhere

Phase 3 — UX polish and discovery
- Click to focus a route; camera fly‑to; quick filter by region/keyword
- Search by route/source; hover previews; compact mobile layout
- “Story mode” sequences (curated chapters) with narration and links

Phase 4 — Analytics and synthesis layers
- Heatmap/flow density per century; route stacking by era
- Small multiples for periods; counters of active flows by date

Phase 5 — Quality, accessibility, and i18n
- Link checker and source validator; data lint rules
- Keyboard and screen‑reader affordances; high‑contrast theme
- i18n scaffolding for UI strings and story mode

Phase 6 — Packaging and deployment
- Pin CDN versions; offline asset option
- CI deploy to GitHub Pages/Netlify; basic telemetry (optional)

If you want, open issues for specific routes you’d like to see, share sources, or propose improvements to the schema.


Acknowledgements
- Globe.gl and Three.js for rendering
- UN DESA, IOM, and domain researchers for data
- SlaveVoyages database for trans‑Atlantic trade counts


License and Sources
- Code: see repository license if present. If none, please contact the maintainers before reuse.
- Data: each source retains its original rights. This project links to sources for verification and fair scholarly use.


Extended Scope: Simulation Engine (Animals-on-Land → Present)
This project will grow into a broader simulation engine that spans from the earliest tetrapod colonization of land in the Paleozoic to present-day human migrations. The existing Homo sapiens visualization becomes one “era module” in a deeper, multi‑epoch timeline. See docs/simulation-engine.md for design, data model v2, basemap strategy across geologic time, and a phased plan.

Key timeline anchors
- 375 Ma: first land vertebrates
- 65 Ma: mammals rise post K–Pg
- 6–7 Ma: earliest hominins
- 2 Ma: Homo erectus dispersals
- 300 ka: Homo sapiens
- 100–50 ka: Out‑of‑Africa waves
- 10 ka: agriculture & settlements
- 1500–1900 CE: colonization to industrialization/globalization
- 2025 CE: digital age, refugee crises, climate migration
