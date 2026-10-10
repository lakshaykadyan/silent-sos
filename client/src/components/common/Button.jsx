import PropTypes from 'prop-types';
import '../../styles/components/buttons.css';

function Button({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  fullWidth = false,
  onClick,
  className = ''
}) {
  const classNames = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full-width' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'outline',
    'danger',
    'ghost'
  ]),
  size: PropTypes.oneOf([
    'small',
    'medium',
    'large'
  ]),
  type: PropTypes.oneOf([
    'button',
    'submit',
    'reset'
  ]),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default Button;