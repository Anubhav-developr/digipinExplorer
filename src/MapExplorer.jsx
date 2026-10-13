import React, { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import { Check, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./MapExplorer.interaction.css";

const GRID = [
  ["F", "C", "9", "8"],
  ["J", "3", "2", "7"],
  ["K", "4", "5", "6"],
  ["L", "M", "P", "T"],
];

const DEFAULT_VIEW = [22.9734, 78.6569];
const DEFAULT_ZOOM = 5;
const LOCATION_MAX_ZOOM = 19;

// Reconstruct the exact DIGIPIN cell from the official 4x4 hierarchical grid.
function getCellBounds(pin) {
  const code = String(pin || "")
    .trim()
    .toUpperCase();
  if (!/^[23456789CJKLMPFT]{10}$/.test(code)) return null;

  let minLat = 2.5;
  let maxLat = 38.5;
  let minLon = 63.5;
  let maxLon = 99.5;

  for (const character of code) {
    let row = -1;
    let col = -1;

    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        if (GRID[r][c] === character) {
          row = r;
          col = c;
          break;
        }
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

    minLat = nextMinLat;
    maxLat = nextMaxLat;
    minLon = nextMinLon;
    maxLon = nextMaxLon;
  }

  // Leaflet expects [latitude, longitude] pairs.
  return [
    [minLat, minLon],
    [minLat, maxLon],
    [maxLat, maxLon],
    [maxLat, minLon],
  ];
}

function pinIcon(label, kind = "main") {
  const className =
    kind === "source"
      ? "digipin-map-pin digipin-map-pin-source"
      : kind === "destination"
        ? "digipin-map-pin digipin-map-pin-destination"
        : "digipin-map-pin";

  return L.divIcon({
    className: "digipin-map-icon-shell",
    html: `<span class="${className}"><i>${label}</i></span>`,
    iconSize: [34, 42],
    iconAnchor: [17, 34],
    popupAnchor: [0, -31],
  });
}

function isValidCoordinatePair(point) {
  if (!point) return false;
  const latitude = Number(point.latitude);
  const longitude = Number(point.longitude);
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

function focusSelection(map, point, pin) {
  if (!isValidCoordinatePair(point)) {
    map.setView(DEFAULT_VIEW, DEFAULT_ZOOM, { animate: true, duration: 0.6 });
    return;
  }

  const target = [Number(point.latitude), Number(point.longitude)];
  const cellBounds = getCellBounds(pin);

  if (cellBounds) {
    map.flyToBounds(L.latLngBounds(cellBounds), {
      paddingTopLeft: [72, 72],
      paddingBottomRight: [72, 72],
      maxZoom: LOCATION_MAX_ZOOM,
      animate: true,
      duration: 1.05,
    });
    return;
  }

  map.flyTo(target, Math.min(LOCATION_MAX_ZOOM, Math.max(map.getZoom(), 16)), {
    animate: true,
    duration: 1.05,
  });
}

async function copyPopupText(value, button, translate) {
  try {
    await navigator.clipboard.writeText(value);
    button.textContent = translate("Copied!");
  } catch {
    // Clipboard APIs can be unavailable in some browser contexts.
    window.prompt(translate("Copy manually"), value);
  }
}

function createLocationPopup({ code, latitude, longitude, translate }) {
  const container = L.DomUtil.create("div", "digipin-popup");

  const title = L.DomUtil.create("div", "digipin-popup-title", container);
  title.textContent = translate("DIGIPIN location");

  const codeLabel = L.DomUtil.create("div", "digipin-popup-code", container);
  codeLabel.textContent = code || translate("Coordinates only");

  const coordinates = L.DomUtil.create(
    "div",
    "digipin-popup-coordinates",
    container,
  );
  coordinates.textContent = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

  const actions = L.DomUtil.create("div", "digipin-popup-actions", container);

  if (code) {
    const copyPin = L.DomUtil.create(
      "button",
      "digipin-popup-button digipin-popup-button-primary",
      actions,
    );
    copyPin.type = "button";
    copyPin.textContent = translate("Copy DIGIPIN");
    copyPin.addEventListener("click", (event) => {
      L.DomEvent.stop(event);
      void copyPopupText(code, copyPin, translate);
    });
  }

  const copyCoordinates = L.DomUtil.create(
    "button",
    "digipin-popup-button",
    actions,
  );
  copyCoordinates.type = "button";
  copyCoordinates.textContent = translate("Copy coordinates");
  copyCoordinates.addEventListener("click", (event) => {
    L.DomEvent.stop(event);
    void copyPopupText(
      `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      copyCoordinates,
      translate,
    );
  });

  const googleMaps = L.DomUtil.create(
    "a",
    "digipin-popup-button digipin-popup-link",
    actions,
  );
  googleMaps.href = `https://www.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}`;
  googleMaps.target = "_blank";
  googleMaps.rel = "noopener noreferrer";
  googleMaps.textContent = translate("Open in Google Maps");

  L.DomEvent.disableClickPropagation(container);
  L.DomEvent.disableScrollPropagation(container);
  return container;
}

function createCellPopup({ code, translate }) {
  const container = L.DomUtil.create("div", "digipin-popup");
  const title = L.DomUtil.create("div", "digipin-popup-title", container);
  title.textContent = translate("DIGIPIN cell");
  const codeLabel = L.DomUtil.create("div", "digipin-popup-code", container);
  codeLabel.textContent = code;
  const note = L.DomUtil.create("p", "digipin-popup-note", container);
  note.textContent = translate(
    "Highlighted outline represents this DIGIPIN grid cell.",
  );
  return container;
}

export default function MapExplorer({ t, apiBase, point, pin, language }) {
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const displayLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const lastLocationKeyRef = useRef(null);
  const routeRequestIdRef = useRef(0);
  const translateRef = useRef(t);
  translateRef.current = t;

  const [fromPin, setFromPin] = useState("");
  const [toPin, setToPin] = useState("");
  const [preference, setPreference] = useState("shortest");
  const [route, setRoute] = useState(null);
  const [routeMode, setRouteMode] = useState(false);
  const [routeBusy, setRouteBusy] = useState(false);
  const [routeError, setRouteError] = useState("");

  // Initialise Leaflet once; the map's selected location is updated by a separate effect.
  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return undefined;

    const map = L.map(mapNodeRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      preferCanvas: true,
    }).setView(DEFAULT_VIEW, DEFAULT_ZOOM);

    const streetLayer = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
      },
    );

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
        attribution:
          "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
      },
    );

    // Street Map default rahega.
    streetLayer.addTo(map);

    // Top-right mein Street / Satellite selector.
    L.control
      .layers(
        {
          "Street Map": streetLayer,
          "Satellite (Esri)": satelliteLayer,
        },
        undefined,
        { position: "topright", collapsed: false },
      )
      .addTo(map);

    mapRef.current = map;
    const resize = () => map.invalidateSize();
    const resizeTimer = window.setTimeout(resize, 120);
    window.addEventListener("resize", resize);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", resize);
      map.remove();
      mapRef.current = null;
      displayLayerRef.current = null;
      routeLayerRef.current = null;
    };
  }, []);

  // Single-location mode and route mode are mutually exclusive. When a route is
  // requested, hide the currently selected DIGIPIN so it cannot look like a
  // route endpoint or steal the map focus.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (displayLayerRef.current) {
      displayLayerRef.current.remove();
      displayLayerRef.current = null;
    }

    const validPoint = isValidCoordinatePair(point);
    const latitude = validPoint ? Number(point.latitude) : null;
    const longitude = validPoint ? Number(point.longitude) : null;
    const code = String(pin || "")
      .trim()
      .toUpperCase();
    const nextLocationKey = validPoint
      ? `${latitude}|${longitude}|${code}`
      : "";
    const previousLocationKey = lastLocationKeyRef.current;
    const locationChanged =
      previousLocationKey !== null && previousLocationKey !== nextLocationKey;
    lastLocationKeyRef.current = nextLocationKey;

    if (locationChanged) {
      // Invalidate any route request that was started for an older selection.
      routeRequestIdRef.current += 1;
      setRouteError("");
      setRouteBusy(false);
      if (routeLayerRef.current) {
        routeLayerRef.current.remove();
        routeLayerRef.current = null;
      }
      if (route || routeMode) {
        setRoute(null);
        setRouteMode(false);
      }
    }

    // Route mode takes priority over the single-location marker/cell.
    if (routeMode) return;

    const layers = [];

    if (validPoint) {
      const marker = L.marker([latitude, longitude], {
        icon: pinIcon("D"),
        riseOnHover: true,
        keyboard: true,
        title: code ? `DIGIPIN ${code}` : t("DIGIPIN location"),
      });

      marker.bindPopup(
        () =>
          createLocationPopup({
            code: /^[23456789CJKLMPFT]{10}$/.test(code) ? code : "",
            latitude,
            longitude,
            translate: (key) => translateRef.current(key),
          }),
        { maxWidth: 280, autoPanPadding: [24, 24] },
      );
      layers.push(marker);

      const polygonCoords = getCellBounds(code);
      if (polygonCoords) {
        const cellPolygon = L.polygon(polygonCoords, {
          color: "#a76424",
          weight: 3,
          opacity: 1,
          dashArray: "5 3",
          lineJoin: "round",
          fillColor: "#f2b84c",
          fillOpacity: 0.38,
          interactive: true,
        });
        cellPolygon.bindPopup(
          () =>
            createCellPopup({
              code,
              translate: (key) => translateRef.current(key),
            }),
          { maxWidth: 250, autoPanPadding: [24, 24] },
        );
        cellPolygon.bindTooltip(`${t("DIGIPIN cell")}: ${code}`, {
          sticky: true,
          direction: "top",
        });
        layers.push(cellPolygon);
      }
    }

    displayLayerRef.current = L.featureGroup(layers).addTo(map);
    focusSelection(map, point, code);
  }, [point?.latitude, point?.longitude, pin, language, routeMode, route]);

  // Draw ONLY the requested A-to-B road route in route mode. The map bounds are
  // calculated from the route geometry and the two route endpoints, never from
  // the unrelated DIGIPIN currently shown in the generator panel.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    if (!routeMode) {
      focusSelection(map, point, pin);
      return;
    }

    // While the route API request is in progress, keep the map in route mode
    // and do not jump back to the last generated location.
    if (!route?.source || !route?.destination || !route?.geometry) return;

    const source = [
      Number(route.source.latitude),
      Number(route.source.longitude),
    ];
    const destination = [
      Number(route.destination.latitude),
      Number(route.destination.longitude),
    ];

    const sourceMarker = L.marker(source, {
      icon: pinIcon("A", "source"),
      riseOnHover: true,
    }).bindPopup(
      `<strong>${t("Route origin")}</strong><br>${escapeHtml(route.fromDigipin)}`,
    );
    const destinationMarker = L.marker(destination, {
      icon: pinIcon("B", "destination"),
      riseOnHover: true,
    }).bindPopup(
      `<strong>${t("Route destination")}</strong><br>${escapeHtml(route.toDigipin)}`,
    );
    const roadLine = L.geoJSON(route.geometry, {
      style: {
        color: "#1769aa",
        weight: 5,
        opacity: 0.92,
        lineCap: "round",
        lineJoin: "round",
      },
    });

    routeLayerRef.current = L.featureGroup([
      roadLine,
      sourceMarker,
      destinationMarker,
    ]).addTo(map);
    const routeBounds = routeLayerRef.current.getBounds();
    if (routeBounds.isValid()) {
      map.flyToBounds(routeBounds, {
        padding: [48, 48],
        maxZoom: 16,
        animate: true,
        duration: 1,
      });
    }
  }, [route, routeMode, language, point?.latitude, point?.longitude, pin]);

  async function findRoute(event) {
    event.preventDefault();
    setRouteError("");

    const requestedFrom = fromPin.trim().toUpperCase();
    const requestedTo = toPin.trim().toUpperCase();
    if (
      !/^[23456789CJKLMPFT]{10}$/.test(requestedFrom) ||
      !/^[23456789CJKLMPFT]{10}$/.test(requestedTo)
    ) {
      setRoute(null);
      setRouteMode(false);
      setRouteError(t("Enter two valid 10-character DIGIPINs."));
      return;
    }
    if (requestedFrom === requestedTo) {
      setRoute(null);
      setRouteMode(false);
      setRouteError(t("Choose two different DIGIPINs for a route."));
      return;
    }

    const requestId = routeRequestIdRef.current + 1;
    routeRequestIdRef.current = requestId;
    setRoute(null);
    setRouteMode(true);
    setRouteBusy(true);

    try {
      const response = await fetch(`${apiBase}/api/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromDigipin: requestedFrom,
          toDigipin: requestedTo,
          preference,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          data.error || t("Could not calculate this route. Please try again."),
        );
      if (requestId !== routeRequestIdRef.current) return;

      // Guard against accidentally displaying a stale or mismatched API response.
      if (
        String(data.fromDigipin || "").toUpperCase() !== requestedFrom ||
        String(data.toDigipin || "").toUpperCase() !== requestedTo
      ) {
        throw new Error(
          t(
            "The route service returned a different origin or destination. Please try again.",
          ),
        );
      }
      if (
        !data.geometry ||
        !data.source ||
        !data.destination ||
        !data.summary
      ) {
        throw new Error(
          t(
            "The route service returned incomplete route details. Please try again.",
          ),
        );
      }
      setRoute(data);
    } catch (error) {
      if (requestId !== routeRequestIdRef.current) return;
      setRoute(null);
      setRouteMode(false);
      setRouteError(
        error.message || t("Could not calculate this route. Please try again."),
      );
    } finally {
      if (requestId === routeRequestIdRef.current) setRouteBusy(false);
    }
  }

  return (
    <section className="map-explorer-section" id="map-explorer">
      <div className="section-heading map-section-heading">
        <div>
          <div className="eyebrow">{t("EXPLORE THE MAP")}</div>
          <h2>{t("Map your DIGIPIN")}</h2>
          <p>
            {t(
              "See a DIGIPIN cell on the map and plan a road route between two digital addresses.",
            )}
          </p>
        </div>
        <div className="map-attribution-note">
          <span className="map-live-dot" /> {t("Interactive map")}
        </div>
      </div>

      <div className="map-layout">
        <div className="map-canvas-wrap">
          <div
            ref={mapNodeRef}
            className="digipin-map-canvas"
            role="application"
            aria-label={t("Interactive DIGIPIN map")}
          />
          <div className="map-legend">
            <span>
              <i className="legend-cell" /> {t("DIGIPIN cell")}
            </span>
            <span>
              <i className="legend-location" /> {t("Selected location")}
            </span>
            <span>
              <i className="legend-route" /> {t("Road route")}
            </span>
          </div>
        </div>

        <div className="route-panel">
          <div className="route-panel-top">
            <div className="route-icon">
              <span>A</span>
              <i></i>
              <span>B</span>
            </div>
            <div>
              <div className="eyebrow">{t("DIGIPIN ROUTE PLANNER")}</div>
              <h3>{t("Find a road route")}</h3>
            </div>
          </div>
          <p className="route-panel-copy">
            {t(
              "Enter the starting and destination DIGIPIN. We will decode both and draw a route on the map.",
            )}
          </p>

          <form className="route-form" onSubmit={findRoute}>
            <label>
              {t("Starting DIGIPIN")}
              <input
                value={fromPin}
                onChange={(event) =>
                  setFromPin(
                    event.target.value
                      .toUpperCase()
                      .replace(/[^23456789CJKLMPFT]/g, "")
                      .slice(0, 10),
                  )
                }
                placeholder="e.g. 4T396F42L7"
                maxLength={10}
                required
              />
            </label>
            <label>
              {t("Destination DIGIPIN")}
              <input
                value={toPin}
                onChange={(event) =>
                  setToPin(
                    event.target.value
                      .toUpperCase()
                      .replace(/[^23456789CJKLMPFT]/g, "")
                      .slice(0, 10),
                  )
                }
                placeholder="e.g. 4T396F42L7"
                maxLength={10}
                required
              />
            </label>
            <label>
              {t("Route preference")}
              <select
                value={preference}
                onChange={(event) => setPreference(event.target.value)}
              >
                <option value="shortest">{t("Shortest distance")}</option>
                <option value="fastest">{t("Fastest route")}</option>
              </select>
            </label>
            {routeError && (
              <div className="error-message route-error" role="alert">
                {routeError}
              </div>
            )}
            <button
              className="button button-submit route-submit"
              type="submit"
              disabled={routeBusy}
            >
              {routeBusy ? t("Calculating route…") : t("Show route on map")}{" "}
              <MapPin size={16} />
            </button>
          </form>

          {route && (
            <div className="route-summary">
              <div className="route-summary-heading">
                <Check size={15} />
                {t("Route found")}
              </div>
              <div className="route-endpoints">
                <div>
                  <small>{t("Route origin")}</small>
                  <strong>{route.fromDigipin}</strong>
                </div>
                <div>
                  <small>{t("Route destination")}</small>
                  <strong>{route.toDigipin}</strong>
                </div>
              </div>
              <div className="route-stats">
                <div>
                  <strong>
                    {(route.summary.distance / 1000).toFixed(1)} km
                  </strong>
                  <small>{t("Road distance")}</small>
                </div>
                <div>
                  <strong>
                    {formatDuration(route.summary.duration, language)}
                  </strong>
                  <small>{t("Estimated drive time")}</small>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${route.source.latitude},${route.source.longitude}&destination=${route.destination.latitude},${route.destination.longitude}&travelmode=driving`}
                target="_blank"
                rel="noreferrer"
                className="map-link"
              >
                <span>{t("Open navigation in Google Maps")}</span>
              </a>
              <p className="route-disclaimer">
                {t(
                  "Route estimates depend on available road data and may differ from live traffic navigation.",
                )}
              </p>
            </div>
          )}

          <div className="route-key-note">
            <strong>{t("Routing service")}</strong>
            <span>
              {t("OpenRouteService · shortest / fastest road routing")}
            </span>
          </div>
        </div>
      </div>
      <p className="map-footnote">
        {t(
          "The marker shows the DIGIPIN cell centre, not necessarily a building entrance. Street map © OpenStreetMap contributors; satellite imagery © Esri and its data providers.",
        )}
      </p>
    </section>
  );
}

function formatDuration(seconds, language) {
  const minutes = Math.max(1, Math.round(Number(seconds || 0) / 60));
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (language === "hi")
    return hours ? `${hours} घं ${remaining} मि` : `${minutes} मिनट`;
  if (language === "mr")
    return hours ? `${hours} ता ${remaining} मि` : `${minutes} मिनिटे`;
  if (language === "ta")
    return hours ? `${hours} ம. ${remaining} நி.` : `${minutes} நிமிடங்கள்`;
  if (language === "te")
    return hours ? `${hours} గం ${remaining} ని` : `${minutes} నిమిషాలు`;
  return hours ? `${hours} hr ${remaining} min` : `${minutes} min`;
}
