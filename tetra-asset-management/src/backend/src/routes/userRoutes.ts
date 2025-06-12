import { Router } from 'express';
import * as userController from '../controllers/userController';
// import { authMiddleware } from '../middleware/authMiddleware'; // Placeholder

const router = Router();

// Apply auth middleware to all user routes if needed, or per route
// router.use(authMiddleware);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
// Add other routes (POST, PUT, DELETE) later

export default router;
