const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cleaning', 'cooking', 'plumbing', 'electrical', 'doctor', 'carpenter', 'laundry', 'mechanic']
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,  // in minutes
    required: true
  },
  image: String,
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    },
    address: String,
    city: String,
    state: String,
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    schedule: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      slots: [{
        startTime: String,
        endTime: String,
        isBooked: {
          type: Boolean,
          default: false
        }
      }]
    }]
  },
  tags: [String],
  experience: {
    type: Number,
    required: true
  },
  certification: {
    type: String
  }
}, {
  timestamps: true
});

// Index for location-based queries
serviceSchema.index({ "location.coordinates": "2dsphere" });

// Method to calculate distance from a point
serviceSchema.methods.getDistance = function(coords) {
  // Calculate distance using MongoDB's $geoNear
  return this.model('Service').aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: coords },
        distanceField: "distance",
        spherical: true,
        query: { _id: this._id }
      }
    }
  ]); 
};

module.exports = mongoose.model('Service', serviceSchema);