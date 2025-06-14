// src/backend/src/routes/assetRoutes.ts
import { Router } from 'express';
import * as assetController from '../controllers/assetController';
// import { authMiddleware, checkRole } from '../middleware/authMiddleware'; // Placeholder for auth

const router = Router();

// Example: Protect all asset routes if needed
// router.use(authMiddleware);

router.get('/', assetController.getAssets);
router.post('/', /* checkRole(['ADMIN', 'SUPERVISOR', 'TECHNICIAN']), */ assetController.createAssetController); // Example role check
router.get('/:id', assetController.getAsset);
router.put('/:id', /* checkRole(['ADMIN', 'SUPERVISOR', 'TECHNICIAN']), */ assetController.updateAssetController);
router.delete('/:id', /* checkRole(['ADMIN', 'SUPERVISOR']), */ assetController.deleteAssetController);

export default router;
