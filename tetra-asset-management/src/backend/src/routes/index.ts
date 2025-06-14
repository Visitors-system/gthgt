import { Router } from 'express';
import userRoutes from './userRoutes'; // Import user routes
import siteRoutes from './siteRoutes'; // Import site routes
import assetRoutes from './assetRoutes'; // Import asset routes

const router = Router();

router.use('/users', userRoutes); // Mount user routes
router.use('/sites', siteRoutes); // Mount site routes
router.use('/assets', assetRoutes); // Mount asset routes
// router.use('/devices', deviceRouter); // Placeholder for other routes

export default router;
