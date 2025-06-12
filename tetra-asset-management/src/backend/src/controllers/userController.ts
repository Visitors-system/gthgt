// src/backend/src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { validateUserCreatePayload, validateUserUpdatePayload, UserCreatePayload, UserUpdatePayload } from '../validators/userValidators';
import { Prisma } from '../node_modules/.prisma/client';


export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(`Error fetching user ${req.params.id}:`, error);
    next(error);
  }
};

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  const payload: UserCreatePayload = req.body;
  const errors = validateUserCreatePayload(payload);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  try {
    const newUser = await userService.createUser(payload);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ message: 'User with this email or username already exists.', fields: error.meta?.target });
      }
    }
    next(error);
  }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const payload: UserUpdatePayload = req.body;

  const errors = validateUserUpdatePayload(payload);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  try {
    const updatedUser = await userService.updateUser(id, payload);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Unique constraint violation
        return res.status(409).json({ message: 'Update failed: email or username may already exist for another user.', fields: error.meta?.target });
      }
    }
    next(error);
  }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    next(error);
  }
};
