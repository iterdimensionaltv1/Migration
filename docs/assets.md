Assets and External Data

Goal
- Avoid CORS issues and CDN drift by serving external datasets from the same origin.

Country borders (recommended)
- File: Natural Earth Admin 0 Countries (110m) in GeoJSON.
- Path in this repo: assets/ne_110m_admin_0_countries.geojson
 - Alternate: served dynamically via `/api/borders` (Vercel serverless function) to avoid CORS.

How to add
1) Download from a trusted mirror (example shown; verify license and content):
   - https://unpkg.com/three-globe@2.44.0/example/datasets/ne_110m_admin_0_countries.geojson
2) Place the file at assets/ne_110m_admin_0_countries.geojson
3) Redeploy. The app will prefer the same-origin asset, then same-origin API `/api/borders` as a fallback, eliminating CORS errors.

Notes
- In localhost development, the app falls back to the remote URL if the local file is missing. In production, it will not, to avoid CORS errors and console noise.
- If you want higher detail (50m), use the corresponding Natural Earth dataset but mind performance on low-end devices.
