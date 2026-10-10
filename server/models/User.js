const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true,
      default: ''
    },

    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },

    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    },

    profile: {
      avatar: {
        type: String,
        default: ''
      },

      dateOfBirth: {
        type: Date,
        default: null
      },

      address: {
        type: String,
        trim: true,
        default: ''
      }
    },

    safetySettings: {
      locationSharingEnabled: {
        type: Boolean,
        default: true
      },

      silentModeEnabled: {
        type: Boolean,
        default: true
      }
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

const User = mongoose.model('User', userSchema);

module.exports = User;