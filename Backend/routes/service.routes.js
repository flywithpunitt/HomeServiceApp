const router = require('express').Router();
const serviceController = require('../controllers/service.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Provider routes (protected)
router.post(
  '/',
  [authMiddleware.verifyToken, authMiddleware.verifyRole(['provider'])],
  serviceController.createService
);

router.get(
  '/provider/services',
  [authMiddleware.verifyToken, authMiddleware.verifyRole(['provider'])],
  serviceController.getProviderServices
);

router.put(
  '/:id',
  [authMiddleware.verifyToken, authMiddleware.verifyRole(['provider'])],
  serviceController.updateService
);

router.delete(
  '/:id',
  [authMiddleware.verifyToken, authMiddleware.verifyRole(['provider'])],
  serviceController.deleteService
);

router.patch(
  '/:id/availability',
  [authMiddleware.verifyToken, authMiddleware.verifyRole(['provider'])],
  serviceController.updateAvailability
);

module.exports = router;