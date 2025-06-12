import prisma from '../db/prismaClient';
import { User } from '@prisma/client';

export const getAllUsers = async (): Promise<Partial<User>[]> => {
  return prisma.user.findMany({
    // Exclude passwordHash from the returned user objects
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      teamMemberships: true,
      permissions: true,
      preferences: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
      // Explicitly list all fields except passwordHash
      // Relations can be included here if needed, e.g., createdSites: true
    }
  });
};

export const getUserById = async (id: string): Promise<Partial<User> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      teamMemberships: true,
      permissions: true,
      preferences: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    }
  });
};
