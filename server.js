const express = require('express');
const path = require('path');
const cors = require('cors');
const { getDigiPin, getLatLngFromDigiPin } = require('./src/digipin-core');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.post('/api/digipin/encode', (req, res) => {
  try {
    const latitude = Number(req.body.latitude), longitude = Number(req.body.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error('Enter valid latitude and longitude.');
    res.json({ digipin: getDigiPin(latitude, longitude) });
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.post('/api/digipin/decode', (req, res) => {
  try { res.json(getLatLngFromDigiPin(String(req.body.digipin || ''))); }
  catch (e) { res.status(400).json({ error: e.message }); }
});
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'DIGIPIN Explorer' }));
app.get('/{*splat}', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`DIGIPIN Explorer running on http://localhost:${PORT}`));