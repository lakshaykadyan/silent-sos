const Notification = require('../models/Notification');
const EmergencyContact = require('../models/EmergencyContact');

const getAuthorizedContactIds = async (userId) => {
  const contacts = await EmergencyContact.find({
    userId,
    isActive: true
  }).select('_id');

  return contacts.map((contact) => contact._id);
};

const getNotifications = async (req, res, next) => {
  try {
    const contactIds = await getAuthorizedContactIds(
      req.user._id
    );

    const notifications = await Notification.find({
      recipientContactId: {
        $in: contactIds
      }
    }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      data: {
        notifications
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getUnreadNotifications = async (req, res, next) => {
  try {
    const contactIds = await getAuthorizedContactIds(
      req.user._id
    );

    const notifications = await Notification.find({
      recipientContactId: {
        $in: contactIds
      },
      isRead: false
    }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      data: {
        notifications
      }
    });
  } catch (error) {
    return next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contactIds = await getAuthorizedContactIds(
      req.user._id
    );

    const notification = await Notification.findOne({
      _id: id,
      recipientContactId: {
        $in: contactIds
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();

      await notification.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: {
        notification
      }
    });
  } catch (error) {
    return next(error);
  }
};

const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const contactIds = await getAuthorizedContactIds(
      req.user._id
    );

    await Notification.updateMany(
      {
        recipientContactId: {
          $in: contactIds
        },
        isRead: false
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
};