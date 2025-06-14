// src/backend/src/controllers/siteController.ts
import { Request, Response, NextFunction } from 'express';
import * as siteService from '../services/siteService';
import { SiteCreatePayload, SiteUpdatePayload } from '../services/siteService'; // Import payloads from service
import { Prisma } from '../node_modules/.prisma/client';

export const getSites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sites = await siteService.getAllSites();
    res.status(200).json(sites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    next(error);
  }
};

export const getSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const site = await siteService.getSiteById(id);
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }
    res.status(200).json(site);
  } catch (error) {
    console.error(`Error fetching site ${req.params.id}:`, error);
    next(error);
  }
};

export const createSiteController = async (req: Request, res: Response, next: NextFunction) => {
  const payload: SiteCreatePayload = req.body;
  // Basic validation (existence of name)
  if (!payload.name) {
    return res.status(400).json({ message: 'Validation failed', errors: ['Site name is required'] });
  }

  try {
    const newSite = await siteService.createSite(payload);
    res.status(201).json(newSite);
  } catch (error) {
    console.error('Error creating site:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Unique constraint violation (e.g. if site name must be unique)
        return res.status(409).json({ message: 'Site with this name already exists.', fields: error.meta?.target });
      }
    }
    next(error);
  }
};

export const updateSiteController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const payload: SiteUpdatePayload = req.body;

  // Basic validation (at least one field to update)
  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ message: 'Validation failed', errors: ['No update data provided'] });
  }

  try {
    const updatedSite = await siteService.updateSite(id, payload);
    if (!updatedSite) {
      return res.status(404).json({ message: 'Site not found' });
    }
    res.status(200).json(updatedSite);
  } catch (error) {
    console.error(`Error updating site ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ message: 'Update failed: site name may already exist for another site.', fields: error.meta?.target });
      }
    }
    next(error);
  }
};

export const deleteSiteController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deletedSite = await siteService.deleteSite(id);
    if (!deletedSite) {
      return res.status(404).json({ message: 'Site not found' });
    }
    // Standard practice is to return 204 No Content for DELETE if not returning the object
    // Or 200 OK if returning the deleted object or a confirmation message
    res.status(200).json({ message: 'Site deleted successfully', site: deletedSite });
  } catch (error) {
    console.error(`Error deleting site ${id}:`, error);
    next(error);
  }
};
