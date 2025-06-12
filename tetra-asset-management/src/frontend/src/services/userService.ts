// src/frontend/src/services/userService.ts
import { QueryFunctionContext } from 'react-query';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role: string; // In a real app, this might be a more specific Role enum/type
  isActive?: boolean;
  teamMemberships?: any; // Define more strictly later
  permissions?: any; // Define more strictly later
  preferences?: any; // Define more strictly later
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
}

// For create/update payloads, password is optional on update
export interface UserFormData {
  id?: string; // Present for updates
  username: string;
  email: string;
  password?: string; // Optional, only for create or password change
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role: string; // e.g., "ADMIN", "TECHNICIAN"
  isActive?: boolean;
  // teamMemberships, permissions, preferences can be added if managed through this form
}


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to fetch users: ${response.statusText}`);
  }
  return response.json();
};

export const fetchUserById = async (context: QueryFunctionContext<[string, string]>): Promise<User> => {
  const [_key, userId] = context.queryKey;
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to fetch user ${userId}: ${response.statusText}`);
  }
  return response.json();
};

export const createUser = async (userData: UserFormData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Failed to create user');
  }
  return response.json();
};

export const updateUser = async (userId: string, userData: Partial<UserFormData>): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to update user ${userId}`);
  }
  return response.json();
};

export const deleteUser = async (userId: string): Promise<{ message: string; user: User }> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Failed to delete user ${userId}`);
  }
  return response.json(); // Expects { message: string, user: User }
};
