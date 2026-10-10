import {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  FiBell,
  FiCheck,
  FiClock,
  FiShield
} from 'react-icons/fi';

import {
  getUnreadNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead
} from '../../services/notificationService';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [error, setError] = useState('');

  const notificationRef = useRef(null);

  useEffect(() => {
    const loadUnreadNotifications = async () => {
      try {
        const result = await getUnreadNotifications();

        setNotifications(
          result?.data?.notifications || []
        );
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadUnreadNotifications();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, []);

  const handleMarkAsRead = async (
    notificationId
  ) => {
    try {
      await markNotificationAsRead(
        notificationId
      );

      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (notification) =>
            notification._id !== notificationId
        )
      );
    } catch (readError) {
      setError(readError.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) {
      return;
    }

    setIsMarkingAll(true);
    setError('');

    try {
      await markAllNotificationsAsRead();

      setNotifications([]);
    } catch (readError) {
      setError(readError.message);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleOpenPanel = async () => {
    setIsOpen(true);

    if (notifications.length > 0) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result =
        await getUnreadNotifications();

      setNotifications(
        result?.data?.notifications || []
      );
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBellClick = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    handleOpenPanel();
  };

  const formatNotificationTime = (
    timestamp
  ) => {
    if (!timestamp) {
      return '';
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const unreadCount = notifications.length;

  return (
    <div
      className="notification-bell"
      ref={notificationRef}
    >
      <button
        type="button"
        className="notification-bell__button"
        onClick={handleBellClick}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
        aria-expanded={isOpen}
      >
        <FiBell aria-hidden="true" />

        {unreadCount > 0 && (
          <span
            className="notification-bell__badge"
            aria-hidden="true"
          >
            {unreadCount > 99
              ? '99+'
              : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="notification-panel"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="notification-panel__header">
            <div>
              <h2>
                Notifications
              </h2>

              <p>
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount === 1
                        ? ''
                        : 's'
                    }`
                  : 'No unread notifications'}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                className="notification-panel__mark-all"
                onClick={
                  handleMarkAllAsRead
                }
                disabled={isMarkingAll}
              >
                <FiCheck
                  aria-hidden="true"
                />

                {isMarkingAll
                  ? 'Updating'
                  : 'Mark all read'}
              </button>
            )}
          </div>

          {error && (
            <div
              className="notification-panel__error"
              role="alert"
            >
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="notification-panel__state">
              <span
                className="notification-panel__loader"
                aria-hidden="true"
              />

              <p>
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-panel__state">
              <span
                className="notification-panel__empty-icon"
                aria-hidden="true"
              >
                <FiShield />
              </span>

              <h3>
                You're all caught up
              </h3>

              <p>
                New emergency notifications
                will appear here.
              </p>
            </div>
          ) : (
            <div className="notification-panel__list">
              {notifications.map(
                (notification) => (
                  <article
                    key={notification._id}
                    className="notification-item"
                  >
                    <div className="notification-item__icon">
                      <FiShield
                        aria-hidden="true"
                      />
                    </div>

                    <div className="notification-item__content">
                      <div className="notification-item__top">
                        <h3>
                          {notification.title}
                        </h3>

                        <span className="notification-item__status">
                          New
                        </span>
                      </div>

                      <p>
                        {notification.message}
                      </p>

                      <div className="notification-item__footer">
                        <span>
                          <FiClock
                            aria-hidden="true"
                          />

                          {formatNotificationTime(
                            notification.createdAt
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleMarkAsRead(
                              notification._id
                            )
                          }
                        >
                          Mark as read
                        </button>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;