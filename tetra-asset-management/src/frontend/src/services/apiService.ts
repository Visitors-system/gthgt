// src/frontend/src/services/apiService.ts

// Define basic types for Asset and Site for frontend use
// These should ideally be kept in sync with backend Prisma schema types
// For now, we only include fields relevant to map display.

export interface Site {
  id: string;
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  // Add other fields if needed by other parts of the frontend
  createdAt: string; // Assuming DateTime is serialized as string
  updatedAt: string;
}

// Corresponds to AssetType enum in Prisma
export enum AssetType {
  RADIO = 'RADIO',
  VEHICLE = 'VEHICLE',
  SENSOR = 'SENSOR',
  OTHER = 'OTHER',
}

// Corresponds to AssetStatus enum in Prisma
export enum AssetStatus {
  IN_WAREHOUSE = 'IN_WAREHOUSE',
  DEPLOYED = 'DEPLOYED',
  IN_TRANSIT = 'IN_TRANSIT',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  RESERVED = 'RESERVED',
  DISPOSED = 'DISPOSED',
  LOST_STOLEN = 'LOST_STOLEN',
}
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  serialNumber?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  // Add other fields if needed
  siteId?: string | null;
  assignedToUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = '/api'; // Assuming Vite proxy or similar setup

// Helper function for API requests
async function fetchWrapper<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`API Error ${response.status}: ${errorData}`);
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error; // Re-throw to be caught by the caller
  }
}

export const fetchAssets = async (): Promise<Asset[]> => {
  return fetchWrapper<Asset[]>(`${API_BASE_URL}/assets`);
};

export const fetchSites = async (): Promise<Site[]> => {
  return fetchWrapper<Site[]>(`${API_BASE_URL}/sites`);
};
