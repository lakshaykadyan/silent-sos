import {
  useEffect,
  useState
} from 'react';

import {
  FiCalendar,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiShield,
  FiUser
} from 'react-icons/fi';

import '../styles/pages/profile.css';

import {
  getProfile,
  updateProfile
} from '../services/userService';

import BackButton from '../components/common/BackButton';

function Profile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    address: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const result = await getProfile();
        const user = result?.data?.user;

        if (!user) {
          throw new Error(
            'Unable to load your profile.'
          );
        }

        setProfile(user);

        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          dateOfBirth: user.profile?.dateOfBirth
            ? new Date(user.profile.dateOfBirth)
                .toISOString()
                .split('T')[0]
            : '',
          address: user.profile?.address || ''
        });
      } catch (error) {
        setErrorMessage(
          error.message ||
          'Unable to load your profile.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));

    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();

    if (!name) {
      setErrorMessage(
        'Name is required.'
      );
      return;
    }

    if (name.length < 2) {
      setErrorMessage(
        'Name must be at least 2 characters long.'
      );
      return;
    }

    if (name.length > 100) {
      setErrorMessage(
        'Name cannot exceed 100 characters.'
      );
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await updateProfile({
        name,
        phone,
        dateOfBirth:
          formData.dateOfBirth || null,
        address
      });

      const updatedUser =
        result?.data?.user;

      if (updatedUser) {
        setProfile(updatedUser);

        setFormData({
          name: updatedUser.name || '',
          phone: updatedUser.phone || '',
          dateOfBirth:
            updatedUser.profile?.dateOfBirth
              ? new Date(
                  updatedUser.profile.dateOfBirth
                )
                  .toISOString()
                  .split('T')[0]
              : '',
          address:
            updatedUser.profile?.address || ''
        });
      }

      setSuccessMessage(
        'Your profile has been updated successfully.'
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
        'Unable to update your profile.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="profile-page">
        <div className="page-container">
          <div className="profile-state">
            <div
              className="profile-state__loader"
              aria-hidden="true"
            />

            <p>
              Loading your profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <div className="page-container">
          <div
            className="profile-state profile-state--error"
            role="alert"
          >
            <FiShield
              aria-hidden="true"
            />

            <h2>
              Unable to load profile
            </h2>

            <p>
              {errorMessage ||
                'Please try again later.'}
            </p>

            <BackButton />
          </div>
        </div>
      </main>
    );
  }

  const initials =
    profile.name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part.charAt(0).toUpperCase()
      )
      .join('') || 'U';

  return (
    <main className="profile-page">
      <div className="page-container profile-main">
        <div className="profile-back">
          <BackButton />
        </div>

        <header className="profile-header">
          <div>
            <p className="profile-eyebrow">
              ACCOUNT
            </p>

            <h1>
              Your profile
            </h1>

            <p>
              Manage the personal information
              connected to your Silent SOS account.
            </p>
          </div>

          <div className="profile-status">
            <span className="profile-status__dot" />

            Account active
          </div>
        </header>

        <section className="profile-overview">
          <div className="profile-avatar">
            {initials}
          </div>

          <div className="profile-overview__content">
            <h2>
              {profile.name}
            </h2>

            <p>
              {profile.email}
            </p>

            <span>
              <FiShield
                aria-hidden="true"
              />

              {profile.role === 'ADMIN'
                ? 'Administrator'
                : 'Safety account'}
            </span>
          </div>
        </section>

        <form
          className="profile-form-card"
          onSubmit={handleSubmit}
        >
          <div className="profile-form-card__header">
            <div>
              <p className="profile-card__eyebrow">
                PERSONAL INFORMATION
              </p>

              <h2>
                Profile details
              </h2>

              <p>
                Keep your emergency account
                information up to date.
              </p>
            </div>

            <div className="profile-form-card__icon">
              <FiUser
                aria-hidden="true"
              />
            </div>
          </div>

          {errorMessage && (
            <div
              className="profile-message profile-message--error"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              className="profile-message profile-message--success"
              role="status"
            >
              {successMessage}
            </div>
          )}

          <div className="profile-form-grid">
            <label className="profile-field">
              <span>
                Full name
              </span>

              <div className="profile-field__input">
                <FiUser
                  aria-hidden="true"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={isSaving}
                />
              </div>
            </label>

            <label className="profile-field">
              <span>
                Email address
              </span>

              <div className="profile-field__input profile-field__input--readonly">
                <FiMail
                  aria-hidden="true"
                />

                <input
                  type="email"
                  value={profile.email || ''}
                  readOnly
                  aria-readonly="true"
                />
              </div>

              <small>
                Email address cannot be changed
                here.
              </small>
            </label>

            <label className="profile-field">
              <span>
                Phone number
              </span>

              <div className="profile-field__input">
                <FiPhone
                  aria-hidden="true"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  disabled={isSaving}
                />
              </div>
            </label>

            <label className="profile-field">
              <span>
                Date of birth
              </span>

              <div className="profile-field__input">
                <FiCalendar
                  aria-hidden="true"
                />

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={isSaving}
                />
              </div>
            </label>

            <label className="profile-field profile-field--full">
              <span>
                Address
              </span>

              <div className="profile-field__input">
                <FiMapPin
                  aria-hidden="true"
                />

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="4"
                  autoComplete="street-address"
                  disabled={isSaving}
                />
              </div>
            </label>
          </div>

          <div className="profile-form-card__footer">
            <p>
              Your profile information is used
              to support your safety account.
            </p>

            <button
              type="submit"
              className="profile-save-button"
              disabled={isSaving}
            >
              <FiSave
                aria-hidden="true"
              />

              {isSaving
                ? 'Saving...'
                : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Profile;