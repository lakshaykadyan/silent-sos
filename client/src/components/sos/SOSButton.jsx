import {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  FiShield
} from 'react-icons/fi';

const HOLD_DURATION = 1200;

function SOSButton({
  onActivate,
  disabled = false
}) {
  const timerRef = useRef(null);
  const activatedRef = useRef(false);

  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  const clearHold = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsHolding(false);
    setProgress(0);
  };

  const startHold = () => {
    if (disabled) {
      return;
    }

    activatedRef.current = false;
    setIsHolding(true);
    setProgress(0);

    const startedAt = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(
        elapsed / HOLD_DURATION,
        1
      );

      setProgress(nextProgress);

      if (nextProgress >= 1) {
        clearHold();

        activatedRef.current = true;

        onActivate();
      }
    }, 20);
  };

  const endHold = () => {
    if (activatedRef.current) {
      activatedRef.current = false;
      return;
    }

    clearHold();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <button
      type="button"
      className={`sos-button ${
        isHolding ? 'sos-button--holding' : ''
      }`}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onTouchCancel={endHold}
      onKeyDown={(event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();

          if (!isHolding) {
            startHold();
          }
        }
      }}
      onKeyUp={(event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
          endHold();
        }
      }}
      disabled={disabled}
      aria-label="Press and hold to activate silent emergency alert"
    >
      <span
        className="sos-button__ring"
        style={{
          '--sos-progress': `${progress * 360}deg`
        }}
      >
        <span className="sos-button__core">
          <FiShield
            className="sos-button__icon"
            aria-hidden="true"
          />

          <span className="sos-button__label">
            SOS
          </span>
        </span>
      </span>
    </button>
  );
}

export default SOSButton;