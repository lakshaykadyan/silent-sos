const EmergencyContact = require('../models/EmergencyContact');

const getContacts = async (req, res, next) => {
  try {
    const contacts = await EmergencyContact.find({
      userId: req.user._id,
      isActive: true
    }).sort({
      priority: 1,
      createdAt: 1
    });

    return res.status(200).json({
      success: true,
      data: {
        contacts
      }
    });
  } catch (error) {
    return next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      relationship,
      priority,
      notificationPreferences
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Contact name is required'
      });
    }

    if (!phone && !email) {
      return res.status(400).json({
        success: false,
        message: 'Phone or email is required'
      });
    }

    const contact = await EmergencyContact.create({
      userId: req.user._id,
      name: name.trim(),
      phone: phone ? phone.trim() : '',
      email: email ? email.trim().toLowerCase() : '',
      relationship: relationship ? relationship.trim() : '',
      priority: priority || 1,
      notificationPreferences: notificationPreferences || {}
    });

    return res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: {
        contact
      }
    });
  } catch (error) {
    return next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await EmergencyContact.findOne({
      _id: id,
      userId: req.user._id,
      isActive: true
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Emergency contact not found'
      });
    }

    const {
      name,
      phone,
      email,
      relationship,
      priority,
      notificationPreferences
    } = req.body;

    if (name !== undefined) {
      contact.name = name.trim();
    }

    if (phone !== undefined) {
      contact.phone = phone.trim();
    }

    if (email !== undefined) {
      contact.email = email.trim().toLowerCase();
    }

    if (relationship !== undefined) {
      contact.relationship = relationship.trim();
    }

    if (priority !== undefined) {
      contact.priority = priority;
    }

    if (notificationPreferences !== undefined) {
      contact.notificationPreferences = notificationPreferences;
    }

    await contact.save();

    return res.status(200).json({
      success: true,
      message: 'Emergency contact updated successfully',
      data: {
        contact
      }
    });
  } catch (error) {
    return next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await EmergencyContact.findOne({
      _id: id,
      userId: req.user._id,
      isActive: true
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Emergency contact not found'
      });
    }

    contact.isActive = false;

    await contact.save();

    return res.status(200).json({
      success: true,
      message: 'Emergency contact deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact
};