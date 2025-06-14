// src/backend/src/services/siteService.ts
import prisma from '../db/prismaClient';
import { Site, Prisma } from '../node_modules/.prisma/client';

// Payload Types
export interface SiteCreatePayload {
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdById?: string | null; // Assuming createdBy relationship might be set
}

export interface SiteUpdatePayload {
  name?: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  updatedById?: string | null; // Assuming updatedBy relationship might be set
}

export const getAllSites = async (): Promise<Site[]> => {
  return prisma.site.findMany();
};

export const getSiteById = async (id: string): Promise<Site | null> => {
  return prisma.site.findUnique({
    where: { id },
  });
};

export const createSite = async (data: SiteCreatePayload): Promise<Site> => {
  // Note: createdBy and updatedBy are not directly handled here yet
  // as they are relations. Depending on schema, they might be set via connect
  // or the schema might have default behavior or rely on triggers/auth middleware.
  // For now, we pass what's given.
  return prisma.site.create({
    data: {
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      // createdById: data.createdById, // If you want to explicitly set it
    },
  });
};

export const updateSite = async (id: string, data: SiteUpdatePayload): Promise<Site | null> => {
  try {
    const site = await prisma.site.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        // updatedById: data.updatedById, // If you want to explicitly set it
      },
    });
    return site;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return null; // Record not found
    }
    throw error;
  }
};

export const deleteSite = async (id: string): Promise<Site | null> => {
  try {
    const site = await prisma.site.delete({
      where: { id },
    });
    return site;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return null; // Record not found
    }
    throw error;
  }
};
