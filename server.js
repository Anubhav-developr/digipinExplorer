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
  try {
    const apiKey = process.env.ORS_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error:
          "Routing is not configured yet. Add ORS_API_KEY to your Render backend environment variables, then redeploy.",
      });
    }
    const fromDigipin = String(req.body.fromDigipin || "")
      .trim()
      .toUpperCase();
    const toDigipin = String(req.body.toDigipin || "")
      .trim()
      .toUpperCase();
    const preference =
      req.body.preference === "fastest" ? "fastest" : "shortest";
    const source = getLatLngFromDigiPin(fromDigipin);
    const destination = getLatLngFromDigiPin(toDigipin);
   
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 15000);

let upstream;

try {
  upstream = await fetch(
    "https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson",
    {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
        Accept: "application/geo+json, application/json",
      },
      body: JSON.stringify({
        coordinates: [
          [Number(source.longitude), Number(source.latitude)],
          [Number(destination.longitude), Number(destination.latitude)],
        ],
        preference,
        instructions: false,
        units: "m",
      }),
      signal: controller.signal,
    },
  );
} catch (error) {
  if (error.name === "AbortError") {
    return res.status(504).json({
      error:
        "Routing provider timed out after 15 seconds. Please try again shortly.",
    });
  }

  console.error("Routing network error:", error.message);

  return res.status(502).json({
    error: "Unable to connect to the routing provider. Please try again.",
  });
} finally {
  clearTimeout(timeoutId);
}

    const responseText = await upstream.text();

    let data = {};
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { rawResponse: responseText };
    }

    console.log("ORS HTTP status:", upstream.status);
    console.log("ORS response:", JSON.stringify(data));

    if (!upstream.ok) {
      const detail =
        data?.error?.message ||
        data?.error?.details ||
        (typeof data?.error === "string" ? data.error : null) ||
        data?.message ||
        data?.rawResponse ||
        "No detailed error returned by routing provider.";

      return res.status(502).json({
        error: `Route service error: ${detail}`,
        providerStatus: upstream.status,
      });
    }
    const feature = data?.features?.[0];
    const summary = feature?.properties?.summary;
    if (!feature?.geometry || !summary)
      return res.status(502).json({
        error:
          "The routing provider returned no road route for these locations.",
      });
    res.json({
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
      geometry: feature.geometry,
      summary: {
        distance: Number(summary.distance),
        duration: Number(summary.duration),
      },
      preference,
    });
  } catch (error) {
    res.status(400).json({
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
