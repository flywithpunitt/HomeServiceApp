// controllers/booking.controller.js
const Booking = require('../models/booking.model');

const bookingController = {
  async createBooking(req, res) {
    try {
      const { serviceId, providerId, scheduledDate, location } = req.body;
      const booking = new Booking({
        user: req.user.userId,
        provider: providerId,
        service: serviceId,
        scheduledDate,
        location
      });
      await booking.save();
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getUserBookings(req, res) {
    try {
      const bookings = await Booking.find({ user: req.user.userId })
        .populate('service')
        .populate('provider', 'name email')
        .sort('-createdAt');
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getProviderBookings(req, res) {
    try {
      const bookings = await Booking.find({ provider: req.user.userId })
        .populate('service')
        .populate('user', 'name email')
        .sort('-createdAt');
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateBookingStatus(req, res) {
    try {
      const { status } = req.body;
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = bookingController;