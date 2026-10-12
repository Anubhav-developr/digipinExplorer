import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from "lucide-react";

const GRID = [
  ['F', 'C', '9', '8'],
  ['J', '3', '2', '7'],
  ['K', '4', '5', '6'],
  ['L', 'M', 'P', 'T'],
];

function getCellBounds(pin) {
  const code = String(pin || '').trim().toUpperCase();
  if (!/^[23456789CJKLMPFT]{10}$/.test(code)) return null;
  let minLat = 2.5, maxLat = 38.5, minLon = 63.5, maxLon = 99.5;
  for (const character of code) {
    let row = -1, col = -1;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (GRID[r][c] === character) { row = r; col = c; break; }
      }
      if (row !== -1) break;
    }
    if (row === -1) return null;
    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;
    const nextMinLat = maxLat - latDiv * (row + 1);
    const nextMaxLat = maxLat - latDiv * row;
    const nextMinLon = minLon + lonDiv * col;
    const nextMaxLon = minLon + lonDiv * (col + 1);
    minLat = nextMinLat; maxLat = nextMaxLat; minLon = nextMinLon; maxLon = nextMaxLon;
  }
  return [[minLat, minLon], [minLat, maxLon], [maxLat, maxLon], [maxLat, minLon]];
}

function pinIcon(label, kind = 'main') {
  const className = kind === 'source' ? 'digipin-map-pin digipin-map-pin-source' : kind === 'destination' ? 'digipin-map-pin digipin-map-pin-destination' : 'digipin-map-pin';
  return L.divIcon({ className: 'digipin-map-icon-shell', html: `<span class="${className}"><i>${label}</i></span>`, iconSize: [30, 36], iconAnchor: [15, 30], popupAnchor: [0, -28] });
}

export default function MapExplorer({ t, apiBase, point, pin, language }) {
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const displayLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const [fromPin, setFromPin] = useState('');
  const [toPin, setToPin] = useState('');
  const [preference, setPreference] = useState('shortest');
  const [route, setRoute] = useState(null);
  const [routeBusy, setRouteBusy] = useState(false);
  const [routeError, setRouteError] = useState('');

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return undefined;
    const map = L.map(mapNodeRef.current, { zoomControl: true, scrollWheelZoom: true }).setView([22.9734, 78.6569], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
    }).addTo(map);
    mapRef.current = map;
    const resize = () => map.invalidateSize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (displayLayerRef.current) displayLayerRef.current.remove();
    if (routeLayerRef.current) routeLayerRef.current.remove();
    const layers = [];
    const bounds = [];

    if (point && Number.isFinite(Number(point.latitude)) && Number.isFinite(Number(point.longitude))) {
      const lat = Number(point.latitude), lon = Number(point.longitude);
      const marker = L.marker([lat, lon], { icon: pinIcon('D') }).bindPopup(`<strong>${t('DIGIPIN location')}</strong><br>${escapeHtml(pin || t('Coordinates only'))}<br>${lat.toFixed(6)}, ${lon.toFixed(6)}`);
      layers.push(marker);
      bounds.push([lat, lon]);
      const polygonCoords = getCellBounds(pin);
      if (polygonCoords) {
        const polygon = L.polygon(polygonCoords, { color: '#b77939', weight: 2, fillColor: '#e7b15d', fillOpacity: 0.25 }).bindPopup(`${t('DIGIPIN cell')}: ${escapeHtml(pin)}`);
        layers.push(polygon);
        bounds.push(...polygonCoords);
      }
    }

    if (route?.source && route?.destination && route?.geometry) {
      const source = [Number(route.source.latitude), Number(route.source.longitude)];
      const destination = [Number(route.destination.latitude), Number(route.destination.longitude)];
      const sourceMarker = L.marker(source, { icon: pinIcon('A', 'source') }).bindPopup(`<strong>${t('Route origin')}</strong><br>${escapeHtml(route.fromDigipin)}`);
      const destinationMarker = L.marker(destination, { icon: pinIcon('B', 'destination') }).bindPopup(`<strong>${t('Route destination')}</strong><br>${escapeHtml(route.toDigipin)}`);
      layers.push(sourceMarker, destinationMarker);
      bounds.push(source, destination);
      routeLayerRef.current = L.geoJSON(route.geometry, { style: { color: '#1769aa', weight: 5, opacity: 0.9, lineCap: 'round', lineJoin: 'round' } }).addTo(map);
      const routeBounds = routeLayerRef.current.getBounds();
      if (routeBounds.isValid()) map.fitBounds(routeBounds, { padding: [32, 32], maxZoom: 15 });
    }

    displayLayerRef.current = L.featureGroup(layers).addTo(map);
    if (bounds.length && !route) map.fitBounds(L.latLngBounds(bounds), { padding: [28, 28], maxZoom: 16 });
    else if (!route && !bounds.length) map.setView([22.9734, 78.6569], 5);
  }, [point?.latitude, point?.longitude, pin, route, t]);

  async function findRoute(event) {
    event.preventDefault();
    setRouteError(''); setRoute(null);
    if (fromPin.trim().length !== 10 || toPin.trim().length !== 10) {
      setRouteError(t('Enter two valid 10-character DIGIPINs.'));
      return;
    }
    setRouteBusy(true);
    try {
      const response = await fetch(`${apiBase}/api/route`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromDigipin: fromPin.trim().toUpperCase(), toDigipin: toPin.trim().toUpperCase(), preference }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || t('Could not calculate this route. Please try again.'));
      setRoute(data);
    } catch (error) {
      setRouteError(error.message || t('Could not calculate this route. Please try again.'));
    } finally { setRouteBusy(false); }
  }

  return <section className="map-explorer-section" id="map-explorer">
    <div className="section-heading map-section-heading"><div><div className="eyebrow">{t('EXPLORE THE MAP')}</div><h2>{t('Map your DIGIPIN')}</h2><p>{t('See a DIGIPIN cell on the map and plan a road route between two digital addresses.')}</p></div><div className="map-attribution-note"><span className="map-live-dot" /> {t('Interactive map')}</div></div>
    <div className="map-layout">
      <div className="map-canvas-wrap"><div ref={mapNodeRef} className="digipin-map-canvas" role="application" aria-label={t('Interactive DIGIPIN map')} /><div className="map-legend"><span><i className="legend-cell" /> {t('DIGIPIN cell')}</span><span><i className="legend-route" /> {t('Road route')}</span></div></div>
      <div className="route-panel">
        <div className="route-panel-top"><div className="route-icon"><span>A</span><i></i><span>B</span></div><div><div className="eyebrow">{t('DIGIPIN ROUTE PLANNER')}</div><h3>{t('Find a road route')}</h3></div></div>
        <p className="route-panel-copy">{t('Enter the starting and destination DIGIPIN. We will decode both and draw a route on the map.')}</p>
        <form className="route-form" onSubmit={findRoute}>
          <label>{t('Starting DIGIPIN')}<input value={fromPin} onChange={e => setFromPin(e.target.value.toUpperCase().replace(/[^23456789CJKLMPFT]/g, '').slice(0, 10))} placeholder="e.g. 4T396F42L7" maxLength={10} required /></label>
          <label>{t('Destination DIGIPIN')}<input value={toPin} onChange={e => setToPin(e.target.value.toUpperCase().replace(/[^23456789CJKLMPFT]/g, '').slice(0, 10))} placeholder="e.g. 4T396F42L7" maxLength={10} required /></label>
          <label>{t('Route preference')}<select value={preference} onChange={e => setPreference(e.target.value)}><option value="shortest">{t('Shortest distance')}</option><option value="fastest">{t('Fastest route')}</option></select></label>
          {routeError && <div className="error-message route-error" role="alert">{routeError}</div>}
          <button className="button button-submit route-submit" type="submit" disabled={routeBusy}>{routeBusy ? t('Calculating route…') : t('Show route on map')} <MapPin size={16}/></button>
        </form>
        {route && <div className="route-summary"><div className="route-summary-heading"><Check size={15}/>{t('Route found')}</div><div className="route-stats"><div><strong>{(route.summary.distance / 1000).toFixed(1)} km</strong><small>{t('Road distance')}</small></div><div><strong>{formatDuration(route.summary.duration, language)}</strong><small>{t('Estimated drive time')}</small></div></div><a href={`https://www.google.com/maps/dir/?api=1&origin=${route.source.latitude},${route.source.longitude}&destination=${route.destination.latitude},${route.destination.longitude}&travelmode=driving`} target="_blank" rel="noreferrer" className="map-link"><span>{t('Open navigation in Google Maps')}</span></a><p className="route-disclaimer">{t('Route estimates depend on available road data and may differ from live traffic navigation.')}</p></div>}
        <div className="route-key-note"><strong>{t('Routing service')}</strong><span>{t('OpenRouteService · shortest / fastest road routing')}</span></div>
      </div>
    </div>
    <p className="map-footnote">{t('The marker shows the DIGIPIN cell centre, not necessarily a building entrance. Map tiles © OpenStreetMap contributors.')}</p>
  </section>;
}

function formatDuration(seconds, language) {
  const minutes = Math.max(1, Math.round(Number(seconds || 0) / 60));
  const hours = Math.floor(minutes / 60), remaining = minutes % 60;
  if (language === 'hi') return hours ? `${hours} घं ${remaining} मि` : `${minutes} मिनट`;
  if (language === 'mr') return hours ? `${hours} ता ${remaining} मि` : `${minutes} मिनिटे`;
  if (language === 'ta') return hours ? `${hours} ம. ${remaining} நி.` : `${minutes} நிமிடங்கள்`;
  if (language === 'te') return hours ? `${hours} గం ${remaining} ని` : `${minutes} నిమిషాలు`;
  return hours ? `${hours} hr ${remaining} min` : `${minutes} min`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
