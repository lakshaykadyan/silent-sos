const User = require('../models/User');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      '-passwordHash'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      avatar,
      dateOfBirth,
      address
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 2 characters long'
        });
      }

      if (name.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot exceed 100 characters'
        });
      }

      user.name = name.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Phone must be a string'
        });
      }

      user.phone = phone.trim();
    }

    if (avatar !== undefined) {
      if (typeof avatar !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Avatar must be a string'
        });
      }

      user.profile.avatar = avatar.trim();
    }

    if (dateOfBirth !== undefined) {
      if (
        dateOfBirth !== null &&
        Number.isNaN(Date.parse(dateOfBirth))
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date of birth'
        });
      }

      user.profile.dateOfBirth = dateOfBirth
        ? new Date(dateOfBirth)
        : null;
    }

    if (address !== undefined) {
      if (typeof address !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Address must be a string'
        });
      }

      user.profile.address = address.trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profile: user.profile,
          safetySettings: user.safetySettings,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const {
      locationSharingEnabled,
      silentModeEnabled
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    if (locationSharingEnabled !== undefined) {
      if (typeof locationSharingEnabled !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'locationSharingEnabled must be a boolean'
        });
      }

      user.safetySettings.locationSharingEnabled =
        locationSharingEnabled;
    }

    if (silentModeEnabled !== undefined) {
      if (typeof silentModeEnabled !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'silentModeEnabled must be a boolean'
        });
      }

      user.safetySettings.silentModeEnabled =
        silentModeEnabled;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Safety settings updated successfully',
      data: {
        safetySettings: user.safetySettings
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateSettings
};