import {
  useEffect,
  useState
} from 'react';

import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiUsers
} from 'react-icons/fi';

import {
  useLocation,
  useNavigate
} from 'react-router-dom';

import Header from '../../components/common/Header';
import '../../styles/pages/admin.css';

const API_BASE_URL =
  'https://silent-sos-api-cp9r.onrender.com/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalContacts: 0,
    totalAlerts: 0,
    activeAlerts: 0,
    resolvedAlerts: 0
  });

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState('');

  useEffect(() => {
    const loadDashboard = async () => {
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
          `${API_BASE_URL}/admin/dashboard`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
            'Unable to load the admin dashboard.'
          );
        }

        const dashboardStats =
          result?.data?.stats;

        if (!dashboardStats) {
          throw new Error(
            'Dashboard statistics are unavailable.'
          );
        }

        setStats({
          totalUsers:
            dashboardStats.totalUsers ?? 0,

          activeUsers:
            dashboardStats.activeUsers ?? 0,

          totalContacts:
            dashboardStats.totalContacts ?? 0,

          totalAlerts:
            dashboardStats.totalAlerts ?? 0,

          activeAlerts:
            dashboardStats.activeAlerts ?? 0,

          resolvedAlerts:
            dashboardStats.resolvedAlerts ?? 0
        });
      } catch (error) {
        setErrorMessage(
          error.message ||
          'Unable to load the admin dashboard.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statCards = [
    {
      label: 'Users overview',
      icon: FiUsers,
      description:
        'Registered users, active accounts and configured contacts.',
      route: '/admin/users',
      section: 'users',
      type: 'users'
    },
    {
      label: 'Total alerts',
      value: stats.totalAlerts,
      icon: FiAlertCircle,
      description:
        'Emergency alerts created across the platform.',
      route: '/admin/alerts?filter=total',
      section: 'total-alerts',
      type: 'single'
    },
    {
      label: 'Active alerts',
      value: stats.activeAlerts,
      icon: FiClock,
      description:
        'Emergency alerts currently requiring attention.',
      route: '/admin/alerts?filter=active',
      section: 'active-alerts',
      type: 'single'
    },
    {
      label: 'Resolved alerts',
      value: stats.resolvedAlerts,
      icon: FiCheckCircle,
      description:
        'Emergency alerts successfully resolved.',
      route: '/admin/alerts?filter=resolved',
      section: 'resolved-alerts',
      type: 'single'
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  const isCardActive = (section) => {
    if (
      location.pathname ===
      '/admin/users'
    ) {
      return section === 'users';
    }

    if (
      location.pathname !==
      '/admin/alerts'
    ) {
      return false;
    }

    const searchParams =
      new URLSearchParams(
        location.search
      );

    const currentFilter =
      searchParams.get('filter') ||
      'total';

    if (section === 'total-alerts') {
      return currentFilter === 'total';
    }

    if (section === 'active-alerts') {
      return currentFilter === 'active';
    }

    if (section === 'resolved-alerts') {
      return currentFilter === 'resolved';
    }

    return false;
  };

  if (isLoading) {
    return (
      <>
        <Header />

        <main className="admin-page">
          <div className="page-container">
            <div className="admin-state">
              <div
                className="admin-state__loader"
                aria-hidden="true"
              />

              <p>
                Loading admin dashboard...
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (errorMessage) {
    return (
      <>
        <Header />

        <main className="admin-page">
          <div className="page-container">
            <div
              className="admin-state admin-state--error"
              role="alert"
            >
              <FiShield
                aria-hidden="true"
              />

              <h2>
                Unable to load dashboard
              </h2>

              <p>
                {errorMessage}
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="admin-page">
        <div className="page-container admin-main">
          <header className="admin-header">
            <div>
              <p className="admin-eyebrow">
                ADMINISTRATION
              </p>

              <h1>
                Safety operations dashboard
              </h1>

              <p>
                Monitor users, emergency contacts
                and alert activity across the
                Silent SOS platform.
              </p>
            </div>

            <div className="admin-header__status">
              <span className="admin-header__status-dot" />

              System operational
            </div>
          </header>

          <section className="admin-overview">
            <div className="admin-overview__icon">
              <FiShield
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="admin-overview__eyebrow">
                EMERGENCY MONITORING
              </p>

              <h2>
                Current platform overview
              </h2>

              <p>
                Review the latest safety activity
                and identify alerts that may require
                administrative attention.
              </p>
            </div>
          </section>

          <section
            className="admin-stats-grid"
            aria-label="Platform statistics"
          >
            {statCards.map((card) => {
              const Icon = card.icon;

              const isActive =
                isCardActive(
                  card.section
                );

              return (
                <button
                  type="button"
                  className={
                    isActive
                      ? 'admin-stat-card admin-stat-card--active'
                      : 'admin-stat-card'
                  }
                  key={card.label}
                  onClick={() =>
                    handleCardClick(
                      card.route
                    )
                  }
                  aria-current={
                    isActive
                      ? 'page'
                      : undefined
                  }
                >
                  <div className="admin-stat-card__top">
                    <div className="admin-stat-card__icon">
                      <Icon
                        aria-hidden="true"
                      />
                    </div>

                    <span className="admin-stat-card__action">
                      View
                    </span>
                  </div>

                  {card.type === 'users' ? (
                    <div className="admin-stat-card__user-stats">
                      <div>
                        <strong>
                          {stats.totalUsers.toLocaleString()}
                        </strong>

                        <span>
                          Total users
                        </span>
                      </div>

                      <div>
                        <strong>
                          {stats.activeUsers.toLocaleString()}
                        </strong>

                        <span>
                          Active users
                        </span>
                      </div>

                      <div>
                        <strong>
                          {stats.totalContacts.toLocaleString()}
                        </strong>

                        <span>
                          Total contacts
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-stat-card__value">
                      {card.value.toLocaleString()}
                    </div>
                  )}

                  <h3>
                    {card.label}
                  </h3>

                  <p>
                    {card.description}
                  </p>
                </button>
              );
            })}
          </section>

          <section className="admin-alert-summary">
            <div>
              <p className="admin-section__eyebrow">
                ALERT STATUS
              </p>

              <h2>
                Emergency activity
              </h2>

              <p>
                Active alerts should be reviewed
                first, while resolved alerts provide
                a record of completed emergency
                responses.
              </p>
            </div>

            <div className="admin-alert-summary__metrics">
              <div>
                <span>
                  Active
                </span>

                <strong>
                  {stats.activeAlerts}
                </strong>
              </div>

              <div>
                <span>
                  Resolved
                </span>

                <strong>
                  {stats.resolvedAlerts}
                </strong>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default AdminDashboard;