const mongoose = require('mongoose');

const alertActivitySchema = new mongoose.Schema(
  {
    alertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alert',
      required: [true, 'Alert ID is required'],
      index: true
    },

    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Actor ID is required']
    },

    actorType: {
      type: String,
      enum: ['USER', 'ADMIN', 'SYSTEM'],
      required: [true, 'Actor type is required']
    },

    action: {
      type: String,
      enum: [
        'SOS_TRIGGERED',
        'LOCATION_UPDATED',
        'ACKNOWLEDGED',
        'RESOLVING',
        'RESOLVED',
        'ERROR'
      ],
      required: [true, 'Activity action is required']
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const AlertActivity = mongoose.model(
  'AlertActivity',
  alertActivitySchema
);

module.exports = AlertActivity;