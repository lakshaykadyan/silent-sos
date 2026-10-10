import {
  useEffect,
  useState
} from 'react';

import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiShield
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import { getAlertHistory } from '../services/alertService';

const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return 'Not available';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

const formatLocation = (location) => {
  if (
    !location ||
    typeof location.latitude !== 'number' ||
    typeof location.longitude !== 'number'
  ) {
    return 'Location unavailable';
  }

  return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'Active';

    case 'ACKNOWLEDGED':
      return 'Acknowledged';

    case 'RESOLVING':
      return 'Resolving';

    case 'RESOLVED':
      return 'Resolved';

    case 'ACTIVATING':
      return 'Activating';

    case 'ERROR':
      return 'Error';

    default:
      return status || 'Unknown';
  }
};

const getStatusIcon = (status) => {
  if (status === 'RESOLVED') {
    return (
      <FiCheckCircle
        aria-hidden="true"
      />
    );
  }

  if (status === 'ERROR') {
    return (
      <FiAlertCircle
        aria-hidden="true"
      />
    );
  }

  return (
    <FiShield
      aria-hidden="true"
    />
  );
};

function AlertHistory() {
  const navigate = useNavigate();

  const [
    alerts,
    setAlerts
  ] = useState([]);

  const [
    isLoading,
    setIsLoading
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage
  ] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadAlertHistory = async () => {
      try {
        const result =
          await getAlertHistory();

        if (!isMounted) {
          return;
        }

        const history =
          result?.data?.alerts || [];

        setAlerts(history);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error.message ||
          'Unable to load alert history.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAlertHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAlertOpen = (alertId) => {
    navigate(`/alert-history/${alertId}`);
  };

  const handleAlertKeyDown = (
    event,
    alertId
  ) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      handleAlertOpen(alertId);
    }
  };

  return (
    <div className="dashboard-page">
      <Header />

      <main className="dashboard-main">
        <div className="page-container">
          <div className="alert-history-back">
            <BackButton />
          </div>

          <section className="dashboard-header">
            <div>
              <p className="dashboard-eyebrow">
                Safety records
              </p>

              <h1>
                Alert history
              </h1>

              <p>
                Review your previous emergency alerts
                and their resolution details.
              </p>
            </div>

            <div className="dashboard-status">
              <span className="dashboard-status__dot" />

              <span>
                Personal records
              </span>
            </div>
          </section>

          {isLoading && (
            <section className="history-state">
              <FiClock
                aria-hidden="true"
              />

              <h2>
                Loading alert history
              </h2>

              <p>
                Retrieving your previous safety records.
              </p>
            </section>
          )}

          {!isLoading && errorMessage && (
            <section className="history-state history-state--error">
              <FiAlertCircle
                aria-hidden="true"
              />

              <h2>
                Unable to load history
              </h2>

              <p>
                {errorMessage}
              </p>
            </section>
          )}

          {!isLoading &&
            !errorMessage &&
            alerts.length === 0 && (
              <section className="history-state">
                <FiShield
                  aria-hidden="true"
                />

                <h2>
                  No emergency alerts yet
                </h2>

                <p>
                  Your previous SOS alerts will appear
                  here after you use the emergency system.
                </p>
              </section>
            )}

          {!isLoading &&
            !errorMessage &&
            alerts.length > 0 && (
              <section className="alert-history-list">
                {alerts.map((alert) => (
                  <article
                    className="alert-history-card"
                    key={alert._id}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      handleAlertOpen(
                        alert._id
                      )
                    }
                    onKeyDown={(event) =>
                      handleAlertKeyDown(
                        event,
                        alert._id
                      )
                    }
                    aria-label={`View details for alert ${alert.alertId}`}
                  >
                    <div className="alert-history-card__header">
                      <div>
                        <p className="dashboard-card__eyebrow">
                          Emergency alert
                        </p>

                        <h2>
                          {alert.alertId}
                        </h2>
                      </div>

                      <div
                        className={`alert-history-status alert-history-status--${String(
                          alert.status || ''
                        ).toLowerCase()}`}
                      >
                        {getStatusIcon(
                          alert.status
                        )}

                        <span>
                          {getStatusLabel(
                            alert.status
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="alert-history-details">
                      <div className="alert-history-detail">
                        <span>
                          <FiCalendar
                            aria-hidden="true"
                          />

                          Triggered
                        </span>

                        <strong>
                          {formatDateTime(
                            alert.triggerTime
                          )}
                        </strong>
                      </div>

                      <div className="alert-history-detail">
                        <span>
                          <FiMapPin
                            aria-hidden="true"
                          />

                          Initial location
                        </span>

                        <strong>
                          {formatLocation(
                            alert.initialLocation
                          )}
                        </strong>
                      </div>

                      <div className="alert-history-detail">
                        <span>
                          <FiClock
                            aria-hidden="true"
                          />

                          Last location update
                        </span>

                        <strong>
                          {formatDateTime(
                            alert.lastLocationUpdate
                          )}
                        </strong>
                      </div>

                      <div className="alert-history-detail">
                        <span>
                          <FiCheckCircle
                            aria-hidden="true"
                          />

                          Resolved
                        </span>

                        <strong>
                          {formatDateTime(
                            alert.resolvedAt
                          )}
                        </strong>
                      </div>
                    </div>

                    {alert.resolutionNote && (
                      <div className="alert-history-note">
                        <span>
                          Resolution note
                        </span>

                        <p>
                          {alert.resolutionNote}
                        </p>
                      </div>
                    )}
                  </article>
                ))}
              </section>
            )}
        </div>
      </main>
    </div>
  );
}

export default AlertHistory;