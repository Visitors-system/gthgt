// src/backend/src/controllers/assetController.ts
import { Request, Response, NextFunction } from 'express';
import * as assetService from '../services/assetService';
import { AssetCreatePayload, AssetUpdatePayload } from '../services/assetService'; // Import payloads
import { Prisma, AssetType, AssetStatus } from '../node_modules/.prisma/client';

// Helper to check if a string is a valid enum value
function isValidEnum<T extends object>(enumObj: T, value: any): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}

export const getAssets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assets = await assetService.getAllAssets();
    res.status(200).json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    next(error);
  }
};

export const getAsset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const asset = await assetService.getAssetById(id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.status(200).json(asset);
  } catch (error) {
    console.error(`Error fetching asset ${req.params.id}:`, error);
    next(error);
  }
};

export const createAssetController = async (req: Request, res: Response, next: NextFunction) => {
  const payload: AssetCreatePayload = req.body;
  const errors: string[] = [];

  // Basic validation
  if (!payload.name) errors.push('Asset name is required');
  if (!payload.type) errors.push('Asset type is required');
  else if (!isValidEnum(AssetType, payload.type)) errors.push(`Invalid AssetType: ${payload.type}. Valid types are: ${Object.values(AssetType).join(', ')}`);
  if (!payload.status) errors.push('Asset status is required');
  else if (!isValidEnum(AssetStatus, payload.status)) errors.push(`Invalid AssetStatus: ${payload.status}. Valid statuses are: ${Object.values(AssetStatus).join(', ')}`);


  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  try {
    const newAsset = await assetService.createAsset(payload);
    res.status(201).json(newAsset);
  } catch (error) {
    console.error('Error creating asset:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Unique constraint violation (e.g., serialNumber)
        return res.status(409).json({ message: 'Asset with this serial number already exists.', fields: error.meta?.target });
      }
    }
    next(error);
  }
};

export const updateAssetController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const payload: AssetUpdatePayload = req.body;
  const errors: string[] = [];

  if (Object.keys(payload).length === 0) {
    errors.push('No update data provided');
  }
  if (payload.type && !isValidEnum(AssetType, payload.type)) {
    errors.push(`Invalid AssetType: ${payload.type}. Valid types are: ${Object.values(AssetType).join(', ')}`);
  }
  if (payload.status && !isValidEnum(AssetStatus, payload.status)) {
    errors.push(`Invalid AssetStatus: ${payload.status}. Valid statuses are: ${Object.values(AssetStatus).join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  try {
    const updatedAsset = await assetService.updateAsset(id, payload);
    if (!updatedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.status(200).json(updatedAsset);
  } catch (error) {
    console.error(`Error updating asset ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ message: 'Update failed: serial number may already exist for another asset.', fields: error.meta?.target });
      }
    }
    next(error);
  }
};

export const deleteAssetController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deletedAsset = await assetService.deleteAsset(id);
    if (!deletedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.status(200).json({ message: 'Asset deleted successfully', asset: deletedAsset });
  } catch (error) {
    console.error(`Error deleting asset ${id}:`, error);
    next(error);
  }
};
