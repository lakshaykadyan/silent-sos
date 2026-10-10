import {
  useEffect,
  useState
} from 'react';

import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUsers
} from 'react-icons/fi';

import Header from '../components/common/Header';
import SOSButton from '../components/sos/SOSButton';
import useAuth from '../hooks/useAuth';
import useAlertLocationTracking
  from '../hooks/useAlertLocationTracking';

import {
  createAlert,
  getActiveAlert
} from '../services/alertService';

function Dashboard() {
  const {
    user
  } = useAuth();

  const [
    isLoadingAlert,
    setIsLoadingAlert
  ] = useState(true);

  const [
    isActivating,
    setIsActivating
  ] = useState(false);

  const [
    activeAlert,
    setActiveAlert
  ] = useState(null);

  const [
    errorMessage,
    setErrorMessage
  ] = useState('');

  const [
    successMessage,
    setSuccessMessage
  ] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadActiveAlert = async () => {
      try {
        const result = await getActiveAlert();

        if (!isMounted) {
          return;
        }

        const alert =
          result?.data?.alert || null;

        setActiveAlert(alert);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error.message ||
          'Unable to load your active alert.'
        );
      } finally {
        if (isMounted) {
          setIsLoadingAlert(false);
        }
      }
    };

    loadActiveAlert();

    return () => {
      isMounted = false;
    };
  }, []);

  useAlertLocationTracking(
    activeAlert?._id,
    activeAlert?.status === 'ACTIVE'
  );

  const handleSOSActivate = () => {
    if (isActivating || activeAlert) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsActivating(true);

    if (!navigator.geolocation) {
      setErrorMessage(
        'Location services are not available in this browser.'
      );

      setIsActivating(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };

          const result = await createAlert(
            location
          );

          const alert =
            result?.data?.alert || null;

          setActiveAlert(alert);
        } catch (error) {
          setErrorMessage(
            error.message ||
            'Unable to activate the emergency alert.'
          );
        } finally {
          setIsActivating(false);
        }
      },
      (error) => {
        let message =
          'Unable to access your location.';

        if (error.code === 1) {
          message =
            'Location permission was denied. Please allow location access to activate SOS.';
        }

        if (error.code === 2) {
          message =
            'Your location is currently unavailable. Please try again.';
        }

        if (error.code === 3) {
          message =
            'Location request timed out. Please try again.';
        }

        setErrorMessage(message);
        setIsActivating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const isAlertActive =
    activeAlert?.status === 'ACTIVE' ||
    activeAlert?.status === 'ACKNOWLEDGED' ||
    activeAlert?.status === 'RESOLVING';

  if (isLoadingAlert) {
    return (
      <div className="dashboard-page">
        <Header />

        <main className="dashboard-main">
          <div className="page-container">
            <div className="dashboard-loading">
              Loading your safety status...
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Header />

      <main className="dashboard-main">
        <div className="page-container">
          <section className="dashboard-header">
            <div>
              <p className="dashboard-eyebrow">
                Personal safety
              </p>

              <h1>
                Welcome back, {user?.name || 'User'}
              </h1>

              <p>
                Your safety controls are ready when
                you need them.
              </p>
            </div>

            <div
              className={`dashboard-status ${
                isAlertActive
                  ? 'dashboard-status--active'
                  : ''
              }`}
            >
              <span className="dashboard-status__dot" />

              <span>
                {isAlertActive
                  ? 'Emergency alert active'
                  : 'Safety system ready'}
              </span>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="dashboard-card dashboard-card--sos">
              <div className="dashboard-card__header">
                <div>
                  <p className="dashboard-card__eyebrow">
                    Emergency alert
                  </p>

                  <h2>
                    {isAlertActive
                      ? 'Alert active'
                      : 'Silent SOS'}
                  </h2>
                </div>

                <span className="dashboard-card__icon">
                  <FiShield aria-hidden="true" />
                </span>
              </div>

              <div className="sos-area">
                {isAlertActive ? (
                  <div className="sos-active-state">
                    <div className="sos-active-state__icon">
                      <FiAlertCircle
                        aria-hidden="true"
                      />
                    </div>

                    <strong>
                      Emergency alert is active
                    </strong>

                    <span>
                      Your alert is active and your
                      location is being updated.
                    </span>

                    <span className="sos-location-status">
                      <FiMapPin aria-hidden="true" />
                      Live location tracking enabled
                    </span>
                  </div>
                ) : (
                  <>
                    <SOSButton
                      onActivate={handleSOSActivate}
                      disabled={isActivating}
                    />

                    <div className="sos-area__text">
                      <strong>
                        {isActivating
                          ? 'Getting your location...'
                          : 'Press and hold to activate'}
                      </strong>

                      <span>
                        Hold the SOS button to share your
                        current location with your
                        emergency contacts.
                      </span>
                    </div>
                  </>
                )}
              </div>

              {errorMessage && (
                <div className="dashboard-notice dashboard-notice--error">
                  <FiAlertCircle
                    aria-hidden="true"
                  />

                  <span>
                    {errorMessage}
                  </span>
                </div>
              )}

              {successMessage && (
                <div className="dashboard-notice dashboard-notice--success">
                  <FiCheckCircle
                    aria-hidden="true"
                  />

                  <span>
                    {successMessage}
                  </span>
                </div>
              )}
            </div>

            <div className="dashboard-side">
              <div className="dashboard-card dashboard-card--status">
                <div className="dashboard-card__header">
                  <div>
                    <p className="dashboard-card__eyebrow">
                      Safety overview
                    </p>

                    <h2>
                      {isAlertActive
                        ? 'Responding'
                        : 'Ready to respond'}
                    </h2>
                  </div>

                  <span className="dashboard-card__icon dashboard-card__icon--safe">
                    <FiShield aria-hidden="true" />
                  </span>
                </div>

                <div className="dashboard-stat-list">
                  <div className="dashboard-stat">
                    <span>
                      <FiMapPin aria-hidden="true" />
                      Location
                    </span>

                    <strong>
                      {isAlertActive
                        ? 'Tracking'
                        : 'Available'}
                    </strong>
                  </div>

                  <div className="dashboard-stat">
                    <span>
                      <FiUsers aria-hidden="true" />
                      Trusted contacts
                    </span>

                    <strong>
                      Ready
                    </strong>
                  </div>

                  <div className="dashboard-stat">
                    <span>
                      <FiClock aria-hidden="true" />
                      Active alert
                    </span>

                    <strong>
                      {isAlertActive
                        ? 'Active'
                        : 'None'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="dashboard-card dashboard-card--help">
                <div className="dashboard-card__icon">
                  <FiPhone aria-hidden="true" />
                </div>

                <div>
                  <h3>
                    Need help?
                  </h3>

                  <p>
                    Configure trusted contacts before
                    using Silent SOS.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-info-grid">
            <div className="dashboard-info-card">
              <span className="dashboard-info-card__number">
                01
              </span>

              <div>
                <h3>
                  Configure contacts
                </h3>

                <p>
                  Add the people who should receive
                  your emergency alerts.
                </p>
              </div>
            </div>

            <div className="dashboard-info-card">
              <span className="dashboard-info-card__number">
                02
              </span>

              <div>
                <h3>
                  Allow location access
                </h3>

                <p>
                  Location sharing helps trusted
                  contacts understand where you are.
                </p>
              </div>
            </div>

            <div className="dashboard-info-card">
              <span className="dashboard-info-card__number">
                03
              </span>

              <div>
                <h3>
                  Activate when needed
                </h3>

                <p>
                  Hold Silent SOS when speaking or
                  calling is not possible.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;