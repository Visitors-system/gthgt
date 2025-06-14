// src/frontend/src/pages/AssetMapPage.tsx
import React, { useEffect, useState } from 'react';
import MapDisplay from '../components/MapDisplay';
import { fetchAssets, fetchSites, Asset, Site } from '../services/apiService';

// Define the structure for items to be plotted on the map
export interface MapItem {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type?: string; // e.g., 'asset' or 'site' or specific asset type
}

const AssetMapPage: React.FC = () => {
  const [mapItems, setMapItems] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMapData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [assets, sites] = await Promise.all([fetchAssets(), fetchSites()]);

        const combinedItems: MapItem[] = [];

        assets.forEach((asset: Asset) => {
          if (asset.latitude != null && asset.longitude != null) {
            combinedItems.push({
              id: asset.id,
              name: asset.name,
              latitude: asset.latitude,
              longitude: asset.longitude,
              type: `Asset (${asset.type})`, // Indicate it's an asset and its type
            });
          }
        });

        sites.forEach((site: Site) => {
          if (site.latitude != null && site.longitude != null) {
            combinedItems.push({
              id: site.id,
              name: site.name,
              latitude: site.latitude,
              longitude: site.longitude,
              type: 'Site', // Indicate it's a site
            });
          }
        });

        setMapItems(combinedItems);
      } catch (err) {
        console.error("Error fetching map data:", err);
        setError('Failed to load map data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading map data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Asset and Site Map</h1>
      <MapDisplay items={mapItems} initialCenter={[20,0]} initialZoom={2} />
      {/* Example: Display list of items below map for debugging/verification
      <div className="mt-4">
        <h2 className="text-xl">Map Items ({mapItems.length})</h2>
        <ul>
          {mapItems.map(item => (
            <li key={item.id}>{item.name} ({item.type}) - Lat: {item.latitude}, Lng: {item.longitude}</li>
          ))}
        </ul>
      </div>
      */}
    </div>
  );
};

export default AssetMapPage;
