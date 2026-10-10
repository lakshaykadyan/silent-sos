const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },

    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      minlength: [2, 'Contact name must be at least 2 characters long'],
      maxlength: [100, 'Contact name cannot exceed 100 characters']
    },

    phone: {
      type: String,
      trim: true,
      default: ''
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },

    relationship: {
      type: String,
      trim: true,
      maxlength: [50, 'Relationship cannot exceed 50 characters'],
      default: ''
    },

    priority: {
      type: Number,
      min: 1,
      max: 10,
      default: 1
    },

    notificationPreferences: {
      sms: {
        type: Boolean,
        default: true
      },

      email: {
        type: Boolean,
        default: true
      },

      inApp: {
        type: Boolean,
        default: true
      }
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const EmergencyContact = mongoose.model(
  'EmergencyContact',
  emergencyContactSchema
);

module.exports = EmergencyContact;