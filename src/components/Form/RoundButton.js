import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from '@codaco/ui';

const RoundButton = ({
  icon, content, size, className, ...props
}) => (
  <button
    className={cx('form-round-button', className, { [`form-round-button--${size}`]: !!size })}
    {...props}
  >
    { (icon && <Icon name={icon} />) || content }
  </button>
);

RoundButton.propTypes = {
  icon: PropTypes.string,
  content: PropTypes.string,
  size: PropTypes.oneOf(['small', 'default', 'large']),
  className: PropTypes.string,
};

RoundButton.defaultProps = {
  icon: null,
  content: null,
  className: '',
  size: 'default',
  type: 'button',
};

export default RoundButton;
