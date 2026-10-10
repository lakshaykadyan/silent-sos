const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientContactId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmergencyContact',
      required: [true, 'Recipient contact ID is required'],
      index: true
    },

    alertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alert',
      required: [true, 'Alert ID is required'],
      index: true
    },

    type: {
      type: String,
      enum: [
        'EMERGENCY_ALERT',
        'ALERT_ACKNOWLEDGED',
        'ALERT_RESOLVED',
        'SYSTEM'
      ],
      default: 'EMERGENCY_ALERT'
    },

    channel: {
      type: String,
      enum: [
        'IN_APP',
        'EMAIL',
        'SMS'
      ],
      default: 'IN_APP'
    },

    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [
        150,
        'Notification title cannot exceed 150 characters'
      ]
    },

    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [
        500,
        'Notification message cannot exceed 500 characters'
      ]
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true
    },

    readAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Notification = mongoose.model(
  'Notification',
  notificationSchema
);

module.exports = Notification;