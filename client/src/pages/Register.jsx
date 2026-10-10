import {
  useState
} from 'react';

import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiShield,
  FiUser
} from 'react-icons/fi';

import {
  Link,
  useNavigate
} from 'react-router-dom';

import Button from '../components/common/Button';
import Header from '../components/common/Header';
import useAuth from '../hooks/useAuth';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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

    if (formData.password.length < 8) {
      setError(
        'Password must be at least 8 characters long'
      );

      return;
    }

    setLoading(true);

    try {
      await register(formData);

      navigate('/dashboard', {
        replace: true
      });
    } catch (submitError) {
      setError(
        submitError.message ||
        'Unable to create your account'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />

      <main className="auth-main">
        <section className="auth-card auth-card--register">
          <div className="auth-card__icon">
            <FiShield aria-hidden="true" />
          </div>

          <div className="auth-card__heading">
            <h1>Create your account</h1>

            <p>
              Set up your private Silent SOS
              safety profile.
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
              <label htmlFor="register-name">
                Full name
              </label>

              <div className="auth-input">
                <FiUser aria-hidden="true" />

                <input
                  id="register-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">
                Email address
              </label>

              <div className="auth-input">
                <FiMail aria-hidden="true" />

                <input
                  id="register-email"
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
              <label htmlFor="register-phone">
                Phone number
              </label>

              <div className="auth-input">
                <FiPhone aria-hidden="true" />

                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">
                Password
              </label>

              <div className="auth-input">
                <FiLock aria-hidden="true" />

                <input
                  id="register-password"
                  name="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  minLength={8}
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
                ? 'Creating account...'
                : 'Create account'}

              {!loading && (
                <FiArrowRight
                  aria-hidden="true"
                />
              )}
            </Button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}

            <Link to="/login">
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Register;