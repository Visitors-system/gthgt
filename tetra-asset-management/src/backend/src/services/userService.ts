// src/backend/src/services/userService.ts
import prisma from '../db/prismaClient';
import { User, Prisma, Role } from '../node_modules/.prisma/client';
import bcrypt from 'bcrypt';
import { UserCreatePayload, UserUpdatePayload } from '../validators/userValidators';

const SALT_ROUNDS = 10;

// Helper to exclude password hash
const excludePassword = <U extends User, Key extends keyof U>(
  user: U,
  keys: Key[] = ['passwordHash' as unknown as Key] // Type assertion needed
): Omit<U, Key> => {
  // Create a new object to avoid modifying the original Prisma model instance directly
  const result = { ...user };
  for (let key of keys) {
    delete result[key as keyof User];
  }
  return result;
};

export const getAllUsers = async (): Promise<Omit<User, 'passwordHash'>[]> => {
  const users = await prisma.user.findMany({
    select: {
      id: true, username: true, email: true, firstName: true, lastName: true, phone: true,
      role: true, isActive: true, teamMemberships: true, permissions: true, preferences: true,
      lastLogin: true, createdAt: true, updatedAt: true,
    }
  });
  // Although select is used, if the underlying type User still has passwordHash,
  // it's safer to ensure it's excluded if the object were to somehow include it.
  // However, with `select`, it's already excluded. So, this map is more for ensuring type conformity.
  return users.map(user => excludePassword(user as User, ['passwordHash']));
};

export const getUserById = async (id: string): Promise<Omit<User, 'passwordHash'> | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, username: true, email: true, firstName: true, lastName: true, phone: true,
      role: true, isActive: true, teamMemberships: true, permissions: true, preferences: true,
      lastLogin: true, createdAt: true, updatedAt: true,
    }
  });
  if (!user) return null;
  return excludePassword(user as User, ['passwordHash']);
};

export const createUser = async (data: UserCreatePayload): Promise<Omit<User, 'passwordHash'>> => {
  const hashedPassword = await bcrypt.hash(data.password!, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role || Role.TECHNICIAN, // Default role
      isActive: data.isActive !== undefined ? data.isActive : true, // Default isActive
      teamMemberships: data.teamMemberships || Prisma.JsonNull,
      permissions: data.permissions || Prisma.JsonNull,
      preferences: data.preferences || Prisma.JsonNull,
    },
  });
  return excludePassword(user, ['passwordHash']);
};

export const updateUser = async (id: string, data: UserUpdatePayload): Promise<Omit<User, 'passwordHash'> | null> => {
  const { password, ...restOfData } = data; // Separate password from other data
  const updateData: Prisma.UserUpdateInput = { ...restOfData };

  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    return excludePassword(user, ['passwordHash']);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return null; // Record not found
    }
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<Omit<User, 'passwordHash'> | null> => {
  try {
    const user = await prisma.user.delete({
      where: { id },
    });
    return excludePassword(user, ['passwordHash']);
  } catch (error)    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return null; // Record not found
    }
    throw error;
  }
};
