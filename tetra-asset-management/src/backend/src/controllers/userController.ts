import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
// import { logger } from '../utils/logger'; // Placeholder for logger

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    // logger.error('Error fetching users:', error);
    console.error('Error fetching users:', error); // Simple console log for now
    next(error); // Pass error to global error handler
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
    // logger.error(`Error fetching user ${req.params.id}:`, error);
    console.error(`Error fetching user ${req.params.id}:`, error);
    next(error);
  }
};
