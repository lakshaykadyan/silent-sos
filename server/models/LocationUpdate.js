const mongoose = require('mongoose');

const locationUpdateSchema = new mongoose.Schema(
  {
    alertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alert',
      required: [true, 'Alert ID is required'],
      index: true
    },

    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90
    },

    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180
    },

    accuracy: {
      type: Number,
      required: false,
      min: 0
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },

    source: {
      type: String,
      enum: ['GPS', 'NETWORK', 'MANUAL'],
      default: 'GPS'
    }
  },
  {
    timestamps: true
  }
);

const LocationUpdate = mongoose.model(
  'LocationUpdate',
  locationUpdateSchema
);

module.exports = LocationUpdate;