const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    alertId: {
      type: String,
      required: [true, 'Alert ID is required'],
      unique: true,
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },

    status: {
      type: String,
      enum: [
        'ACTIVATING',
        'ACTIVE',
        'ACKNOWLEDGED',
        'RESOLVING',
        'RESOLVED',
        'ERROR'
      ],
      default: 'ACTIVATING',
      index: true
    },

    triggerTime: {
      type: Date,
      required: [true, 'Trigger time is required'],
      default: Date.now
    },

    initialLocation: {
      latitude: {
        type: Number,
        required: false
      },

      longitude: {
        type: Number,
        required: false
      },

      accuracy: {
        type: Number,
        required: false
      }
    },

    currentLocation: {
      latitude: {
        type: Number,
        required: false
      },

      longitude: {
        type: Number,
        required: false
      },

      accuracy: {
        type: Number,
        required: false
      }
    },

    lastLocationUpdate: {
      type: Date,
      default: null
    },

    responseTime: {
      type: Date,
      default: null
    },

    resolvedAt: {
      type: Date,
      default: null
    },

    resolutionNote: {
      type: String,
      trim: true,
      maxlength: [500, 'Resolution note cannot exceed 500 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;