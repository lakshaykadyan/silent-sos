import {
  useEffect,
  useState
} from 'react';

import {
  FiBell,
  FiCheck,
  FiMapPin,
  FiShield,
  FiVolumeX
} from 'react-icons/fi';

import BackButton from '../components/common/BackButton';

import '../styles/pages/settings.css';

import {
  getProfile,
  updateSettings
} from '../services/userService';

function Settings() {
  const [settings, setSettings] = useState({
    locationSharingEnabled: true,
    silentModeEnabled: true
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const result = await getProfile();
        const user = result?.data?.user;

        if (!user) {
          throw new Error(
            'Unable to load your safety settings.'
          );
        }

        setSettings({
          locationSharingEnabled:
            user.safetySettings
              ?.locationSharingEnabled ?? true,

          silentModeEnabled:
            user.safetySettings
              ?.silentModeEnabled ?? true
        });
      } catch (error) {
        setErrorMessage(
          error.message ||
          'Unable to load your safety settings.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleToggle = (settingName) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [settingName]:
        !currentSettings[settingName]
    }));

    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await updateSettings(
        settings
      );

      const updatedSettings =
        result?.data?.safetySettings;

      if (updatedSettings) {
        setSettings({
          locationSharingEnabled:
            updatedSettings
              .locationSharingEnabled ?? true,

          silentModeEnabled:
            updatedSettings
              .silentModeEnabled ?? true
        });
      }

      setSuccessMessage(
        'Your safety settings have been updated successfully.'
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
        'Unable to update your safety settings.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="settings-page">
        <div className="page-container">
          <div className="settings-state">
            <div
              className="settings-state__loader"
              aria-hidden="true"
            />

            <p>
              Loading your safety settings...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="settings-page">
      <div className="page-container settings-main">
        <div className="settings-back">
          <BackButton />
        </div>

        <header className="settings-header">
          <div>
            <p className="settings-eyebrow">
              SAFETY SETTINGS
            </p>

            <h1>
              Safety preferences
            </h1>

            <p>
              Control how Silent SOS handles
              location sharing and silent emergency
              behaviour.
            </p>
          </div>

          <div className="settings-header__icon">
            <FiShield
              aria-hidden="true"
            />
          </div>
        </header>

        {errorMessage && (
          <div
            className="settings-message settings-message--error"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            className="settings-message settings-message--success"
            role="status"
          >
            <FiCheck
              aria-hidden="true"
            />

            {successMessage}
          </div>
        )}

        <section className="settings-card">
          <div className="settings-card__header">
            <div>
              <p className="settings-card__eyebrow">
                EMERGENCY BEHAVIOUR
              </p>

              <h2>
                Alert preferences
              </h2>

              <p>
                These preferences affect how your
                emergency alerts operate.
              </p>
            </div>
          </div>

          <div className="settings-options">
            <article className="settings-option">
              <div className="settings-option__icon">
                <FiMapPin
                  aria-hidden="true"
                />
              </div>

              <div className="settings-option__content">
                <h3>
                  Location sharing
                </h3>

                <p>
                  Allow Silent SOS to share your
                  location during an active emergency
                  alert.
                </p>
              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  settings.locationSharingEnabled
                    ? 'settings-toggle--active'
                    : ''
                }`}
                onClick={() =>
                  handleToggle(
                    'locationSharingEnabled'
                  )
                }
                disabled={isSaving}
                aria-pressed={
                  settings.locationSharingEnabled
                }
                aria-label={`Location sharing ${
                  settings.locationSharingEnabled
                    ? 'enabled'
                    : 'disabled'
                }`}
              >
                <span />
              </button>
            </article>

            <article className="settings-option">
              <div className="settings-option__icon">
                <FiVolumeX
                  aria-hidden="true"
                />
              </div>

              <div className="settings-option__content">
                <h3>
                  Silent emergency mode
                </h3>

                <p>
                  Keep emergency activation discreet
                  without relying on audible alerts.
                </p>
              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  settings.silentModeEnabled
                    ? 'settings-toggle--active'
                    : ''
                }`}
                onClick={() =>
                  handleToggle(
                    'silentModeEnabled'
                  )
                }
                disabled={isSaving}
                aria-pressed={
                  settings.silentModeEnabled
                }
                aria-label={`Silent emergency mode ${
                  settings.silentModeEnabled
                    ? 'enabled'
                    : 'disabled'
                }`}
              >
                <span />
              </button>
            </article>

            <article className="settings-option">
              <div className="settings-option__icon">
                <FiBell
                  aria-hidden="true"
                />
              </div>

              <div className="settings-option__content">
                <h3>
                  Emergency notifications
                </h3>

                <p>
                  Your configured emergency contacts
                  can receive in-app emergency alert
                  notifications when an SOS is activated.
                </p>

                <span className="settings-option__status">
                  Managed through Contacts
                </span>
              </div>
            </article>
          </div>
        </section>

        <section className="settings-info-card">
          <div className="settings-info-card__icon">
            <FiShield
              aria-hidden="true"
            />
          </div>

          <div>
            <h2>
              Your safety comes first
            </h2>

            <p>
              Location data is used to support active
              emergency alerts. Keep location sharing
              enabled if you want your emergency
              location to be available during an SOS.
            </p>
          </div>
        </section>

        <div className="settings-footer">
          <p>
            Changes are saved to your Silent SOS
            safety account.
          </p>

          <button
            type="button"
            className="settings-save-button"
            onClick={handleSave}
            disabled={isSaving}
          >
            <FiCheck
              aria-hidden="true"
            />

            {isSaving
              ? 'Saving...'
              : 'Save settings'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default Settings;