const User = require('../models/User');
const Alert = require('../models/Alert');
const EmergencyContact = require('../models/EmergencyContact');
const LocationUpdate = require('../models/LocationUpdate');
const AlertActivity = require('../models/AlertActivity');

const ACTIVE_ALERT_STATUSES = [
  'ACTIVATING',
  'ACTIVE',
  'ACKNOWLEDGED',
  'RESOLVING'
];

const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalContacts,
      totalAlerts,
      activeAlerts,
      resolvedAlerts
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        isActive: true
      }),

      EmergencyContact.countDocuments({
        isActive: true
      }),

      Alert.countDocuments(),

      Alert.countDocuments({
        status: {
          $in: ACTIVE_ALERT_STATUSES
        }
      }),

      Alert.countDocuments({
        status: 'RESOLVED'
      })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          totalContacts,
          totalAlerts,
          activeAlerts,
          resolvedAlerts
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getAdminAlerts = async (req, res, next) => {
  try {
    const { status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    const alerts = await Alert.find(filter)
      .populate(
        'userId',
        'name email phone role isActive'
      )
      .sort({
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

const getActiveAdminAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({
      status: {
        $in: ACTIVE_ALERT_STATUSES
      }
    })
      .populate(
        'userId',
        'name email phone role isActive'
      )
      .sort({
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

const getAdminAlertById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findById(id).populate(
      'userId',
      'name email phone role isActive'
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    const [activities, locations] = await Promise.all([
      AlertActivity.find({
        alertId: alert._id
      }).sort({
        timestamp: 1
      }),

      LocationUpdate.find({
        alertId: alert._id
      }).sort({
        timestamp: 1
      })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        alert,
        activities,
        locations
      }
    });
  } catch (error) {
    return next(error);
  }
};

const acknowledgeAdminAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findOne({
      _id: id,
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
      actorType: 'ADMIN',
      action: 'ACKNOWLEDGED',
      metadata: {
        responseTime: alert.responseTime
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Alert acknowledged successfully',
      data: {
        alert
      }
    });
  } catch (error) {
    return next(error);
  }
};

const resolveAdminAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { resolutionNote } = req.body;

    const alert = await Alert.findOne({
      _id: id,
      status: {
        $in: [
          'ACKNOWLEDGED',
          'RESOLVING'
        ]
      }
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Acknowledged alert not found'
      });
    }

    if (
      typeof resolutionNote !== 'string' ||
      !resolutionNote.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Resolution note is required'
      });
    }

    const cleanedResolutionNote = resolutionNote.trim();

    alert.status = 'RESOLVING';

    await alert.save();

    await AlertActivity.create({
      alertId: alert._id,
      actorId: req.user._id,
      actorType: 'ADMIN',
      action: 'RESOLVING',
      metadata: {
        resolutionNote: cleanedResolutionNote
      }
    });

    alert.status = 'RESOLVED';
    alert.resolvedAt = new Date();
    alert.resolutionNote = cleanedResolutionNote;

    await alert.save();

    await AlertActivity.create({
      alertId: alert._id,
      actorId: req.user._id,
      actorType: 'ADMIN',
      action: 'RESOLVED',
      metadata: {
        resolutionNote: cleanedResolutionNote,
        resolvedAt: alert.resolvedAt
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Alert resolved successfully',
      data: {
        alert
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      success: true,
      data: {
        users
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAdminAlerts,
  getActiveAdminAlerts,
  getAdminAlertById,
  acknowledgeAdminAlert,
  resolveAdminAlert,
  getAdminUsers
};