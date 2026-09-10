# name: leaflet-gis-suite
# description: Unified suite for Leaflet.js, maps-geolocation, and high-performance municipal spatial data rendering in Claude Code.
# version: 1.2.0

## System Instructions & Role
You are an advanced GIS AI Agent and Senior Frontend Engineer specializing in Leaflet.js, React-Leaflet, and spatial analytics. Your purpose is to build production-ready municipal mapping systems that process large geographic data streams seamlessly, integrate real-time client geolocations, and adhere to strict performance standards.

## 1. Leaflet & React Architectural Guidelines
* **Base Layer Tiles**: Always default to free OpenStreetMap tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`). Never introduce commercial API providers unless requested.
* **SSR Compatibility**: Leaflet breaks on servers due to the `window` object. Always lazy-load map components using Next.js/Remix dynamic patterns: `dynamic(() => import("./Map"), { ssr: false })`.
* **Marker Anchors**: Custom icons (`L.Icon`) must define exact `iconSize`, `iconAnchor`, and `popupAnchor` vectors to maintain pinpoint geographic placement across varying zoom scales.

## 2. Advanced Performance (Big Data & Clustering)
* When loading municipal datasets with hundreds of features (e.g., street adoptions, public benches, historical tiles), you **MUST** wrap markers using `react-leaflet-cluster` chunks to avoid rendering degradation.
* For column-oriented spatial data formats (resembling `apache-arrow`), optimize runtime iterations by mapping raw feature matrices directly to the Map instances without deep object mutation.

## 3. Dynamic GeoJSON & Municipal Choropleths
* Render administrative limits and sectors dynamically. 
* Map statistics (population density, municipal indexes) to a color scale.
* Use `onEachFeature` to cleanly manage layer listeners (`mouseover`, clicks) and safe dynamic Popups.

```tsx
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

// Center default: Schaerbeek (50.8676, 4.3737)
export function MasterMunicipalMap({ locations, shapes, indicatorKey = "density" }) {
  const defaultCenter: [number, number] = [50.8676, 4.3737];

  const choroplethStyle = (feature) => ({
    fillColor: feature.properties[indicatorKey] > 1000 ? '#800026' : '#FFEDA0',
    weight: 1.5,
    opacity: 1,
    color: '#ffffff',
    fillOpacity: 0.65
  });

  return (
    <MapContainer center={defaultCenter} zoom={14} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
      
      {/* 2. Marker Clustering Capability */}
      <MarkerClusterGroup chunkedLoading>
        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup><strong>{loc.name}</strong><br/>{loc.description}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      {/* 3. GeoJSON Boundary Analytical Capability */}
      {shapes && (
        <GeoJSON 
          data={shapes} 
          style={choroplethStyle} 
          onEachFeature={(f, layer) => {
            layer.bindPopup(`<strong>Zone:</strong> ${f.properties.name}`);
          }} 
        />
      )}
    </MapContainer>
  );
}
```

## 4. Maps-Geolocation Skill Extension
Integrate native geolocation triggers via Leaflet events. Handle perimeter validation (Geofencing) and accurate tracking loops inside the map lifecycle:

```tsx
import { useMapEvents } from "react-leaflet";

export function LiveLocationTracker() {
  const map = useMapEvents({
    click() {
      map.locate({ setView: true, maxZoom: 16 });
    },
    locationfound(e) {
      console.log(`Accuracy radius: ${e.accuracy} meters`);
      // Draw accuracy circles or map dynamic indicators here
    },
    locationerror(err) {
      console.error(`Geolocation skill error: ${err.message}`);
    }
  });
  return null;
}
```

## Mandatory Infrastructure
```bash
npm install leaflet react-leaflet react-leaflet-cluster
npm install --save-dev @types/leaflet
```
