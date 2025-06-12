import { Router } from 'express';
import userRoutes from './userRoutes'; // Import user routes

const router = Router();

router.use('/users', userRoutes); // Mount user routes
// router.use('/devices', deviceRouter); // Placeholder for other routes

export default router;
