# Opsra — Framer site (self-hosted)

Static export of the Opsra site with three deployable variants.

## Folders
- `/` (root) — original Framer static export (self-contained: local `assets/`, `fonts/`, `images/`, `js/`).
- `_opsra/` — clean mirror of https://opsra.framer.website (loads assets from Framer CDN). **Recommended deploy.**
- `_current/` — mirror of https://multiple-item-573479.framer.app.

## Pages
`index.html`, `contact-us.html`, `privacy-policy.html`

## Deploy
Netlify: point the publish directory to `_opsra` (includes `_redirects` for clean URLs).

## Run locally
```bash
python -m http.server 8123 --directory _opsra
```
