# Human Migration Simulator (Next.js)

An evidence‑driven globe showing Homo sapiens movements from 500,000 BCE → 2025 CE. The codebase has been fully refactored to a modern Next.js (App Router, TypeScript) app with Globe.gl, a symlog timeline, modes (Explore/Story/What‑If/Analyst), search/bookmarking, and CSV/GeoJSON exports. See docs/northstar.md for the product design.


Quick Start
- Dev: `npm install && npm run dev` → http://localhost:3000
- Build: `npm run build`; Start: `npm start`.

Use the UI
- Modes: Explore (default), Story (stub chapters), What‑If (environment controls), Analyst (exports).
- Layers: Paleolithic, Holocene/Ancient, Early‑Modern/Modern.
- Timeline: symlog slider with epoch chips (MIS 5, LGM, Early Holocene, Neolithic, Classical, 1500–1900, 1900–2025).
- Search + Bookmark: keyword filter and permalink via URL.
- Exports: CSV/GeoJSON for the current filtered/active routes.


What This Is
- Scope: macro‑scale human migrations since the emergence of Homo sapiens. Earliest phases emphasize dispersal ranges and corridors, not precise paths. Post‑1500 routes include large historical and contemporary movements with official statistics where available.
- Time range: 500,000 BCE to 2025 CE. Years before 0 are treated as negative (e.g., −50,000 = 50,000 BCE).
- Visual encoding: color encodes era, line thickness encodes relative magnitude (1–5), and transparency encodes dating confidence (low/medium/high).
- Sources: each route lists its supporting references (peer‑reviewed literature, official statistics, or established databases). See the Sources panel in the app and `migrations.js`.


How It Works
- Frontend: Next.js App Router + React 18 + TypeScript.
- Globe: Globe.gl with GPU‑instanced arc particles; uncertainty encoded via alpha and jitter.
- Timeline: symlog slider mapping `0..1000 → −500k..2025`, epoch chips; adaptive step.
- Data: loads `public/data/dataset.json`; fallbacks only for local dev.
- Environment: LGM ice mask overlay (mock) via `public/data/env/ice_lgm.geojson`; sea‑level slider modulates overlay emphasis.


Data Model
Data lives in `public/data/dataset.json`:

- `sources`: dictionary of citations keyed by id { label, url }.
- `routes`: array of routes with fields:
  - `id`, `name`, `category` ("Paleolithic"|"Holocene/Ancient"|"EarlyModern/Modern"),
  - `start`, `end` (years; BCE negative),
  - `magnitude` (1–5), `confidence` ("low"|"medium"|"high"),
  - `waypoints` [[lat, lon], ...], `sources` [keys], `description`.

See the included `public/data/dataset.json` for a complete example.


Methodology & Caveats
- Synthesis: deep‑time routes summarize consensus corridors and ranges from archaeology, paleoanthropology, and genetics; modern routes leverage official statistics (UN DESA, IOM) and well‑maintained databases (e.g., SlaveVoyages).
- Uncertainty: dates and paths are uncertain in the Paleolithic; lines are schematic and scaled for narrative clarity. Confidence levels are provided and encoded visually.
- Magnitude: the `magnitude` field is a relative, visual weight—not a direct headcount. When robust counts exist (e.g., slave trade, modern corridors), they are described in the route text and sources.
- Calendars: BCE is negative; CE is positive. Labels display “BCE/CE”.


Architecture
- `app/*`: App Router pages, layout, route handlers (`/api/borders`).
- `components/*`: Globe view, timeline, mode bar.
- `lib/*`: symlog mapping, data client, mocked data (dev only).
- `public/data/*`: dataset and environment overlays.
- `src/types/sim.ts`: data model interfaces.


Contributing Data
1) Add or refine sources in `SOURCES` with a clear `label` and `url`.
2) Add a route in `ROUTES` with:
   - Schematic `waypoints` in `[lat, lon]` degrees (keep to several points to avoid visual clutter)
   - A balanced `magnitude` across the dataset (1=minor, 5=very large)
   - Honest `confidence` and a concise `description` summarizing assumptions
   - At least one reputable citation in `sources`
3) Test locally, scrub for typos, and ensure the new route renders and filters properly.

Optionally provide quantitative data
- The app can also consume same‑origin external files under `assets/` for quantitative, time‑binned flows and node populations. See `docs/data-spec.md` for the JSON schemas (`nodes.json`, `flows.json`, and optional `config.json`). If present, these will drive the moving‑dots visualization instead of the built‑in `ROUTES`.


Roadmap (Implementation Plan)
Phase 1 — Core experience (done/partial)
- Next.js app with globe, symlog timeline + chips, modes scaffold
- Dataset load + CSV/GeoJSON export; search; bookmarking

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

Deployment
- Deploy the repository root as a Next.js app (Vercel recommended). No legacy static app remains.
- Environment overlay lives at `public/data/env/ice_lgm.geojson`.

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
- Data & Sources
- External data schema: see `docs/data-spec.md` for `assets/nodes.json`, `assets/flows.json`, and `assets/config.json`.
- Source mapping and methodology: see `docs/data-sources.md` for references (paleoanthropology, Holocene dispersals, slave trade, modern corridors, refugees), assumptions, and how totals were chosen.
- Built-in citations: `migrations.js` contains `SOURCES` used by both the app and the dataset (when ids match). Additions welcome via PR.
