import React from 'react';
import cx from 'classnames';
import { motion } from 'framer-motion';
import { Button } from '@codaco/ui';
import networkCanvasLogo from '@app/images/NC-Mark.svg';
import headerGraphic from '@app/images/Arc-Flat.svg';
import Version from '@components/Version';
import Section from './Section';
import Group from './Group';
import Switch from './Switch';
import useAppState from './useAppState';
import { openExternalLink } from '../ExternalLink';

const WelcomeHeader = () => {
  const [isOpen, setIsOpen] = useAppState('showWelcome', true);

  const classes = cx(
    'welcome-header',
    { 'welcome-header--is-open': isOpen },
  );

  const start = {
    show: {
      height: '100%',
      transition: {
        type: 'spring',
      },
    },
    hide: {
      height: '0px',
    },
  };

  const expand = {
    show: {
      height: '100%',
      transition: { when: 'beforeChildren', type: 'spring' },
    },
    hide: {
      height: '0px',
    },
  };

  return (
    <Section className={classes}>
      <Group className="welcome-header__header">
        <div className="welcome-header__title">
          <div className="project-tag">
            <img src={networkCanvasLogo} alt="A Network Canvas project" style={{ height: '2.4rem', width: '2.4rem' }} />
            <h5>Network Canvas</h5>
          </div>
          <h1>Architect</h1>
          <p>A tool for creating Network Canvas Interviews</p>
        </div>
        <img className="logo" src={headerGraphic} alt="Network Canvas Architect" />
        <Version />
        <Switch
          className="welcome-header__header-toggle"
          label="Show welcome section"
          on={isOpen}
          onChange={() => setIsOpen(!isOpen)}
        />
      </Group>
      <motion.section
        className="welcome-header__panel"
        variants={expand}
      >
        <motion.div
          variants={start}
          animate={isOpen ? 'show' : 'hide'}
        >
          <Group
            className="home-welcome"
          >
            <div className="home-welcome__content">
              <h2>Welcome to Architect!</h2>
              <p>
                If you are new to the software, please consider watching the overview
                video to the left. It will explain how the software works, and introduce
                all the essential skills needed to build an interview protocol. We also
                have extensive tutorials and information on a range of topics on our
                documentation website, which you can visit using the link below.
              </p>
              <p>
                Alternatively, to get started right away use the buttons below to
                create a new interview protocol, or open an existing one from elsewhere
              </p>
              <div className="welcome-actions">
                <Button
                  color="primary"
                  onClick={() => openExternalLink('https://www.youtube.com/watch?v=XzfE6j-LnII')}
                >
                  Watch overview video
                </Button>
                <Button
                  color="sea-serpent"
                  onClick={() => openExternalLink('https://documentation.networkcanvas.com')}
                >
                  Visit documentation website
                </Button>
              </div>
            </div>
          </Group>
        </motion.div>
      </motion.section>
    </Section>
  );
};

export default WelcomeHeader;