# Offline Maps and Geolocation Feature

This document describes the setup and usage of the offline map and asset/site geolocation feature in the TETRA Asset Management System. This feature allows users to visualize the geographic location of assets and sites on a map within an air-gapped environment.

## Feature Overview

- **Offline Map Display:** Utilizes a local map tile server (not implemented in this phase, but designed for) to provide map imagery without internet access.
- **Asset Geolocation:** Assets (e.g., radios, vehicles) can have their latitude and longitude stored and displayed.
- **Site Geolocation:** Sites can also have their geographic coordinates stored and displayed.
- **Interactive Map:** Users can view assets and sites as markers on a map, click them for basic information, and navigate the map.

## Setup (Air-Gapped Environment)

The offline map functionality relies on pre-configured map tiles and a local tile server.

### 1. Obtaining Map Tiles (MBTiles)

- Map tiles need to be packaged into an MBTiles format. This is a one-time setup step performed in an environment *with* internet access.
- **Tools:** You can use tools like [OpenMapTiles](https://openmaptiles.org/docs/generate/generate-vector-tiles-from-openstreetmap/) (for vector tiles, which can be styled) or create raster tiles using tools like [QGIS](https://www.qgis.org) or custom scripts with [GDAL](https://gdal.org/).
- **Process (Example for Raster Tiles):**
    1. Define the geographic area of interest.
    2. Download or generate map tiles for this area at various zoom levels.
    3. Use a utility (e.g., `mb-util` or QGIS) to package these tiles into an `.mbtiles` file.
- This `.mbtiles` file must then be transferred to the air-gapped environment.

### 2. Configuring the Tile Server (Conceptual)

A tile server is required to serve the map tiles from the MBTiles file to the frontend application. This component is planned for integration.

- **Recommended Server:** A lightweight server like [tileserver-gl](https://tileserver.maptiler.com/) (for vector tiles) or a simple Python-based server for raster MBTiles is suitable.
- **Deployment:** It's recommended to run the tile server as a Docker container alongside the main application (defined in `docker-compose.yml`).
- **Configuration:**
    - The tile server container would need access to the `.mbtiles` file (e.g., via a Docker volume mount).
    - It would be configured to serve tiles on a specific local port (e.g., `http://localhost:8080/tiles/{z}/{x}/{y}.png`).
    - The frontend `MapDisplay.tsx` component is currently configured to fetch tiles from `/map-tiles/{z}/{x}/{y}.png`. A reverse proxy (like the one used by the frontend dev server or an Nginx instance in production) would need to route requests from `/map-tiles/` to the actual tile server URL and port.

### 3. Database Migration (Important for Developers)

- The database schema has been updated to support geolocation data for Assets and Sites.
- **Action Required:** After pulling these changes, developers must run the following command in the `tetra-asset-management` directory to generate and apply the database migration:
  ```bash
  npx prisma migrate dev --name add_geolocation_and_asset_model
  ```
- This requires a connection to your development PostgreSQL database. Ensure your `DATABASE_URL` in `.env` (or `.env.local` if used) is correctly configured. Note: The previous subtask for migration creation failed due to no DB in the sandbox, this instruction is for developers with local DBs.

## Using the Geolocation Feature

### Viewing Assets and Sites on the Map

1.  Navigate to the "Asset Map" page (link usually available in the main navigation, e.g., from the Home page).
2.  The map will display markers for all assets and sites that have valid latitude and longitude information.
3.  Click on a marker to see a popup with the name and type (Asset/Site) of the item.
4.  Standard map navigation controls (pan, zoom) are available.

### Adding/Updating Geolocation Data

- **Assets:**
    - When creating or updating an asset through the Asset management interface (accessible via `/api/assets` endpoints currently), you can specify its `latitude` and `longitude`.
- **Sites:**
    - When creating or updating a site (accessible via `/api/sites` endpoints currently), you can specify its `latitude` and `longitude`.

The frontend UI for directly inputting/editing these coordinates via forms is planned for a future iteration. Currently, data is managed via API calls.

## Future Enhancements (Conceptual)

- UI for direct latitude/longitude input on Asset/Site forms.
- More advanced map interactions (filtering, searching by location).
- Integration of the actual tile server Docker container and reverse proxy configuration for production.
- Support for different map tile styles if using vector tiles.
- Dynamic adjustment of map view based on available markers (e.g., `map.fitBounds()`).
