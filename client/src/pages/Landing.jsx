import { FiArrowRight, FiShield } from 'react-icons/fi';

import Button from '../components/common/Button';

function Landing() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="page-container landing-hero__container">
          <div className="landing-hero__content">
            <div className="landing-badge">
              <FiShield aria-hidden="true" />
              <span>Private emergency assistance</span>
            </div>

            <h1 className="landing-hero__title">
              Send a silent emergency alert when you need help.
            </h1>

            <p className="landing-hero__description">
              Silent SOS helps you discreetly alert trusted contacts,
              share your location, and keep them informed until the
              situation is resolved.
            </p>

            <div className="landing-hero__actions">
              <Button
                variant="primary"
                size="large"
              >
                Get Started
                <FiArrowRight aria-hidden="true" />
              </Button>

              <Button
                variant="outline"
                size="large"
              >
                Learn More
              </Button>
            </div>

            <div className="landing-trust">
              <span>Discreet</span>
              <span>Location-aware</span>
              <span>Trusted contacts</span>
            </div>
          </div>

          <div className="landing-hero__visual">
            <div className="landing-visual-card">
              <div className="landing-visual-card__header">
                <div>
                  <span className="landing-visual-card__eyebrow">
                    Safety status
                  </span>

                  <strong>Protected</strong>
                </div>

                <div className="landing-status">
                  <span />
                  Ready
                </div>
              </div>

              <div className="landing-sos-preview">
                <span className="landing-sos-preview__label">
                  Silent emergency alert
                </span>

                <div className="landing-sos-preview__button">
                  SOS
                </div>

                <span className="landing-sos-preview__hint">
                  Press and hold to activate
                </span>
              </div>

              <div className="landing-visual-card__footer">
                <div>
                  <span>Trusted contacts</span>
                  <strong>3 connected</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>Available</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Landing;