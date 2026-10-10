import {
  useState
} from 'react';

import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield
} from 'react-icons/fi';

import {
  Link,
  useNavigate
} from 'react-router-dom';

import Button from '../components/common/Button';
import Header from '../components/common/Header';
import useAuth from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();

  const {
    login,
    user
  } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(formData);

      const currentUser =
        loggedInUser || user;

      if (currentUser?.role === 'ADMIN') {
        navigate('/admin/dashboard', {
          replace: true
        });
      } else {
        navigate('/dashboard', {
          replace: true
        });
      }
    } catch (submitError) {
      setError(
        submitError.message ||
        'Unable to sign in'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />

      <main className="auth-main">
        <section className="auth-card">
          <div className="auth-card__icon">
            <FiShield aria-hidden="true" />
          </div>

          <div className="auth-card__heading">
            <h1>
              Welcome back
            </h1>

            <p>
              Sign in to access your Silent SOS
              safety dashboard.
            </p>
          </div>

          {error && (
            <div
              className="auth-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="auth-field">
              <label htmlFor="login-email">
                Email address
              </label>

              <div className="auth-input">
                <FiMail
                  aria-hidden="true"
                />

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">
                Password
              </label>

              <div className="auth-input">
                <FiLock
                  aria-hidden="true"
                />

                <input
                  id="login-password"
                  name="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  title={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <FiEyeOff
                      aria-hidden="true"
                    />
                  ) : (
                    <FiEye
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading
                ? 'Signing in...'
                : 'Sign in'}

              {!loading && (
                <FiArrowRight
                  aria-hidden="true"
                />
              )}
            </Button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}

            <Link to="/register">
              Create one
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Login;