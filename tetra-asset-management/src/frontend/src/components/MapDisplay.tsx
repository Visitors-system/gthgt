import React, { useEffect, useRef } from 'react';
import L, { Map as LeafletMap, tileLayer, LatLngExpression, Marker, LayerGroup } from 'leaflet'; // Import L for marker
import 'leaflet/dist/leaflet.css';

// Define the structure for items to be plotted on the map
export interface MapItem {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type?: string; // e.g., 'asset' or 'site'
}

interface MapDisplayProps {
  initialCenter?: LatLngExpression;
  initialZoom?: number;
  tileUrl?: string;
  attribution?: string;
  items?: MapItem[];
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  initialCenter = [0, 0],
  initialZoom = 2,
  tileUrl = '/map-tiles/{z}/{x}/{y}.png',
  attribution = 'Offline Maps Inc. &copy; OpenStreetMap contributors',
  items = [], // Default to an empty array
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null); // To manage markers

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = new LeafletMap(mapContainerRef.current).setView(initialCenter, initialZoom);
      tileLayer(tileUrl, {
        attribution,
        minZoom: 0,
        maxZoom: 18,
        tms: false,
      }).addTo(map);
      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map); // Initialize marker layer group
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialCenter, initialZoom, tileUrl, attribution]); // Only re-initialize map on these prop changes

  useEffect(() => {
    if (mapInstanceRef.current && markersLayerRef.current) {
      // Clear existing markers
      markersLayerRef.current.clearLayers();

      // Add new markers
      items.forEach(item => {
        if (item.latitude != null && item.longitude != null) {
          const marker = L.marker([item.latitude, item.longitude]);
          marker.bindPopup(`<b>${item.name}</b><br>${item.type || ''}`);
          markersLayerRef.current?.addLayer(marker);
        }
      });
    }
  }, [items]); // Re-run this effect when items change

  return (
    <div
      ref={mapContainerRef}
      style={{ height: '500px', width: '100%', border: '1px solid #ccc' }}
      aria-label="Map container"
    />
  );
};

export default MapDisplay;
