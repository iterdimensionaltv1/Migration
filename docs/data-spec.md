Data Specification for Quantitative Population Flows (MVP)

Purpose
- Drive “clumps of people” that grow/shrink and move via external, source‑based data files. Keep them browser‑friendly and easy to update.

Overview
- nodes.json: list of origin/destination regions with coordinates and optional population time series.
- flows.json: list of directed flows between nodes (or along explicit paths) with time‑binned counts.
- config.json: optional visualization parameters (e.g., packetScale).

File: nodes.json
[
  {
    "id": "MEX",            // stable id (ISO3, region code, or custom)
    "name": "Mexico",
    "lat": 23.6,             // centroid latitude
    "lon": -102.5,           // centroid longitude
    "popSeries": [           // optional population (for clump sizing), coarse bins
      { "t": 1500, "pop": 2500000 },
      { "t": 1900, "pop": 13600000 },
      { "t": 2020, "pop": 128000000 }
    ]
  }
]

File: flows.json
[
  {
    "id": "mex_usa_total",
    "name": "Mexico → USA",
    "originId": "MEX",
    "destId": "USA",
    "path": [                 // great‑circle polyline, coarse is fine
      [19.4, -99.1],
      [34.05, -118.25]
    ],
    "series": [               // time‑binned counts (people) for the interval [t0, t1)
      { "t0": 1965, "t1": 1990, "count": 3000000 },
      { "t0": 1990, "t1": 2010, "count": 7000000 },
      { "t0": 2010, "t1": 2025, "count": 1000000 }
    ],
    "confidence": "high",     // optional; low/medium/high
    "sources": [               // optional list of citation keys
      "UNDESA_IMS2020", "IOM_WMR2024_Corridors"
    ]
  }
]

File: config.json (optional)
{
  "packetScale": 500000  // people per moving dot (lower = more dots)
}

How it renders
- For the current year, the engine picks any flow series where t0 ≤ year < t1 and creates approximately count / packetScale moving dots along the path. Dots repeat so that flows appear continuous.
- Node popSeries is optional; if present, it can size and pulse clumps at origins/destinations in a later iteration.

Recommendations
- Modern era: Use UN DESA, IOM, UNHCR, or government statistics; aggregate into multi‑year bins to keep file size small.
- Historical: Use reputable syntheses (e.g., SlaveVoyages for trans‑Atlantic trade) and state the uncertainty clearly.
- Deep time: Use schematic flows with very coarse counts (or leave counts blank) and emphasis on uncertainty.

Size and performance
- Keep flows.json under ~2–5 MB uncompressed if possible; use coarser bins and fewer path vertices.
- Use packetScale to control dot density; the app clamps to avoid pathologically large numbers of particles.

Licensing
- Ensure the data you provide is licensed for redistribution. Include citation keys that map to entries in `migrations.js` SOURCES or provide an additional sources file.

