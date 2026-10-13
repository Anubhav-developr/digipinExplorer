DIGIPIN MAP LOCATION + ROUTE PRIORITY PATCH

This patch updates only the map component and its interaction CSS. It does not replace main.jsx, style.css, backend files, environment files, or your technology section.

FILES
  src/MapExplorer.jsx
  src/MapExplorer.interaction.css

INSTALL
1. Back up your existing src/MapExplorer.jsx.
2. Extract this ZIP into the root of your existing React/Vite project (the folder containing package.json).
3. Allow src/MapExplorer.jsx to be overwritten. The CSS file is added alongside it.
4. No package changes are required; the project already declares leaflet and lucide-react.
5. Run npm run build.
6. If the build succeeds, commit and push the changes to GitHub so Vercel can redeploy.

WHAT CHANGES
- DIGIPIN encode/decode still shows and focuses the selected location and its highlighted grid cell.
- Route Planner mode is separate from single-location mode. Once a route is requested, the selected-location marker/cell is hidden so it cannot be mistaken for a route endpoint.
- The map shows only the requested A-to-B road route and its A/B markers, then fits the map to the route geometry and endpoints.
- The result card explicitly displays the exact source and destination DIGIPINs used by the route response.
- The client verifies that the backend response source/destination match the submitted DIGIPINs.
- A stale route response is ignored if the selected location changes or a newer request starts.
- Identical source and destination DIGIPINs are rejected with a helpful validation message.
- Includes the MapPin and Check icon imports.
