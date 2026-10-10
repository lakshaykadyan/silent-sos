import {
  useState
} from 'react';

import {
  FiMail,
  FiPhone,
  FiSave,
  FiUser,
  FiUsers,
  FiX
} from 'react-icons/fi';

const getInitialFormData = (contact) => ({
  name: contact?.name || '',
  phone: contact?.phone || '',
  email: contact?.email || '',
  relationship: contact?.relationship || '',
  priority: contact?.priority || 1,
  notificationPreferences: {
    sms:
      contact?.notificationPreferences?.sms ??
      true,
    email:
      contact?.notificationPreferences?.email ??
      true,
    inApp:
      contact?.notificationPreferences?.inApp ??
      true
  }
});

function ContactForm({
  contact,
  onSubmit,
  onCancel,
  isSaving
}) {
  const isEditing = Boolean(contact);

  const [
    formData,
    setFormData
  ] = useState(() =>
    getInitialFormData(contact)
  );

  const [
    errorMessage,
    setErrorMessage
  ] = useState('');

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handlePriorityChange = (event) => {
    setFormData((currentData) => ({
      ...currentData,
      priority: Number(event.target.value)
    }));

    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleNotificationChange = (
    event
  ) => {
    const {
      name,
      checked
    } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      notificationPreferences: {
        ...currentData.notificationPreferences,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();

    if (!name) {
      setErrorMessage(
        'Contact name is required.'
      );
      return;
    }

    if (name.length < 2) {
      setErrorMessage(
        'Contact name must be at least 2 characters long.'
      );
      return;
    }

    if (!phone && !email) {
      setErrorMessage(
        'Add at least a phone number or email address.'
      );
      return;
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setErrorMessage(
        'Enter a valid email address.'
      );
      return;
    }

    if (
      !Number.isInteger(formData.priority) ||
      formData.priority < 1 ||
      formData.priority > 10
    ) {
      setErrorMessage(
        'Priority must be between 1 and 10.'
      );
      return;
    }

    setErrorMessage('');

    await onSubmit({
      name,
      phone,
      email,
      relationship:
        formData.relationship.trim(),
      priority: formData.priority,
      notificationPreferences:
        formData.notificationPreferences
    });
  };

  return (
    <section className="contact-form-card">
      <div className="contact-form-card__header">
        <div>
          <p className="dashboard-card__eyebrow">
            {isEditing
              ? 'Update contact'
              : 'Trusted network'}
          </p>

          <h2>
            {isEditing
              ? 'Edit emergency contact'
              : 'Add emergency contact'}
          </h2>

          <p>
            Configure who should receive your emergency
            notifications.
          </p>
        </div>

        <button
          type="button"
          className="contact-form-card__close"
          onClick={onCancel}
          disabled={isSaving}
          aria-label="Close contact form"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>

      <form
        className="contact-form"
        onSubmit={handleSubmit}
      >
        {errorMessage && (
          <div
            className="contact-form__error"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <div className="contact-form__grid">
          <div className="contact-form__field">
            <label htmlFor="contact-name">
              Full name
            </label>

            <div className="contact-form__input-wrap">
              <FiUser aria-hidden="true" />

              <input
                id="contact-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter contact name"
                maxLength={100}
                autoComplete="name"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="contact-form__field">
            <label htmlFor="contact-relationship">
              Relationship
            </label>

            <div className="contact-form__input-wrap">
              <FiUsers aria-hidden="true" />

              <input
                id="contact-relationship"
                name="relationship"
                type="text"
                value={formData.relationship}
                onChange={handleChange}
                placeholder="e.g. Parent, Friend"
                maxLength={50}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="contact-form__field">
            <label htmlFor="contact-phone">
              Phone number
            </label>

            <div className="contact-form__input-wrap">
              <FiPhone aria-hidden="true" />

              <input
                id="contact-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                autoComplete="tel"
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="contact-form__field">
            <label htmlFor="contact-email">
              Email address
            </label>

            <div className="contact-form__input-wrap">
              <FiMail aria-hidden="true" />

              <input
                id="contact-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                autoComplete="email"
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-priority">
            Priority
          </label>

          <select
            id="contact-priority"
            name="priority"
            value={formData.priority}
            onChange={handlePriorityChange}
            disabled={isSaving}
          >
            <option value={1}>
              1 — Primary
            </option>

            <option value={2}>
              2 — Secondary
            </option>

            <option value={3}>
              3 — Priority 3
            </option>

            <option value={4}>
              4 — Priority 4
            </option>

            <option value={5}>
              5 — Priority 5
            </option>

            <option value={6}>
              6 — Priority 6
            </option>

            <option value={7}>
              7 — Priority 7
            </option>

            <option value={8}>
              8 — Priority 8
            </option>

            <option value={9}>
              9 — Priority 9
            </option>

            <option value={10}>
              10 — Priority 10
            </option>
          </select>
        </div>

        <fieldset className="contact-form__preferences">
          <legend>
            Notification preferences
          </legend>

          <label className="contact-form__checkbox">
            <input
              type="checkbox"
              name="sms"
              checked={
                formData.notificationPreferences.sms
              }
              onChange={
                handleNotificationChange
              }
              disabled={isSaving}
            />

            <span>
              SMS notifications
            </span>
          </label>

          <label className="contact-form__checkbox">
            <input
              type="checkbox"
              name="email"
              checked={
                formData.notificationPreferences.email
              }
              onChange={
                handleNotificationChange
              }
              disabled={isSaving}
            />

            <span>
              Email notifications
            </span>
          </label>

          <label className="contact-form__checkbox">
            <input
              type="checkbox"
              name="inApp"
              checked={
                formData.notificationPreferences.inApp
              }
              onChange={
                handleNotificationChange
              }
              disabled={isSaving}
            />

            <span>
              In-app notifications
            </span>
          </label>
        </fieldset>

        <div className="contact-form__actions">
          <button
            type="button"
            className="contact-form__cancel"
            onClick={onCancel}
            disabled={isSaving}
          >
            <FiX aria-hidden="true" />

            <span>
              Cancel
            </span>
          </button>

          <button
            type="submit"
            className="contact-form__submit"
            disabled={isSaving}
          >
            <FiSave aria-hidden="true" />

            <span>
              {isSaving
                ? 'Saving...'
                : isEditing
                  ? 'Save changes'
                  : 'Add contact'}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}

export default ContactForm;