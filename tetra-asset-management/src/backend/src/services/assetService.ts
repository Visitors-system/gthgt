// src/backend/src/services/assetService.ts
import prisma from '../db/prismaClient';
import { Asset, AssetType, AssetStatus, Prisma } from '../node_modules/.prisma/client';

// Payload Types
export interface AssetCreatePayload {
  name: string;
  type: AssetType;
  status: AssetStatus;
  serialNumber?: string | null;
  modelNumber?: string | null;
  manufacturer?: string | null;
  purchaseDate?: Date | string | null; // Allow string for date input, Prisma handles conversion
  warrantyExpiryDate?: Date | string | null;
  assignedToUserId?: string | null;
  siteId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  locationLastUpdated?: Date | string | null;
  customFields?: Prisma.JsonValue | null;
  notes?: string | null;
  // createdById, updatedById could be added if managed by application logic
}

export interface AssetUpdatePayload {
  name?: string;
  type?: AssetType;
  status?: AssetStatus;
  serialNumber?: string | null;
  modelNumber?: string | null;
  manufacturer?: string | null;
  purchaseDate?: Date | string | null;
  warrantyExpiryDate?: Date | string | null;
  assignedToUserId?: string | null;
  siteId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  locationLastUpdated?: Date | string | null;
  customFields?: Prisma.JsonValue | null;
  notes?: string | null;
}

export const getAllAssets = async (): Promise<Asset[]> => {
  return prisma.asset.findMany({
    include: {
      assignedToUser: { // Include basic user info; be careful about exposing sensitive user data
        select: { id: true, username: true, email: true }
      },
      site: true, // Include site info
    }
  });
};

export const getAssetById = async (id: string): Promise<Asset | null> => {
  return prisma.asset.findUnique({
    where: { id },
    include: {
      assignedToUser: {
        select: { id: true, username: true, email: true }
      },
      site: true,
    }
  });
};

export const createAsset = async (data: AssetCreatePayload): Promise<Asset> => {
  // Convert date strings to Date objects if necessary
  const purchaseDate = data.purchaseDate ? new Date(data.purchaseDate) : null;
  const warrantyExpiryDate = data.warrantyExpiryDate ? new Date(data.warrantyExpiryDate) : null;
  const locationLastUpdated = data.locationLastUpdated ? new Date(data.locationLastUpdated) : null;

  return prisma.asset.create({
    data: {
      ...data,
      purchaseDate,
      warrantyExpiryDate,
      locationLastUpdated,
      // Ensure relations are handled correctly (connect if ID is provided)
      assignedToUser: data.assignedToUserId ? { connect: { id: data.assignedToUserId } } : undefined,
      site: data.siteId ? { connect: { id: data.siteId } } : undefined,
    },
  });
};

export const updateAsset = async (id: string, data: AssetUpdatePayload): Promise<Asset | null> => {
  try {
    // Convert date strings to Date objects if necessary
    const purchaseDate = data.purchaseDate ? new Date(data.purchaseDate) : undefined;
    const warrantyExpiryDate = data.warrantyExpiryDate ? new Date(data.warrantyExpiryDate) : undefined;
    const locationLastUpdated = data.locationLastUpdated ? new Date(data.locationLastUpdated) : undefined;


    // Build the data object, carefully handling relational updates
    const updateData: Prisma.AssetUpdateInput = {
        ...data,
        purchaseDate: purchaseDate,
        warrantyExpiryDate: warrantyExpiryDate,
        locationLastUpdated: locationLastUpdated,
    };

    // Handle relational fields: connect if ID is provided, disconnect if null is explicitly passed (optional)
    // For simplicity, we'll just connect. Disconnecting or setting to null requires more complex logic.
    if (data.assignedToUserId !== undefined) {
        updateData.assignedToUser = data.assignedToUserId ? { connect: { id: data.assignedToUserId } } : { disconnect: true };
    }
    if (data.siteId !== undefined) {
        updateData.site = data.siteId ? { connect: { id: data.siteId } } : { disconnect: true };
    }


    const asset = await prisma.asset.update({
      where: { id },
      data: updateData,
    });
    return asset;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return null; // Record not found
    }
    throw error;
  }
};

export const deleteAsset = async (id: string): Promise<Asset | null> => {
  try {
    const asset = await prisma.asset.delete({
      where: { id },
    });
    return asset;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return null; // Record not found
    }
    throw error;
  }
};
