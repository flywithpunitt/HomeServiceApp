const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/bookings', require('./bookingRoutes'));
router.use('/services', require('./serviceRoutes'));
router.use('/providers', require('./providerRoutes'));

module.exports = router;