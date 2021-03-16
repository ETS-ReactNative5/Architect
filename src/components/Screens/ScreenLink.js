import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionCreators as screenActions } from '@modules/ui/screens';

const ScreenLink = ({
  children,
  screen,
  openScreen,
  onClick,
  ...options
}) => {
  const handleOpenStage = useCallback(() => {
    openScreen(screen, options);
    if (onClick) { onClick(); }
  }, ['openScreen', 'onClick']);

  return (
    <div className="screen-link" onClick={handleOpenStage}>
      {children}
    </div>
  );
};

ScreenLink.propTypes = {
  openScreen: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  screen: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

ScreenLink.defaultProps = {
  onClick: null,
};

const mapDispatchToProps = {
  openScreen: screenActions.openScreen,
};

export default connect(null, mapDispatchToProps)(ScreenLink);
