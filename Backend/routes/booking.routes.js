// routes/booking.routes.js
const router = require('express').Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware.verifyToken, bookingController.createBooking);
router.get('/user', authMiddleware.verifyToken, bookingController.getUserBookings);
router.get('/provider', [authMiddleware.verifyToken, authMiddleware.verifyRole(['provider'])], bookingController.getProviderBookings);
router.put('/:id/status', [authMiddleware.verifyToken, authMiddleware.verifyRole(['provider', 'admin'])], bookingController.updateBookingStatus);

module.exports = router;