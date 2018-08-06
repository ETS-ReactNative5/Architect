import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const asOptionObject = (option) => {
  if (typeof option !== 'string') { return option; }
  return {
    value: option,
    label: option,
  };
};

class Select extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array,
    input: PropTypes.object,
    label: PropTypes.string,
    children: PropTypes.node,
    meta: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    options: [],
    input: {},
    label: null,
    children: null,
    meta: { invalid: false, error: null, touched: false },
  };

  reset = () =>
    this.props.input.onChange(null);

  render() {
    const {
      className,
      input,
      children,
      options,
      label,
      meta: { visited, invalid, error },
      ...rest
    } = this.props;

    const componentClasses = cx(
      'form-fields-select',
      className,
    );

    return (
      <div className={componentClasses}>
        { label &&
          <h4>{label}</h4>
        }
        <div>
          <select className="form-fields-select__input" {...input} {...rest}>
            {children}
            {options.map(
              (option) => {
                const { value, label: optionLabel, ...optionRest } = asOptionObject(option);
                return <option value={value} key={value} {...optionRest}>{optionLabel}</option>;
              },
            )}
          </select>

          <button
            className="form-fields-select__reset"
            onClick={this.reset}
            type="button"
          >reset</button>
        </div>
        {visited && invalid && <p className="form-fields-select__error">{error}</p>}
      </div>
    );
  }
}

export default Select;
