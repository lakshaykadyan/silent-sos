import {
  useEffect,
  useState
} from 'react';

import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiRefreshCw,
  FiShield
} from 'react-icons/fi';

import {
  useLocation,
  useNavigate
} from 'react-router-dom';

import BackButton from '../../components/common/BackButton';
import '../../styles/pages/admin-alerts.css';

const API_BASE_URL =
  'http://localhost:5000/api';

const getAlertsEndpoint = (filter) => {
  switch (filter) {
    case 'active':
      return `${API_BASE_URL}/admin/alerts/active`;

    case 'resolved':
      return `${API_BASE_URL}/admin/alerts?status=RESOLVED`;

    case 'total':
    default:
      return `${API_BASE_URL}/admin/alerts`;
  }
};

function AdminAlerts() {
  const navigate = useNavigate();
  const location = useLocation();

  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const filter =
    new URLSearchParams(location.search).get(
      'filter'
    ) || 'total';

  const alertsEndpoint =
    getAlertsEndpoint(filter);

  const fetchAlerts = async () => {
    try {
      setErrorMessage('');

      const token =
        localStorage.getItem('token');

      if (!token) {
        throw new Error(
          'Your session has expired. Please sign in again.'
        );
      }

      const response = await fetch(
        alertsEndpoint,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          'Unable to load alerts.'
        );
      }

      setAlerts(
        result?.data?.alerts ||
        []
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
        'Unable to load alerts.'
      );
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadAlerts = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const token =
          localStorage.getItem('token');

        if (!token) {
          throw new Error(
            'Your session has expired. Please sign in again.'
          );
        }

        const response = await fetch(
          alertsEndpoint,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
            'Unable to load alerts.'
          );
        }

        if (isMounted) {
          setAlerts(
            result?.data?.alerts ||
            []
          );
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.message ||
            'Unable to load alerts.'
          );

          setAlerts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAlerts();

    return () => {
      isMounted = false;
    };
  }, [alertsEndpoint]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    await fetchAlerts();

    setIsRefreshing(false);
  };

  const handleAlertClick = (alert) => {
    const alertId =
      alert?._id;

    if (!alertId) {
      return;
    }

    navigate(
      `/admin/alerts/${alertId}`
    );
  };

  const handleAlertKeyDown = (
    event,
    alert
  ) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();

      handleAlertClick(alert);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'admin-alert-status admin-alert-status--active';

      case 'ACKNOWLEDGED':
        return 'admin-alert-status admin-alert-status--acknowledged';

      case 'RESOLVING':
        return 'admin-alert-status admin-alert-status--resolving';

      case 'RESOLVED':
        return 'admin-alert-status admin-alert-status--resolved';

      default:
        return 'admin-alert-status';
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return 'Not available';
    }

    return new Date(
      date
    ).toLocaleString();
  };

  const getPageTitle = () => {
    switch (filter) {
      case 'active':
        return 'Active alerts';

      case 'resolved':
        return 'Resolved alerts';

      case 'total':
      default:
        return 'All alerts';
    }
  };

  const getPageDescription = () => {
    switch (filter) {
      case 'active':
        return 'Review emergency alerts that currently require administrative attention.';

      case 'resolved':
        return 'Review emergency alerts that have been successfully resolved.';

      case 'total':
      default:
        return 'Review all emergency alerts across the Silent SOS platform.';
    }
  };

  const getEmptyTitle = () => {
    switch (filter) {
      case 'active':
        return 'No active alerts';

      case 'resolved':
        return 'No resolved alerts';

      case 'total':
      default:
        return 'No emergency alerts found';
    }
  };

  const getEmptyDescription = () => {
    switch (filter) {
      case 'active':
        return 'There are currently no active emergency alerts requiring administrative attention.';

      case 'resolved':
        return 'There are currently no resolved emergency alerts to review.';

      case 'total':
      default:
        return 'There are currently no alerts available for administrative review.';
    }
  };

  if (isLoading) {
    return (
      <main className="admin-page">
        <div className="page-container">
          <div className="admin-state">
            <div
              className="admin-state__loader"
              aria-hidden="true"
            />

            <p>
              Loading emergency alerts...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="page-container admin-main">
        <div className="admin-alerts-back">
          <BackButton
            fallback="/admin/dashboard"
            label="Back to dashboard"
          />
        </div>

        <header className="admin-page-header">
          <div>
            <p className="admin-eyebrow">
              EMERGENCY MONITORING
            </p>

            <h1>
              {getPageTitle()}
            </h1>

            <p>
              {getPageDescription()}
            </p>
          </div>

          <button
            type="button"
            className="admin-alerts-refresh"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <FiRefreshCw
              aria-hidden="true"
            />

            {isRefreshing
              ? 'Refreshing...'
              : 'Refresh'}
          </button>
        </header>

        {errorMessage && (
          <div
            className="admin-message admin-message--error"
            role="alert"
          >
            <FiAlertCircle
              aria-hidden="true"
            />

            <span>
              {errorMessage}
            </span>
          </div>
        )}

        <section className="admin-alerts-summary">
          <div className="admin-alerts-summary__icon">
            <FiShield
              aria-hidden="true"
            />
          </div>

          <div>
            <span>
              {getPageTitle()}
            </span>

            <strong>
              {alerts.length}
            </strong>
          </div>
        </section>

        {alerts.length === 0 ? (
          <section className="admin-empty-state">
            <div className="admin-empty-state__icon">
              <FiCheckCircle
                aria-hidden="true"
              />
            </div>

            <h2>
              {getEmptyTitle()}
            </h2>

            <p>
              {getEmptyDescription()}
            </p>
          </section>
        ) : (
          <section className="admin-alerts-list">
            {alerts.map((alert) => (
              <article
                key={
                  alert._id ||
                  alert.alertId
                }
                className="admin-alert-card admin-alert-card--clickable"
                role="button"
                tabIndex={0}
                onClick={() =>
                  handleAlertClick(alert)
                }
                onKeyDown={(event) =>
                  handleAlertKeyDown(
                    event,
                    alert
                  )
                }
                aria-label={`View details for ${
                  alert.alertId ||
                  'emergency alert'
                }`}
              >
                <div className="admin-alert-card__top">
                  <div className="admin-alert-card__icon">
                    <FiAlertCircle
                      aria-hidden="true"
                    />
                  </div>

                  <div className="admin-alert-card__heading">
                    <span>
                      Alert
                    </span>

                    <h2>
                      {alert.alertId ||
                        alert._id ||
                        'Emergency Alert'}
                    </h2>
                  </div>

                  <span
                    className={getStatusClass(
                      alert.status
                    )}
                  >
                    {alert.status ||
                      'UNKNOWN'}
                  </span>
                </div>

                <div className="admin-alert-card__details">
                  <div>
                    <FiClock
                      aria-hidden="true"
                    />

                    <span>
                      {formatDate(
                        alert.triggerTime ||
                        alert.createdAt
                      )}
                    </span>
                  </div>

                  <div>
                    <FiMapPin
                      aria-hidden="true"
                    />

                    <span>
                      {alert.currentLocation
                        ? `${alert.currentLocation.latitude}, ${alert.currentLocation.longitude}`
                        : alert.initialLocation
                          ? `${alert.initialLocation.latitude}, ${alert.initialLocation.longitude}`
                          : 'Location unavailable'}
                    </span>
                  </div>
                </div>

                <div className="admin-alert-card__footer">
                  <span>
                    User ID
                  </span>

                  <strong>
                    {alert.userId?._id ||
                      alert.userId ||
                      'Unavailable'}
                  </strong>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default AdminAlerts;