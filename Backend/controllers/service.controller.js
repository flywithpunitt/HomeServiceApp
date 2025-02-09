const Service = require('../models/service.model');

const serviceController = {
  // Create a new service (for providers)
  async createService(req, res) {
    try {
      const { 
        name, category, description, price, duration,
        location, availability, experience, certification 
      } = req.body;

      const service = new Service({
        name,
        category,
        description,
        price,
        duration,
        provider: req.user.userId, // Get provider ID from authenticated user
        location,
        experience,
        certification,
        availability: {
          isAvailable: true,
          schedule: availability || []
        }
      });

      await service.save();
      res.status(201).json(service);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all services with filters (for users)
  async getAllServices(req, res) {
    try {
      const { 
        category, 
        maxPrice, 
        minRating,
        location,
        radius, // in kilometers
        availability 
      } = req.query;

      let query = { 'availability.isAvailable': true };

      // Apply filters
      if (category) query.category = category;
      if (maxPrice) query.price = { $lte: parseFloat(maxPrice) };
      if (minRating) query['rating.average'] = { $gte: parseFloat(minRating) };

      let services = await Service.find(query)
        .populate('provider', 'name email phone rating')
        .select('-availability.schedule');

      // Filter by location if coordinates provided
      if (location && radius) {
        const [lng, lat] = location.split(',').map(coord => parseFloat(coord));
        services = await Service.aggregate([
          {
            $geoNear: {
              near: { type: "Point", coordinates: [lng, lat] },
              distanceField: "distance",
              maxDistance: parseInt(radius) * 1000, // Convert km to meters
              spherical: true,
              query: query
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'provider',
              foreignField: '_id',
              as: 'provider'
            }
          },
          { $unwind: '$provider' }
        ]);
      }

      res.json(services);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get provider's own services
  async getProviderServices(req, res) {
    try {
      const services = await Service.find({ provider: req.user.id });
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single service details
  async getServiceById(req, res) {
    try {
      const service = await Service.findById(req.params.id)
        .populate('provider', 'name email phone rating');
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }

      res.json(service);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update service (for providers)
  async updateService(req, res) {
    try {
      const service = await Service.findOne({
        _id: req.params.id,
        provider: req.user.id
      });

      if (!service) {
        return res.status(404).json({ message: 'Service not found or unauthorized' });
      }

      // Update allowed fields
      const updatableFields = [
        'name', 'description', 'price', 'duration',
        'availability', 'location', 'certification'
      ];

      updatableFields.forEach(field => {
        if (req.body[field] !== undefined) {
          service[field] = req.body[field];
        }
      });

      await service.save();
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete service (for providers)
  async deleteService(req, res) {
    try {
      const service = await Service.findOneAndDelete({
        _id: req.params.id,
        provider: req.user.id
      });

      if (!service) {
        return res.status(404).json({ message: 'Service not found or unauthorized' });
      }

      res.json({ message: 'Service deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update service availability
  async updateAvailability(req, res) {
    try {
      const { isAvailable, schedule } = req.body;
      const service = await Service.findOne({
        _id: req.params.id,
        provider: req.user.id
      });

      if (!service) {
        return res.status(404).json({ message: 'Service not found or unauthorized' });
      }

      service.availability = {
        isAvailable: isAvailable !== undefined ? isAvailable : service.availability.isAvailable,
        schedule: schedule || service.availability.schedule
      };

      await service.save();
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = serviceController;