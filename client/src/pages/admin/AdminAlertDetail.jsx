import {
  useCallback,
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
  FiUser
} from 'react-icons/fi';

import {
  useParams
} from 'react-router-dom';

import BackButton from '../../components/common/BackButton';
import '../../styles/pages/admin-alert-detail.css';

function AdminAlertDetail() {
  const { id } = useParams();

  const [alertData, setAlertData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [locations, setLocations] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [resolutionNote, setResolutionNote] = useState('');

  const loadAlert = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `https://silent-sos-api-cp9r.onrender.com/api/admin/alerts/${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          'Unable to load alert details.'
        );
      }

      setAlertData(
        result?.data?.alert || null
      );

      setActivities(
        result?.data?.activities || []
      );

      setLocations(
        result?.data?.locations || []
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
        'Unable to load alert details.'
      );
    }
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const loadInitialAlert = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          `https://silent-sos-api-cp9r.onrender.com/api9r.onrender.com/api/admin/alerts/${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
            'Unable to load alert details.'
          );
        }

        if (isMounted) {
          setAlertData(
            result?.data?.alert || null
          );

          setActivities(
            result?.data?.activities || []
          );

          setLocations(
            result?.data?.locations || []
          );
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.message ||
            'Unable to load alert details.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialAlert();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAcknowledge = async () => {
    if (
      !alertData?._id ||
      isProcessing ||
      alertData.status !== 'ACTIVE'
    ) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `https://silent-sos-api-cp9r.onrender.com/api/admin/alerts/${alertData._id}/acknowledge`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          'Unable to acknowledge alert.'
        );
      }

      setSuccessMessage(
        'Emergency alert acknowledged successfully.'
      );

      await loadAlert();
    } catch (error) {
      setErrorMessage(
        error.message ||
        'Unable to acknowledge alert.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolve = async () => {
    if (
      !alertData?._id ||
      isProcessing ||
      !['ACKNOWLEDGED', 'RESOLVING'].includes(
        alertData.status
      )
    ) {
      return;
    }

    const cleanedNote = resolutionNote.trim();

    if (!cleanedNote) {
      setErrorMessage(
        'Please add a resolution note before resolving the alert.'
      );

      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `https://silent-sos-api-cp9r.onrender.com/api/admin/alerts/${alertData._id}/resolve`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            resolutionNote: cleanedNote
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          'Unable to resolve alert.'
        );
      }

      setSuccessMessage(
        'Emergency alert resolved successfully.'
      );

      setResolutionNote('');

      await loadAlert();
    } catch (error) {
      setErrorMessage(
        error.message ||
        'Unable to resolve alert.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return 'Not available';
    }

    return new Date(date).toLocaleString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'admin-detail-status admin-detail-status--active';

      case 'ACKNOWLEDGED':
        return 'admin-detail-status admin-detail-status--acknowledged';

      case 'RESOLVING':
        return 'admin-detail-status admin-detail-status--resolving';

      case 'RESOLVED':
        return 'admin-detail-status admin-detail-status--resolved';

      default:
        return 'admin-detail-status';
    }
  };

  if (isLoading) {
    return (
      <main className="admin-detail-page">
        <div className="page-container">
          <div className="admin-detail-state">
            <div
              className="admin-detail-loader"
              aria-hidden="true"
            />

            <p>
              Loading alert details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (errorMessage && !alertData) {
    return (
      <main className="admin-detail-page">
        <div className="page-container">
          <div className="admin-detail-state">
            <div className="admin-detail-state__icon">
              <FiShield
                aria-hidden="true"
              />
            </div>

            <h1>
              Alert unavailable
            </h1>

            <p>
              {errorMessage ||
                'The requested alert could not be found.'}
            </p>

            <div className="admin-detail-back-button">
              <BackButton
                fallback="/admin/alerts"
                label="Back to alerts"
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  const user = alertData.userId;

  const canAcknowledge =
    alertData.status === 'ACTIVE';

  const canResolve =
    alertData.status === 'ACKNOWLEDGED' ||
    alertData.status === 'RESOLVING';

  const isResolved =
    alertData.status === 'RESOLVED';

  return (
    <main className="admin-detail-page">
      <div className="page-container admin-detail-main">
        <div className="admin-detail-back-link">
          <BackButton
            fallback="/admin/alerts"
            label="Back to alert monitoring"
          />
        </div>

        <header className="admin-detail-header">
          <div>
            <p className="admin-detail-eyebrow">
              EMERGENCY ALERT
            </p>

            <h1>
              {alertData.alertId ||
                'Emergency alert'}
            </h1>

            <p>
              Review the complete emergency alert
              record and associated activity.
            </p>
          </div>

          <span
            className={getStatusClass(
              alertData.status
            )}
          >
            {alertData.status || 'UNKNOWN'}
          </span>
        </header>

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

        <section className="admin-detail-overview">
          <div className="admin-detail-overview__icon">
            <FiShield
              aria-hidden="true"
            />
          </div>

          <div>
            <span>
              Alert triggered
            </span>

            <strong>
              {formatDate(
                alertData.triggerTime
              )}
            </strong>
          </div>
        </section>

        <section className="admin-detail-card admin-detail-card--full">
          <div className="admin-detail-card__header">
            <div className="admin-detail-card__icon">
              <FiShield
                aria-hidden="true"
              />
            </div>

            <div>
              <p>
                ALERT MANAGEMENT
              </p>

              <h2>
                Response actions
              </h2>
            </div>
          </div>

          {canAcknowledge && (
            <div className="admin-detail-action-panel">
              <div>
                <strong>
                  Acknowledge this emergency alert
                </strong>

                <p>
                  Confirm that the emergency alert has
                  been received and is being handled.
                </p>
              </div>

              <button
                type="button"
                className="admin-detail-action-button admin-detail-action-button--primary"
                onClick={handleAcknowledge}
                disabled={isProcessing}
              >
                <FiCheckCircle
                  aria-hidden="true"
                />

                <span>
                  {isProcessing
                    ? 'Acknowledging alert...'
                    : 'Acknowledge alert'}
                </span>
              </button>
            </div>
          )}

          {canResolve && (
            <div className="admin-detail-action-panel">
              <div>
                <strong>
                  Resolve this emergency alert
                </strong>

                <p>
                  Add a short resolution note and close
                  the emergency alert.
                </p>
              </div>

              <label
                htmlFor="admin-resolution-note"
                className="admin-detail-action-label"
              >
                Resolution note
              </label>

              <textarea
                id="admin-resolution-note"
                value={resolutionNote}
                onChange={(event) => {
                  setResolutionNote(
                    event.target.value
                  );
                }}
                placeholder="Describe how the emergency alert was resolved."
                maxLength={500}
                rows={4}
                disabled={isProcessing}
              />

              <button
                type="button"
                className="admin-detail-action-button admin-detail-action-button--resolve"
                onClick={handleResolve}
                disabled={isProcessing}
              >
                <FiCheckCircle
                  aria-hidden="true"
                />

                <span>
                  {isProcessing
                    ? 'Resolving alert...'
                    : 'Resolve emergency alert'}
                </span>
              </button>
            </div>
          )}

          {isResolved && (
            <div className="admin-detail-action-complete">
              <FiCheckCircle
                aria-hidden="true"
              />

              <div>
                <strong>
                  Emergency alert resolved
                </strong>

                <p>
                  This alert has been closed and no
                  further response action is required.
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="admin-detail-grid">
          <section className="admin-detail-card">
            <div className="admin-detail-card__header">
              <div className="admin-detail-card__icon">
                <FiUser
                  aria-hidden="true"
                />
              </div>

              <div>
                <p>
                  ACCOUNT
                </p>

                <h2>
                  User information
                </h2>
              </div>
            </div>

            <div className="admin-detail-info-list">
              <div>
                <span>
                  Name
                </span>

                <strong>
                  {user?.name ||
                    'Not available'}
                </strong>
              </div>

              <div>
                <span>
                  Email
                </span>

                <strong>
                  {user?.email ||
                    'Not available'}
                </strong>
              </div>

              <div>
                <span>
                  Phone
                </span>

                <strong>
                  {user?.phone ||
                    'Not available'}
                </strong>
              </div>

              <div>
                <span>
                  Account status
                </span>

                <strong>
                  {user?.isActive
                    ? 'Active'
                    : 'Inactive'}
                </strong>
              </div>
            </div>

            {user?.phone && (
              <a
                href={`tel:${user.phone}`}
                className="admin-detail-contact-button"
              >
                <FiPhone
                  aria-hidden="true"
                />

                Contact user
              </a>
            )}
          </section>

          <section className="admin-detail-card">
            <div className="admin-detail-card__header">
              <div className="admin-detail-card__icon">
                <FiMapPin
                  aria-hidden="true"
                />
              </div>

              <div>
                <p>
                  LOCATION
                </p>

                <h2>
                  Current location
                </h2>
              </div>
            </div>

            <div className="admin-detail-location">
              {alertData.currentLocation ||
              alertData.initialLocation ? (
                <>
                  <strong>
                    {
                      (
                        alertData.currentLocation ||
                        alertData.initialLocation
                      ).latitude
                    }
                    ,
                    {' '}
                    {
                      (
                        alertData.currentLocation ||
                        alertData.initialLocation
                      ).longitude
                    }
                  </strong>

                  <span>
                    Location available from the
                    emergency alert.
                  </span>
                </>
              ) : (
                <span>
                  Location unavailable
                </span>
              )}
            </div>
          </section>
        </div>

        <section className="admin-detail-card admin-detail-card--full">
          <div className="admin-detail-card__header">
            <div className="admin-detail-card__icon">
              <FiClock
                aria-hidden="true"
              />
            </div>

            <div>
              <p>
                ACTIVITY
              </p>

              <h2>
                Activity timeline
              </h2>
            </div>
          </div>

          {activities.length === 0 ? (
            <div className="admin-detail-empty">
              <FiCheckCircle
                aria-hidden="true"
              />

              <p>
                No activity records available.
              </p>
            </div>
          ) : (
            <div className="admin-detail-timeline">
              {activities.map(
                (activity, index) => (
                  <div
                    className="admin-detail-timeline__item"
                    key={
                      activity._id ||
                      `${activity.action}-${index}`
                    }
                  >
                    <div className="admin-detail-timeline__marker">
                      <span />
                    </div>

                    <div className="admin-detail-timeline__content">
                      <div>
                        <strong>
                          {activity.action ||
                            'Activity'}
                        </strong>

                        <time>
                          {formatDate(
                            activity.timestamp
                          )}
                        </time>
                      </div>

                      <p>
                        {activity.actorType ||
                          'SYSTEM'}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section className="admin-detail-card admin-detail-card--full">
          <div className="admin-detail-card__header">
            <div className="admin-detail-card__icon">
              <FiMapPin
                aria-hidden="true"
              />
            </div>

            <div>
              <p>
                TRACKING
              </p>

              <h2>
                Location history
              </h2>
            </div>
          </div>

          {locations.length === 0 ? (
            <div className="admin-detail-empty">
              <FiMapPin
                aria-hidden="true"
              />

              <p>
                No location updates available.
              </p>
            </div>
          ) : (
            <div className="admin-detail-location-list">
              {locations.map(
                (location, index) => (
                  <div
                    className="admin-detail-location-row"
                    key={
                      location._id ||
                      `${location.timestamp}-${index}`
                    }
                  >
                    <div>
                      <strong>
                        {location.latitude},{' '}
                        {location.longitude}
                      </strong>

                      <span>
                        Accuracy:{' '}
                        {location.accuracy ??
                          'Not available'}
                        {location.accuracy !==
                          undefined &&
                          ' m'}
                      </span>
                    </div>

                    <time>
                      {formatDate(
                        location.timestamp
                      )}
                    </time>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section className="admin-detail-card admin-detail-card--full">
          <div className="admin-detail-card__header">
            <div className="admin-detail-card__icon">
              <FiCheckCircle
                aria-hidden="true"
              />
            </div>

            <div>
              <p>
                RESOLUTION
              </p>

              <h2>
                Alert outcome
              </h2>
            </div>
          </div>

          <div className="admin-detail-resolution">
            <div>
              <span>
                Response time
              </span>

              <strong>
                {alertData.responseTime
                  ? formatDate(
                      alertData.responseTime
                    )
                  : 'Not available'}
              </strong>
            </div>

            <div>
              <span>
                Resolved at
              </span>

              <strong>
                {formatDate(
                  alertData.resolvedAt
                )}
              </strong>
            </div>

            <div>
              <span>
                Resolution note
              </span>

              <strong>
                {alertData.resolutionNote ||
                  'No resolution note provided.'}
              </strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminAlertDetail;