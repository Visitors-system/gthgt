// src/backend/src/validators/userValidators.ts
import { Role } from '../node_modules/.prisma/client'; // Adjust if Role enum is directly from @prisma/client

export interface UserCreatePayload {
  username: string;
  email: string;
  password?: string; // Password is required for creation, optional for update
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role?: Role;
  isActive?: boolean;
  teamMemberships?: any | null;
  permissions?: any | null;
  preferences?: any | null;
}

export interface UserUpdatePayload {
  username?: string;
  email?: string;
  password?: string; // Optional: for changing password
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role?: Role;
  isActive?: boolean;
  teamMemberships?: any | null;
  permissions?: any | null;
  preferences?: any | null;
}

export const validateUserCreatePayload = (payload: UserCreatePayload): string[] => {
  const errors: string[] = [];
  if (!payload.username || payload.username.trim().length < 3) {
    errors.push('Username is required and must be at least 3 characters long.');
  }
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push('A valid email is required.');
  }
  if (!payload.password || payload.password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long.');
  }
  if (payload.role && !Object.values(Role).includes(payload.role)) {
    errors.push('Invalid role specified.');
  }
  // Add more specific validation for other fields if necessary
  return errors;
};

export const validateUserUpdatePayload = (payload: UserUpdatePayload): string[] => {
  const errors: string[] = [];
  if (payload.username && payload.username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long if provided.');
  }
  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push('A valid email is required if provided.');
  }
  if (payload.password && payload.password.length < 6) {
    errors.push('Password must be at least 6 characters long if provided for update.');
  }
   if (payload.role && !Object.values(Role).includes(payload.role)) {
    errors.push('Invalid role specified.');
  }
  // Add more specific validation for other fields if necessary
  return errors;
};
