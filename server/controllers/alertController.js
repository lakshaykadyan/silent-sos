const crypto = require('crypto');

const Alert = require('../models/Alert');
const LocationUpdate = require('../models/LocationUpdate');
const AlertActivity = require('../models/AlertActivity');
const EmergencyContact = require('../models/EmergencyContact');

const {
  notifyEmergencyContacts
} = require('../services/notificationService');

const ACTIVE_ALERT_STATUSES = [
  'ACTIVATING',
  'ACTIVE',
  'ACKNOWLEDGED',
  'RESOLVING'
];

const generateAlertId = () => {
  return `SOS-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
};

const validateLocation = ({
  latitude,
  longitude,
  accuracy,
  requireAccuracy = false
}) => {
  if (
    typeof latitude !== 'number' ||
    !Number.isFinite(latitude)
  ) {
    return 'Latitude must be a valid number';
  }

  if (latitude < -90 || latitude > 90) {
    return 'Latitude must be between -90 and 90';
  }

  if (
    typeof longitude !== 'number' ||
    !Number.isFinite(longitude)
  ) {
    return 'Longitude must be a valid number';
  }

  if (longitude < -180 || longitude > 180) {
    return 'Longitude must be between -180 and 180';
  }

  if (
    requireAccuracy &&
    (
      typeof accuracy !== 'number' ||
      !Number.isFinite(accuracy)
    )
  ) {
    return 'Accuracy must be a valid number';
  }

  if (
    accuracy !== undefined &&
    accuracy !== null &&
    (
      typeof accuracy !== 'number' ||
      !Number.isFinite(accuracy)
    )
  ) {
    return 'Accuracy must be a valid number';
  }

  if (
    accuracy !== undefined &&
    accuracy !== null &&
    accuracy < 0
  ) {
    return 'Accuracy cannot be negative';
  }

  return null;
};

const createAlert = async (req, res, next) => {
  try {
    const {
      latitude,
      longitude,
      accuracy
    } = req.body;

    const locationError = validateLocation({
      latitude,
      longitude,
      accuracy
    });

    if (locationError) {
      return res.status(400).json({
        success: false,
        message: locationError
      });
    }

    const activeAlert = await Alert.findOne({
      userId: req.user._id,
      status: {
        $in: ACTIVE_ALERT_STATUSES
      }
    });

    if (activeAlert) {
      return res.status(409).json({
        success: false,
        message: 'An active SOS alert already exists',
        data: {
          alert: activeAlert
        }
      });
    }

    const alert = await Alert.create({
      alertId: generateAlertId(),
      userId: req.user._id,
      status: 'ACTIVATING',
      triggerTime: new Date(),

      initialLocation: {
        latitude,
        longitude,
        accuracy
      },

      currentLocation: {
        latitude,
        longitude,
        accuracy
      },

      lastLocationUpdate: new Date()
    });

    await AlertActivity.create({
      alertId: alert._id,
      actorId: req.user._id,
      actorType: 'USER',
      action: 'SOS_TRIGGERED',

      metadata: {
        latitude,
        longitude,
        accuracy
      }
    });

    const contacts = await EmergencyContact.find({
      userId: req.user._id,
      isActive: true
    }).sort({
      priority: 1
    });

    const notificationResult =
      await notifyEmergencyContacts({
        contacts,
        alert
      });

    alert.status = 'ACTIVE';

    await alert.save();

    return res.status(201).json({
      success: true,
      message: 'SOS alert activated successfully',

      data: {
        alert,
        contactsNotified:
          notificationResult.successfulNotifications,
        notificationResult
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getActiveAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOne({
      userId: req.user._id,
      status: {
        $in: ACTIVE_ALERT_STATUSES
      }
    }).sort({
      triggerTime: -1
    });

    return res.status(200).json({
      success: true,

      data: {
        alert
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getAlertHistory = async (req, res, next) => {
  try {
    const alerts = await Alert.find({
      userId: req.user._id
    }).sort({
      triggerTime: -1
    });

    return res.status(200).json({
      success: true,

      data: {
        alerts
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getAlertById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    const activities = await AlertActivity.find({
      alertId: alert._id
    }).sort({
      timestamp: 1
    });

    return res.status(200).json({
      success: true,

      data: {
        alert,
        activities
      }
    });
  } catch (error) {
    return next(error);
  }
};

const updateAlertLocation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      latitude,
      longitude,
      accuracy,
      source
    } = req.body;

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const locationError = validateLocation({
      latitude,
      longitude,
      accuracy,
      requireAccuracy: false
    });

    if (locationError) {
      return res.status(400).json({
        success: false,
        message: locationError
      });
    }

    const alert = await Alert.findOne({
      _id: id,
      userId: req.user._id,
      status: {
        $in: ACTIVE_ALERT_STATUSES
      }
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Active alert not found'
      });
    }

    const allowedSources = [
      'GPS',
      'NETWORK',
      'MANUAL'
    ];

    const locationSource = source || 'GPS';

    if (!allowedSources.includes(locationSource)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location source'
      });
    }

    const locationUpdate =
      await LocationUpdate.create({
        alertId: alert._id,
        latitude,
        longitude,
        accuracy,
        source: locationSource
      });

    alert.currentLocation = {
      latitude,
      longitude,
      accuracy
    };

    alert.lastLocationUpdate =
      locationUpdate.timestamp;

    await alert.save();

    await AlertActivity.create({
      alertId: alert._id,
      actorId: req.user._id,
      actorType: 'USER',
      action: 'LOCATION_UPDATED',

      metadata: {
        latitude,
        longitude,
        accuracy,
        source: locationSource
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Alert location updated successfully',

      data: {
        location: locationUpdate
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getAlertLocationHistory = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    const locations = await LocationUpdate.find({
      alertId: alert._id
    }).sort({
      timestamp: 1
    });

    return res.status(200).json({
      success: true,

      data: {
        alertId: alert._id,
        locations
      }
    });
  } catch (error) {
    return next(error);
  }
};

const acknowledgeAlert = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findOne({
      _id: id,
      userId: req.user._id,
      status: 'ACTIVE'
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Active alert not found'
      });
    }

    alert.status = 'ACKNOWLEDGED';
    alert.responseTime = new Date();

    await alert.save();

    await AlertActivity.create({
      alertId: alert._id,
      actorId: req.user._id,
      actorType: 'USER',
      action: 'ACKNOWLEDGED',

      metadata: {
        responseTime: alert.responseTime
      }
    });

    return res.status(200).json({
      success: true,
      message: 'SOS alert acknowledged successfully',

      data: {
        alert
      }
    });
  } catch (error) {
    return next(error);
  }
};

const resolveAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolutionNote } = req.body;

    const alert = await Alert.findOne({
      _id: id,
      userId: req.user._id,

      status: {
        $in: [
          'ACTIVE',
          'ACKNOWLEDGED',
          'RESOLVING'
        ]
      }
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Active alert not found'
      });
    }

    if (
      resolutionNote !== undefined &&
      typeof resolutionNote !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Resolution note must be a string'
      });
    }

    if (
      typeof resolutionNote === 'string' &&
      resolutionNote.trim().length > 500
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Resolution note cannot exceed 500 characters'
      });
    }

    alert.status = 'RESOLVING';

    await alert.save();

    await AlertActivity.create({
      alertId: alert._id,
      actorId: req.user._id,
      actorType: 'USER',
      action: 'RESOLVING',
      metadata: {}
    });

    alert.status = 'RESOLVED';

    alert.resolvedAt = new Date();

    alert.resolutionNote =
      resolutionNote
        ? resolutionNote.trim()
        : '';

    await alert.save();

    await AlertActivity.create({
      alertId: alert._id,
      actorId: req.user._id,
      actorType: 'USER',
      action: 'RESOLVED',

      metadata: {
        resolutionNote: alert.resolutionNote
      }
    });

    return res.status(200).json({
      success: true,
      message: 'SOS alert resolved successfully',

      data: {
        alert
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createAlert,
  getActiveAlert,
  getAlertHistory,
  getAlertById,
  updateAlertLocation,
  getAlertLocationHistory,
  acknowledgeAlert,
  resolveAlert
};