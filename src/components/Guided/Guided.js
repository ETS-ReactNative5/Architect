import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

class Guided extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    className: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      active: 1,
    };
  }

  onMouseOver = (index) => {
    this.setState({ active: index });
  };

  renderSections = () =>
    React.Children.toArray(this.props.children)
      .map((child, index) => {
        const isActive = this.state.active === index;
        return React.cloneElement(
          child,
          {
            isActive,
            key: index,
            onMouseOver: () => { this.onMouseOver(index); },
          },
        );
      });

  render() {
    const className = this.props.className;

    return (
      <div className={cx('guided', className)}>
        { this.renderSections() }
      </div>
    );
  }
}

export default Guided;
