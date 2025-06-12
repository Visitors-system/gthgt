// src/backend/src/routes/userRoutes.ts
import { Router } from 'express';
import * as userController from '../controllers/userController';
// import { authMiddleware, checkRole } from '../middleware/authMiddleware'; // Placeholder for auth

const router = Router();

// Example: Protect all user routes
// router.use(authMiddleware);

router.get('/', userController.getUsers);
router.post('/', /* checkRole(['ADMIN']), */ userController.createUserController); // Example role check
router.get('/:id', userController.getUser);
router.put('/:id', /* checkRole(['ADMIN']), */ userController.updateUserController);
router.delete('/:id', /* checkRole(['ADMIN']), */ userController.deleteUserController);

export default router;
