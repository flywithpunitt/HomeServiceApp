const express = require('express');
const router = express.Router();
const { providerController } = require('../controllers');
const { authenticateJWT, authorizeRole } = require('../middleware/auth');

router.get('/',
  providerController.getProviders
);

router.get('/nearby',
  providerController.getNearbyProviders
);

router.put('/availability',
  authenticateJWT,
  authorizeRole(['provider']),
  providerController.updateAvailability
);