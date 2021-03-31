import React from 'react';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import cx from 'classnames';

const panelVariants = {
  show: { opacity: 1, y: 0, transition: { ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.3 } },
  hide: { opacity: 0, y: 100 },
};

const buttonVariants = {
  show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  hide: { opacity: 0, y: 10 },
};

const animatedButton = (button, index) => (
  <motion.div
    key={(button && button.key) || index}
    variants={buttonVariants}
    initial="hide"
    animate="show"
    exit="hide"
    layout
  >
    {button}
  </motion.div>
);

const ControlBar = ({ buttons, secondaryButtons, className }) => {
  const buttonLayout = [
    <motion.div layout className="control-bar__secondary-buttons" key="secondary">
      <AnimateSharedLayout>
        <AnimatePresence>
          { secondaryButtons
            && Array.from(secondaryButtons).map(animatedButton)}
        </AnimatePresence>
      </AnimateSharedLayout>
    </motion.div>,
    <motion.div layout className="control-bar__primary-buttons" key="primary">
      <AnimateSharedLayout>
        <AnimatePresence>
          { buttons
            && Array.from(buttons).map(animatedButton)}
        </AnimatePresence>
      </AnimateSharedLayout>
    </motion.div>,
  ];

  return (
    <motion.div
      className={cx(
        'control-bar',
        className,
      )}
      variants={panelVariants}
      initial="hide"
      animate="show"
      // initial={{ y: 100, opacity: 0 }}
      // animate={{ y: 0, opacity: 1 }}
    >
      { buttonLayout }
    </motion.div>
  );
};

ControlBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  secondaryButtons: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
};

ControlBar.defaultProps = {
  buttons: null,
  secondaryButtons: null,
  className: '',
};

export default ControlBar;
