import React from 'react';
import PropTypes from 'prop-types';
import Fade from '@codaco/ui/lib/components/Transitions/Fade';
import window from '@codaco/ui/lib/components/window';

const Window = ({
  show,
  children,
}) => (
  <Fade in={show}>
    <div className="editable-list-window" onClick={(e) => e.stopPropagation()}>
      {show && children}
    </div>
  </Fade>
);

Window.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.node,
};

Window.defaultProps = {
  show: false,
  children: null,
};

export default window(Window);
