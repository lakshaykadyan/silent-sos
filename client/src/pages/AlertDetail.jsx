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
import {
  useParams
} from 'react-router-dom';

import Header from '../components/common/Header';
import BackButton from '../components/common/BackButton';
import {
  getAlertById,
  getAlertLocationHistory
} from '../services/alertService';

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

const getActivityLabel = (action) => {
  switch (action) {
    case 'SOS_TRIGGERED':
      return 'Emergency alert triggered';

    case 'LOCATION_UPDATED':
      return 'Location updated';

    case 'ACKNOWLEDGED':
      return 'Alert acknowledged';

    case 'RESOLVING':
      return 'Alert resolution started';

    case 'RESOLVED':
      return 'Alert resolved';

    case 'ERROR':
      return 'Alert processing error';

    default:
      return action
        ? action
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
              letter.toUpperCase()
            )
        : 'Activity recorded';
  }
};

const getActivityIcon = (action) => {
  switch (action) {
    case 'SOS_TRIGGERED':
      return (
        <FiShield
          aria-hidden="true"
        />
      );

    case 'LOCATION_UPDATED':
      return (
        <FiMapPin
          aria-hidden="true"
        />
      );

    case 'ACKNOWLEDGED':
      return (
        <FiCheckCircle
          aria-hidden="true"
        />
      );

    case 'RESOLVING':
      return (
        <FiClock
          aria-hidden="true"
        />
      );

    case 'RESOLVED':
      return (
        <FiCheckCircle
          aria-hidden="true"
        />
      );

    case 'ERROR':
      return (
        <FiAlertCircle
          aria-hidden="true"
        />
      );

    default:
      return (
        <FiClock
          aria-hidden="true"
        />
      );
  }
};

const getActivityActorLabel = (activity) => {
  if (activity?.actorType === 'ADMIN') {
    return 'Admin';
  }

  if (activity?.actorType === 'USER') {
    return 'User';
  }

  if (activity?.actorType) {
    return activity.actorType;
  }

  return 'System';
};

const getActivityMetadata = (activity) => {
  if (
    !activity?.metadata ||
    typeof activity.metadata !== 'object' ||
    Array.isArray(activity.metadata)
  ) {
    return [];
  }

  return Object.entries(activity.metadata).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== ''
  );
};

function AlertDetail() {
  const {
    id
  } = useParams();

  const [
    alert,
    setAlert
  ] = useState(null);

  const [
    activities,
    setActivities
  ] = useState([]);

  const [
    locations,
    setLocations
  ] = useState([]);

  const [
    isLoading,
    setIsLoading
  ] = useState(true);

  const [
    isLocationLoading,
    setIsLocationLoading
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage
  ] = useState('');

  const [
    locationError,
    setLocationError
  ] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadAlert = async () => {
      try {
        const result =
          await getAlertById(id);

        if (!isMounted) {
          return;
        }

        setAlert(
          result?.data?.alert || null
        );

        setActivities(
          result?.data?.activities || []
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error.message ||
          'Unable to load alert details.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAlert();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const loadLocationHistory = async () => {
      try {
        const result =
          await getAlertLocationHistory(id);

        if (!isMounted) {
          return;
        }

        setLocations(
          result?.data?.locations || []
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setLocationError(
          error.message ||
          'Unable to load location history.'
        );
      } finally {
        if (isMounted) {
          setIsLocationLoading(false);
        }
      }
    };

    loadLocationHistory();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="dashboard-page">
      <Header />

      <main className="dashboard-main">
        <div className="page-container">
          <div className="alert-detail-back">
            <BackButton
              fallback="/alert-history"
              label="Back to alert history"
            />
          </div>

          <section className="dashboard-header">
            <div>
              <p className="dashboard-eyebrow">
                Safety record
              </p>

              <h1>
                Alert details
              </h1>

              <p>
                Review the complete record for this
                emergency alert.
              </p>
            </div>

            {alert && (
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
            )}
          </section>

          {isLoading && (
            <section className="history-state">
              <FiClock
                aria-hidden="true"
              />

              <h2>
                Loading alert details
              </h2>

              <p>
                Retrieving the selected safety record.
              </p>
            </section>
          )}

          {!isLoading && errorMessage && (
            <section className="history-state history-state--error">
              <FiAlertCircle
                aria-hidden="true"
              />

              <h2>
                Unable to load alert
              </h2>

              <p>
                {errorMessage}
              </p>
            </section>
          )}

          {!isLoading &&
            !errorMessage &&
            !alert && (
              <section className="history-state">
                <FiShield
                  aria-hidden="true"
                />

                <h2>
                  Alert not found
                </h2>

                <p>
                  The requested emergency alert could
                  not be found.
                </p>
              </section>
            )}

          {!isLoading &&
            !errorMessage &&
            alert && (
              <>
                <section className="alert-detail-card">
                  <div className="alert-detail-card__header">
                    <div>
                      <p className="dashboard-card__eyebrow">
                        Emergency alert
                      </p>

                      <h2>
                        {alert.alertId}
                      </h2>
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

                  {alert.currentLocation && (
                    <div className="alert-detail-location">
                      <span>
                        Current location
                      </span>

                      <strong>
                        {formatLocation(
                          alert.currentLocation
                        )}
                      </strong>
                    </div>
                  )}

                  {alert.responseTime !== null &&
                    alert.responseTime !== undefined && (
                      <div className="alert-detail-location">
                        <span>
                          Response time
                        </span>

                        <strong>
                          {alert.responseTime} seconds
                        </strong>
                      </div>
                    )}

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
                </section>

                <section className="activity-timeline-section">
                  <div className="activity-timeline-header">
                    <div>
                      <p className="dashboard-card__eyebrow">
                        Alert activity
                      </p>

                      <h2>
                        Activity timeline
                      </h2>

                      <p>
                        A chronological record of actions
                        and system events for this alert.
                      </p>
                    </div>

                    <div className="activity-timeline-count">
                      {activities.length}
                      {' '}
                      {activities.length === 1
                        ? 'activity'
                        : 'activities'}
                    </div>
                  </div>

                  {activities.length === 0 && (
                    <div className="activity-timeline-state">
                      <FiClock
                        aria-hidden="true"
                      />

                      <span>
                        No activity records were found
                        for this alert.
                      </span>
                    </div>
                  )}

                  {activities.length > 0 && (
                    <div className="activity-timeline-list">
                      {activities.map(
                        (activity, index) => {
                          const metadata =
                            getActivityMetadata(
                              activity
                            );

                          return (
                            <article
                              className="activity-timeline-item"
                              key={
                                activity._id ||
                                `${activity.timestamp}-${index}`
                              }
                            >
                              <div className="activity-timeline-item__rail">
                                <div className="activity-timeline-item__marker">
                                  {getActivityIcon(
                                    activity.action
                                  )}
                                </div>

                                {index <
                                  activities.length - 1 && (
                                  <div className="activity-timeline-item__line" />
                                )}
                              </div>

                              <div className="activity-timeline-item__content">
                                <div className="activity-timeline-item__header">
                                  <div>
                                    <strong>
                                      {getActivityLabel(
                                        activity.action
                                      )}
                                    </strong>

                                    <span>
                                      {getActivityActorLabel(
                                        activity
                                      )}
                                    </span>
                                  </div>

                                  <time
                                    dateTime={
                                      activity.timestamp
                                    }
                                  >
                                    {formatDateTime(
                                      activity.timestamp
                                    )}
                                  </time>
                                </div>

                                {metadata.length > 0 && (
                                  <div className="activity-timeline-item__metadata">
                                    {metadata.map(
                                      ([
                                        key,
                                        value
                                      ]) => (
                                        <div
                                          className="activity-timeline-item__metadata-row"
                                          key={key}
                                        >
                                          <span>
                                            {key
                                              .replace(
                                                /([A-Z])/g,
                                                ' $1'
                                              )
                                              .replace(
                                                /^./,
                                                (
                                                  letter
                                                ) =>
                                                  letter.toUpperCase()
                                              )}
                                          </span>

                                          <strong>
                                            {typeof value ===
                                            'object'
                                              ? JSON.stringify(
                                                  value
                                                )
                                              : String(
                                                  value
                                                )}
                                          </strong>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </article>
                          );
                        }
                      )}
                    </div>
                  )}
                </section>

                <section className="location-history-section">
                  <div className="location-history-header">
                    <div>
                      <p className="dashboard-card__eyebrow">
                        Tracking record
                      </p>

                      <h2>
                        Location history
                      </h2>

                      <p>
                        Recorded locations captured while
                        this emergency alert was active.
                      </p>
                    </div>

                    <div className="location-history-count">
                      {locations.length}
                      {' '}
                      {locations.length === 1
                        ? 'update'
                        : 'updates'}
                    </div>
                  </div>

                  {isLocationLoading && (
                    <div className="location-history-state">
                      <FiClock
                        aria-hidden="true"
                      />

                      <span>
                        Loading location updates
                      </span>
                    </div>
                  )}

                  {!isLocationLoading &&
                    locationError && (
                      <div className="location-history-state location-history-state--error">
                        <FiAlertCircle
                          aria-hidden="true"
                        />

                        <span>
                          {locationError}
                        </span>
                      </div>
                    )}

                  {!isLocationLoading &&
                    !locationError &&
                    locations.length === 0 && (
                      <div className="location-history-state">
                        <FiMapPin
                          aria-hidden="true"
                        />

                        <span>
                          No location updates were recorded
                          for this alert.
                        </span>
                      </div>
                    )}

                  {!isLocationLoading &&
                    !locationError &&
                    locations.length > 0 && (
                      <div className="location-history-list">
                        {locations.map(
                          (location, index) => (
                            <article
                              className="location-history-item"
                              key={
                                location._id ||
                                `${location.timestamp}-${index}`
                              }
                            >
                              <div className="location-history-item__marker">
                                <FiMapPin
                                  aria-hidden="true"
                                />
                              </div>

                              <div className="location-history-item__content">
                                <div className="location-history-item__header">
                                  <strong>
                                    Location update
                                    {' '}
                                    {index + 1}
                                  </strong>

                                  <span>
                                    {formatDateTime(
                                      location.timestamp
                                    )}
                                  </span>
                                </div>

                                <div className="location-history-item__details">
                                  <span>
                                    Coordinates
                                  </span>

                                  <strong>
                                    {formatLocation(
                                      location
                                    )}
                                  </strong>
                                </div>

                                {typeof location.accuracy ===
                                  'number' && (
                                  <div className="location-history-item__details">
                                    <span>
                                      Accuracy
                                    </span>

                                    <strong>
                                      {Math.round(
                                        location.accuracy
                                      )}
                                      {' '}
                                      metres
                                    </strong>
                                  </div>
                                )}

                                {location.source && (
                                  <div className="location-history-item__details">
                                    <span>
                                      Source
                                    </span>

                                    <strong>
                                      {location.source}
                                    </strong>
                                  </div>
                                )}
                              </div>
                            </article>
                          )
                        )}
                      </div>
                    )}
                </section>
              </>
            )}
        </div>
      </main>
    </div>
  );
}

export default AlertDetail;