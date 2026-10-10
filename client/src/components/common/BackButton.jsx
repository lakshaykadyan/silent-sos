import {
  FiArrowLeft
} from 'react-icons/fi';

import {
  useNavigate
} from 'react-router-dom';

function BackButton({
  fallback = '/dashboard',
  label = 'Back'
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallback, {
      replace: true
    });
  };

  return (
    <button
      type="button"
      className="back-button"
      onClick={handleBack}
      aria-label={label}
    >
      <FiArrowLeft
        aria-hidden="true"
      />

      <span>
        {label}
      </span>
    </button>
  );
}

export default BackButton;