Data Sources and Methodology

Overview
- Purpose: Provide transparent references and methods behind the curated quantitative dataset under `assets/` and the embedded `migrations.js` routes. Counts are approximate and meant for visual storytelling; where high‑quality totals exist, we align to those and note uncertainty.
- Scope: Deep‑time dispersals; Holocene expansions; early‑modern and modern migrations; selected corridors and refugee flows.

Files and Semantics
- assets/nodes.json: Region/city nodes with coordinates and coarse population series (for clump sizing). Values are order‑of‑magnitude; use HYDE/WorldPop/official stats for refinement.
- assets/flows.json: Directed flows with polyline paths and time‑binned counts (people). Counts are totals for the bin [t0, t1). Visualization converts counts to moving dots via `packetScale`.
- assets/config.json: Visualization knobs (e.g., `packetScale` = people per dot).
- migrations.js: Built‑in schematic routes with citations (used when external assets are not present).

How Totals Were Chosen (Summary)
- Deep time (pre‑Holocene): Conservative founding magnitudes; emphasize sequencing more than totals. Confidence mostly medium/low. Example: Out‑of‑Africa main southern route set to ~300k across a broad window (−85–−55 ka) to avoid overstating certainty.
- Holocene expansions: Demic diffusion (e.g., Neolithic Anatolia→Europe) sized to low, order‑of‑magnitude totals over millennia.
- Early modern: Where robust totals exist (e.g., trans‑Atlantic slave trade), align to database totals and split by major destinations.
- Modern corridors: Use UN DESA bilateral stock and IOM corridor snapshots for relative magnitude and ballparks; specific country stats refine where applicable.

Key References (with usage)
Paleoanthropology and Archaeology
- Hublin et al. 2017 (Nature): Jebel Irhoud ~315±34 ka — emergence mosaic across Africa.
- Vidal et al. 2022 (Nature): Omo I ≥233 ka — East African early sapiens.
- Hershkovitz et al. 2018 (Science): Misliya (Israel) 177–194 ka — early Levant excursions.
- Bae, Douka & Petraglia 2017 (Science): Dispersals into Asia — consensus overview for routes/sequencing.
- Clarkson et al. 2017 (Nature): Australia (Madjedbebe) ~65 ka — arrival in Sahul.
- Hublin et al. 2020 & Hajdinjak et al. 2021 (Nature): IUP presence in Europe ~45 ka.
- Pigati et al. 2023 (Science) + USGS 2023: White Sands footprints 21–23 ka — Americas chronology.

Holocene, Ancient DNA and Language Dispersals
- Lazaridis et al. 2016 (Nature): Early farmers from Anatolia into Europe.
- Grollemund et al. 2015 (PNAS): Bantu expansion routes and timing.
- Pierron et al. 2014/2017 (PNAS): Madagascar Austronesian–Bantu admixture and genomics.
- Wilmshurst et al. 2011 (PNAS) + Univ. Hawai‘i: East Polynesia settlement AD 1190–1290.
- Haak et al. 2015 (Nature): Steppe (Yamnaya) ancestry into Europe.
- Narasimhan et al. 2019 (Science): Steppe ancestry dynamics in South Asia.

Early‑Modern and Modern Migrations
- Voyages: The Trans‑Atlantic Slave Trade Database (aggregate and destination splits).
- UN DESA International Migrant Stock 2020 (tables and corridor derivations).
- IOM World Migration Reports (2022, 2024) — corridor snapshots and syntheses.
- U.S. Census and summaries for the Great Migration (≈6M total; route splits approximated).
- UNHCR 2000 Partition of India report (≈14M displaced; bidirectional split approximated 7M/7M).
- Regional stats for corridors where possible (e.g., Eurostat/DESTATIS for Türkiye→Germany; INSEE/INE for Maghreb→EU; national sources for Ukraine 2022+ refugee distributions).

How We Map References
- Built‑in routes (migrations.js) include `sources` keyed to citation ids used in the app’s Sources panel.
- External flows (assets/flows.json) may include a `sources` array with the same ids (recommended) or external citations listed in this document until entries are added to `migrations.js`.

Assumptions and Caveats
- Visualization scale (packetScale) converts people counts to moving dots; dots represent illustrative packets, not individuals.
- Deep time routes are schematic; totals are conservative; emphasis is on geographic sequencing rather than headcounts.
- Colonial and modern corridor totals are rounded ballparks; where multiple sources disagree, we prefer UN DESA/IOM aggregates and note that bilateral flows vs. stock can differ.
- Node populations are coarse snapshots to drive clump sizes; replace with HYDE/WorldPop/official city stats for precision.

Improving Accuracy
- Submit PRs adding: (1) precise `sources` for any flow; (2) refined time bins/paths; (3) better node population series.
- If you have permissioned datasets, include a README in `assets/` noting licensing and provenance.

Licensing and Attribution
- Data you add must be licensed for redistribution. Provide links/citations.
- This project links to and summarizes published works and public datasets for fair scholarly use and visualization.

