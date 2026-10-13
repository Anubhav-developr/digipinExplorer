const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
console.log("ORS key loaded:", Boolean(process.env.ORS_API_KEY));
const { getDigiPin, getLatLngFromDigiPin } = require("./src/digipin-core");
const app = express();
const corsOptions = {
  origin: ["https://digipinexplorer.vercel.app"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.post("/api/digipin/encode", (req, res) => {
  try {
    const latitude = Number(req.body.latitude),
      longitude = Number(req.body.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude))
      throw new Error("Enter valid latitude and longitude.");
    res.json({ digipin: getDigiPin(latitude, longitude) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
app.post("/api/digipin/decode", (req, res) => {
  try {
    res.json(getLatLngFromDigiPin(String(req.body.digipin || "")));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post("/api/route", async (req, res) => {
  const fromDigipin = String(req.body.fromDigipin || "")
    .trim()
    .toUpperCase();

  const toDigipin = String(req.body.toDigipin || "")
    .trim()
    .toUpperCase();

  const preference = req.body.preference === "fastest" ? "fastest" : "shortest";

  try {
    const source = getLatLngFromDigiPin(fromDigipin);
    const destination = getLatLngFromDigiPin(toDigipin);

    const coordinates = [
      [Number(source.longitude), Number(source.latitude)],
      [Number(destination.longitude), Number(destination.latitude)],
    ];

    if (!coordinates.flat().every(Number.isFinite)) {
      return res.status(400).json({
        error: "Invalid coordinates decoded from DIGIPIN.",
      });
    }

    // Limit each provider request so the user does not wait indefinitely.
    async function fetchJsonWithTimeout(url, options, timeoutMs) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text.slice(0, 300) };
        }

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: ${
              data?.error?.message || data?.message || "Provider request failed"
            }`,
          );
        }

        return data;
      } finally {
        clearTimeout(timer);
      }
    }

    function sendRoute(geometry, distance, duration, provider) {
      return res.json({
        fromDigipin,
        toDigipin,
        source: {
          latitude: Number(source.latitude),
          longitude: Number(source.longitude),
        },
        destination: {
          latitude: Number(destination.latitude),
          longitude: Number(destination.longitude),
        },
        geometry,
        summary: {
          distance: Number(distance),
          duration: Number(duration),
        },
        preference,
        provider,
      });
    }

    // 1. Try OpenRouteService first.
    const apiKey = process.env.ORS_API_KEY;

    if (apiKey) {
      try {
        const data = await fetchJsonWithTimeout(
          "https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson",
          {
            method: "POST",
            headers: {
              Authorization: apiKey,
              "Content-Type": "application/json",
              Accept: "application/geo+json, application/json",
            },
            body: JSON.stringify({
              coordinates,
              preference,
              instructions: false,
              units: "m",
            }),
          },
          8000,
        );

        const feature = data?.features?.[0];
        const summary = feature?.properties?.summary;

        if (
          feature?.geometry &&
          Number.isFinite(Number(summary?.distance)) &&
          Number.isFinite(Number(summary?.duration))
        ) {
          console.log("Route provider: OpenRouteService");

          return sendRoute(
            feature.geometry,
            summary.distance,
            summary.duration,
            "OpenRouteService",
          );
        }

        throw new Error("OpenRouteService returned no usable route.");
      } catch (error) {
        console.warn("OpenRouteService failed:", error.message);
      }
    } else {
      console.warn("ORS_API_KEY is missing; trying OSRM fallback.");
    }

    // 2. Fallback: OSRM public demo routing service.
    try {
      const osrmUrl =
        "https://router.project-osrm.org/route/v1/driving/" +
        coordinates
          .map(([longitude, latitude]) => `${longitude},${latitude}`)
          .join(";") +
        "?overview=full&geometries=geojson&steps=false";

      const data = await fetchJsonWithTimeout(
        osrmUrl,
        { method: "GET" },
        10000,
      );

      const route = data?.routes?.[0];

      if (
        data?.code !== "Ok" ||
        !route?.geometry ||
        !Number.isFinite(Number(route.distance)) ||
        !Number.isFinite(Number(route.duration))
      ) {
        throw new Error(data?.message || "OSRM returned no road route.");
      }

      console.log("Route provider: OSRM fallback");

      return sendRoute(route.geometry, route.distance, route.duration, "OSRM");
    } catch (error) {
      console.error("OSRM fallback failed:", error.message);

      return res.status(502).json({
        error:
          "Both routing services are unavailable right now. Please try again later.",
        details: error.message,
      });
    }
  } catch (error) {
    console.error("Route request error:", error.message);

    return res.status(400).json({
      error: error.message || "Unable to calculate a route for these DIGIPINs.",
    });
  }
});


app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "DIGIPIN Explorer" }),
);
app.get("/{*splat}", (_req, res) =>
  res.sendFile(path.join(__dirname, "dist", "index.html")),
);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`DIGIPIN Explorer running on http://localhost:${PORT}`),
);
