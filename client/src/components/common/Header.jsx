import {
  useState
} from 'react';

import {
  FiAlertCircle,
  FiClock,
  FiMenu,
  FiSettings,
  FiShield,
  FiUsers,
  FiX
} from 'react-icons/fi';

import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import Button from './Button';
import NotificationBell from './NotificationBell';

function Header() {
  const {
    isAuthenticated,
    user,
    logout
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen
  ] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (path) => {
    closeMobileMenu();

    navigate(path);
  };

  const handleLogout = async () => {
    closeMobileMenu();

    await logout();

    navigate('/login', {
      replace: true
    });
  };

  const handleBrandClick = () => {
    closeMobileMenu();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavButtonClass = (path) => {
    return isActive(path)
      ? 'site-header__nav-button site-header__nav-button--active'
      : 'site-header__nav-button';
  };

  return (
    <header className="site-header">
      <div className="page-container site-header__container">
        <Link
          to="/"
          className="site-header__brand"
          onClick={handleBrandClick}
        >
          <span className="site-header__brand-icon">
            <FiShield aria-hidden="true" />
          </span>

          <span>
            Silent SOS
          </span>
        </Link>

        {isAuthenticated && (
          <div className="site-header__mobile-actions">
            <div className="site-header__mobile-notification">
              <NotificationBell />
            </div>

            <button
              type="button"
              className="site-header__menu-button"
              onClick={() =>
                setIsMobileMenuOpen(
                  (current) => !current
                )
              }
              aria-label={
                isMobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={
                isMobileMenuOpen
              }
            >
              {isMobileMenuOpen ? (
                <FiX aria-hidden="true" />
              ) : (
                <FiMenu aria-hidden="true" />
              )}
            </button>
          </div>
        )}

        <nav
          className={
            isMobileMenuOpen
              ? 'site-header__nav site-header__nav--open'
              : 'site-header__nav'
          }
          aria-label="Main navigation"
        >
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="site-header__link"
                onClick={closeMobileMenu}
              >
                Sign in
              </Link>

              <Button
                size="small"
                onClick={() =>
                  handleNavigate('/register')
                }
              >
                Get Started
              </Button>
            </>
          ) : (
            <>
              <span className="site-header__user">
                {user?.name}
              </span>

              <div className="site-header__desktop-notification">
                <NotificationBell />
              </div>

              {isAdmin ? (
                <>
                  <Button
                    variant="ghost"
                    size="small"
                    className={getNavButtonClass(
                      '/admin/dashboard'
                    )}
                    onClick={() =>
                      handleNavigate(
                        '/admin/dashboard'
                      )
                    }
                  >
                    Admin Dashboard
                  </Button>

                  <Button
                    variant="ghost"
                    size="small"
                    className={getNavButtonClass(
                      '/admin/alerts'
                    )}
                    onClick={() =>
                      handleNavigate(
                        '/admin/alerts'
                      )
                    }
                  >
                    <FiAlertCircle
                      aria-hidden="true"
                    />

                    Alerts
                  </Button>

                  <Button
                    variant="ghost"
                    size="small"
                    className={getNavButtonClass(
                      '/admin/users'
                    )}
                    onClick={() =>
                      handleNavigate(
                        '/admin/users'
                      )
                    }
                  >
                    <FiUsers
                      aria-hidden="true"
                    />

                    Users
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="small"
                    className={getNavButtonClass(
                      '/dashboard'
                    )}
                    onClick={() =>
                      handleNavigate(
                        '/dashboard'
                      )
                    }
                  >
                    Dashboard
                  </Button>

                  <Button
                    variant="ghost"
                    size="small"
                    className={getNavButtonClass(
                      '/profile'
                    )}
                    onClick={() =>
                      handleNavigate(
                        '/profile'
                      )
                    }
                  >
                    Profile
                  </Button>

                  <Button
                    variant="ghost"
                    size="small"
                    className={getNavButtonClass(
                      '/settings'
                    )}
                    onClick={() =>
                      handleNavigate(
                        '/settings'
                      )
                    }
                  >
                    <FiSettings
                      aria-hidden="true"
                    />

                    Settings
                  </Button>

                  <Button
                    variant="ghost"
                    size="small"
                    className={getNavButtonClass(
                      '/contacts'
                    )}
                    onClick={() =>
                      handleNavigate(
                        '/contacts'
                      )
                    }
                  >
                    <FiUsers
                      aria-hidden="true"
                    />

                    Contacts
                  </Button>

                  <Button
                    variant="ghost"
                    size="small"
                    className={getNavButtonClass(
                      '/alert-history'
                    )}
                    onClick={() =>
                      handleNavigate(
                        '/alert-history'
                      )
                    }
                  >
                    <FiClock
                      aria-hidden="true"
                    />

                    Alert History
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                size="small"
                className="site-header__nav-button"
                onClick={handleLogout}
              >
                Sign out
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;