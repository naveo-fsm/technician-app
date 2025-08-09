# Naveo FSM PWA

This is the deployable Progressive Web App (PWA) version of the Naveo Field Service Management system.

## Included Files

- `index.html` – PWA entry point and Service Worker registration
- `login.html` – Role-based login screen
- `technician.html` – Technician job viewer with notification and offline support
- `checklist.html` – Job checklist with signature and sync queue
- `planner.html` – Planner dashboard interface
- `dashboard.html` – Dashboard data visualization (KPI/analytics)
- `manifest.json` – PWA install metadata
- `sw.js` – Service Worker for offline caching

## Deploy Instructions

1. Upload to a GitHub repository
2. Enable GitHub Pages (Settings > Pages > Source: main / root)
3. Visit `https://<username>.github.io/<repo-name>/`

Ensure all integrations (SheetDB, Cloudinary) are configured with your own credentials.


# Naveo FSM – Technician/Planner (GitHub Pages)

Frontend for technicians & planners, backed by **NocoDB** and **Cloudinary**.

## Quick start

1. **Clone** this repo.
2. **Create `config.js`** from the example below (do **not** commit secrets):

```js
// config.js (DO NOT COMMIT)
window.NC_BASE   = "https://app.nocodb.com/api/v2";
window.NC_TOKEN  = "YOUR_NOCODB_BEARER_TOKEN";
window.CLOUD_NAME   = "dcnji9xvd";
window.CLOUD_PRESET = "gps_uploads";
