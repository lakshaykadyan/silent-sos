const Notification = require('../models/Notification');

const sendInAppNotification = async ({
  contact,
  alert
}) => {
  const notification = await Notification.create({
    recipientContactId: contact._id,
    alertId: alert._id,
    type: 'EMERGENCY_ALERT',
    channel: 'IN_APP',
    title: 'Emergency SOS Alert',
    message: 'An emergency SOS alert has been activated by your emergency contact.',
    metadata: {
      alertId: alert.alertId,
      latitude: alert.currentLocation?.latitude,
      longitude: alert.currentLocation?.longitude,
      accuracy: alert.currentLocation?.accuracy
    }
  });

  return {
    success: true,
    type: 'IN_APP',
    contactId: contact._id,
    notificationId: notification._id,
    alertId: alert._id,
    message: 'Emergency alert notification created successfully'
  };
};

const notifyEmergencyContacts = async ({
  contacts,
  alert
}) => {
  const results = [];

  for (const contact of contacts) {
    if (!contact.isActive) {
      continue;
    }

    const result = await sendInAppNotification({
      contact,
      alert
    });

    results.push(result);
  }

  return {
    totalContacts: contacts.length,
    successfulNotifications: results.filter(
      (result) => result.success
    ).length,
    results
  };
};

module.exports = {
  sendInAppNotification,
  notifyEmergencyContacts
};