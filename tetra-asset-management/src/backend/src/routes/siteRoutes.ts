// src/backend/src/routes/siteRoutes.ts
import { Router } from 'express';
import * as siteController from '../controllers/siteController';
// import { authMiddleware, checkRole } from '../middleware/authMiddleware'; // Placeholder for auth

const router = Router();

// Example: Protect all site routes if needed
// router.use(authMiddleware);

router.get('/', siteController.getSites);
router.post('/', /* checkRole(['ADMIN', 'SUPERVISOR']), */ siteController.createSiteController); // Example role check
router.get('/:id', siteController.getSite);
router.put('/:id', /* checkRole(['ADMIN', 'SUPERVISOR']), */ siteController.updateSiteController);
router.delete('/:id', /* checkRole(['ADMIN']), */ siteController.deleteSiteController);

export default router;
