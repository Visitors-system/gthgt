import { QueryFunctionContext } from 'react-query';

// Define a User type that matches the backend response (omitting passwordHash)
// This should ideally be in a shared types directory or defined more robustly.
export interface User {
  id: string;
  username: string;
  email: string;
  role: string; // Assuming role is a string, adjust if it's an enum object
  teamMemberships?: any; // Define more strictly later
  permissions?: any; // Define more strictly later
  preferences?: any; // Define more strictly later
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }
  return response.json();
};

export const fetchUserById = async (context: QueryFunctionContext<[string, string]>): Promise<User> => {
  const [_key, userId] = context.queryKey;
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user ${userId}: ${response.statusText}`);
  }
  return response.json();
};
