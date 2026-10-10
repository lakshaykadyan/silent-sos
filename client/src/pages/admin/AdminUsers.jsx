import {
  useEffect,
  useState
} from 'react';

import {
  FiCheckCircle,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiShield,
  FiUser,
  FiUsers
} from 'react-icons/fi';

import BackButton from '../../components/common/BackButton';
import '../../styles/pages/admin-users.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUsers = async () => {
    try {
      setErrorMessage('');

      const token = localStorage.getItem('token');

      const response = await fetch(
        'https://silent-sos-api-cp9r.onrender.com/api/admin/users',
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
          'Unable to load users.'
        );
      }

      setUsers(
        result?.data?.users ||
        []
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
        'Unable to load users.'
      );
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          'https://silent-sos-api-cp9r.onrender.com/api/admin/users',
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
            'Unable to load users.'
          );
        }

        if (isMounted) {
          setUsers(
            result?.data?.users ||
            []
          );
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.message ||
            'Unable to load users.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    await fetchUsers();

    setIsRefreshing(false);
  };

  const formatDate = (date) => {
    if (!date) {
      return 'Not available';
    }

    return new Date(date).toLocaleDateString();
  };

  const getRoleClass = (role) => {
    if (role === 'ADMIN') {
      return 'admin-user-role admin-user-role--admin';
    }

    return 'admin-user-role admin-user-role--user';
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
              Loading platform users...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="page-container admin-main">
        <div className="admin-users-back">
          <BackButton
            fallback="/admin/dashboard"
            label="Back to dashboard"
          />
        </div>

        <header className="admin-page-header">
          <div>
            <p className="admin-eyebrow">
              PLATFORM MANAGEMENT
            </p>

            <h1>
              User monitoring
            </h1>

            <p>
              Review registered accounts across the
              Silent SOS platform.
            </p>
          </div>

          <button
            type="button"
            className="admin-users-refresh"
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
            <FiShield
              aria-hidden="true"
            />

            <span>
              {errorMessage}
            </span>
          </div>
        )}

        <section className="admin-users-summary-grid">
          <article className="admin-users-summary-card">
            <div className="admin-users-summary-card__icon">
              <FiUsers
                aria-hidden="true"
              />
            </div>

            <div>
              <span>
                Total users
              </span>

              <strong>
                {users.length}
              </strong>
            </div>
          </article>

          <article className="admin-users-summary-card">
            <div className="admin-users-summary-card__icon">
              <FiCheckCircle
                aria-hidden="true"
              />
            </div>

            <div>
              <span>
                Active users
              </span>

              <strong>
                {
                  users.filter(
                    (user) =>
                      user.isActive
                  ).length
                }
              </strong>
            </div>
          </article>

          <article className="admin-users-summary-card">
            <div className="admin-users-summary-card__icon">
              <FiShield
                aria-hidden="true"
              />
            </div>

            <div>
              <span>
                Administrators
              </span>

              <strong>
                {
                  users.filter(
                    (user) =>
                      user.role === 'ADMIN'
                  ).length
                }
              </strong>
            </div>
          </article>
        </section>

        {users.length === 0 ? (
          <section className="admin-empty-state">
            <div className="admin-empty-state__icon">
              <FiUsers
                aria-hidden="true"
              />
            </div>

            <h2>
              No users found
            </h2>

            <p>
              There are currently no registered
              accounts available for review.
            </p>
          </section>
        ) : (
          <section className="admin-users-list">
            {users.map((user) => (
              <article
                key={
                  user._id ||
                  user.id
                }
                className="admin-user-card"
              >
                <div className="admin-user-card__identity">
                  <div className="admin-user-card__avatar">
                    <FiUser
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2>
                      {user.name ||
                        'Unnamed user'}
                    </h2>

                    <span>
                      {user.email ||
                        'Email unavailable'}
                    </span>
                  </div>
                </div>

                <div className="admin-user-card__details">
                  <div>
                    <FiMail
                      aria-hidden="true"
                    />

                    <span>
                      {user.email ||
                        'Not available'}
                    </span>
                  </div>

                  <div>
                    <FiPhone
                      aria-hidden="true"
                    />

                    <span>
                      {user.phone ||
                        'Not available'}
                    </span>
                  </div>
                </div>

                <div className="admin-user-card__meta">
                  <span
                    className={getRoleClass(
                      user.role
                    )}
                  >
                    {user.role ||
                      'USER'}
                  </span>

                  <span
                    className={
                      user.isActive
                        ? 'admin-user-status admin-user-status--active'
                        : 'admin-user-status admin-user-status--inactive'
                    }
                  >
                    {user.isActive
                      ? 'Active'
                      : 'Inactive'}
                  </span>
                </div>

                <div className="admin-user-card__footer">
                  <span>
                    Registered
                  </span>

                  <strong>
                    {formatDate(
                      user.createdAt
                    )}
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

export default AdminUsers;