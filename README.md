# DIGIPIN Explorer (React + Vite + Express)

A responsive React website using the official open-source DIGIPIN encoder/decoder implementation from India Post's repository.

## Requirements
- Node.js 18+ recommended
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173. Vite serves the React app and proxies no requests; the Express API runs on port 5000. For easiest local setup in development, the frontend needs API proxying; see note below.

### Production
```bash
npm install
npm run build
npm start
```
Open http://localhost:5000.

## Notes
- API endpoints: POST `/api/digipin/encode` and POST `/api/digipin/decode`.
- Location permission works on localhost and HTTPS deployments.
- The official DIGIPIN implementation and license are retained from the India Post open-source project.
- This is an independent interface, not an official India Post website.
