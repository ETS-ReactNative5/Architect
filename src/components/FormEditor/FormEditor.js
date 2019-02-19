import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { get, map, toPairs, fromPairs } from 'lodash';
import { ValidatedField, MultiSelect } from '../Form';
import * as Fields from '../../ui/components/Fields';
import SelectOptionImage from '../Form/Fields/SelectOptionImage';
import SelectOptionVariable from '../Form/Fields/SelectOptionVariable';
import Guidance from '../Guidance';
import Disable from '../Disable';
import NodeType from './NodeType';
import { getFieldId } from '../../utils/issues';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';


const allowedTypes = ['text', 'number', 'boolean', 'ordinal', 'categorical'];

const inputDefinitions = {
  NumberInput: {
    label: 'Number Input',
    value: 'Number',
    description: 'This input is optomized for collecting numerical data, and will show a number pad if available.',
    image: 'TextInput',
  },
  Checkbox: {
    label: 'Checkbox',
    value: 'Checkbox',
    description: 'This is a simple checkbox component that can be clicked or tapped to toggle a value between true or false.',
    image: 'Checkbox',
  },
  CheckboxGroup: {
    label: 'Checkbox Group',
    value: 'CheckboxGroup',
    description: 'This component provides a group of checkboxes so that multiple values can be toggled on or off.',
    image: 'CheckboxGroup',
  },
  Toggle: {
    label: 'Toggle',
    value: 'Toggle',
    description: 'This component renders a switch, which can be tapped or clicked to indicate "on" or "off".',
    image: 'Toggle',
  },
  RadioGroup: {
    label: 'Radio Group',
    value: 'RadioGroup',
    description: 'This will render a group of options and allow the user to choose one. Useful for likert-type scales or other ordinal variables.',
    image: 'RadioGroup',
  },
  ToggleButton: {
    label: 'Toggle Button',
    value: 'ToggleButton',
    description: 'This component provides a colorful button that can be toggled "on" or "off". It is useful for categorical variables where multiple options can be selected.',
    image: 'ToggleButton',
  },
  ToggleButtonGroup: {
    label: 'Toggle Button Group',
    value: 'ToggleButtonGroup',
    description: 'This component provides a colorful button that can be toggled "on" or "off". It is useful for categorical variables where multiple options can be selected.',
    image: 'ToggleButtonGroup',
  },
  TextInput: {
    label: 'Text Input',
    value: 'Text',
    description: 'This is a standard text input, allowing for simple data entry up to approximately 30 characters.',
    image: 'TextInput',
  },
};

const getInputsForType = (type) => {
  switch (type) {
    case 'number':
      return [inputDefinitions.TextInput, inputDefinitions.NumberInput];
    case 'text':
      return [inputDefinitions.TextInput];
    case 'boolean':
      return [inputDefinitions.Checkbox, inputDefinitions.Toggle, inputDefinitions.ToggleButton];
    case 'ordinal':
      return [inputDefinitions.RadioGroup];
    case 'categorical':
      return [inputDefinitions.CheckboxGroup, inputDefinitions.ToggleButtonGroup];
    default:
      return [inputDefinitions.TextInput];
  }
};

const optionGetter = (variables) => {
  const allowedVariables = fromPairs(
    toPairs(variables)
      .filter(([, options]) => allowedTypes.includes(options.type)),
  );
  return (property, rowValues, allValues) => {
    const variable = get(rowValues, 'variable');
    switch (property) {
      case 'variable': {
        const used = map(allValues, 'variable');
        return map(
          allowedVariables,
          (value, id) => ({
            value: id,
            label: value.label,
            name: value.name,
            description: value.description,
            isDisabled: value !== variable && used.includes(value),
          }),
        );
      }
      case 'component':
        return getInputsForType(get(variables, [variable, 'type']));
      default:
        return [{}];
    }
  };
};

class FormEditor extends Component {
  handleAttemptTypeChange = () => {
    this.props.openDialog({
      type: 'Confirm',
      title: 'Change node type',
      message: 'Changing the node type now will reset the rest of the form configuration. Do you want to continue?',
      onConfirm: () => { this.props.resetFields(); },
      confirmLabel: 'Continue',
    });
  }

  render() {
    const {
      nodeTypes,
      variables,
      toggleCodeView,
    } = this.props;

    return (
      <div>
        <div className="code-button">
          <small>
            (<a onClick={toggleCodeView}>Show Code View</a>)
          </small>
        </div>
        <h1 className="editor__heading">Edit Form</h1>

        <Guidance contentId="guidance.form.title">
          <div className="stage-editor-section">
            <h2 id={getFieldId('title')}>Title</h2>
            <ValidatedField
              name="title"
              component={Fields.Text}
              placeholder="Enter your title here"
              validation={{ required: true }}
            />
          </div>
        </Guidance>

        <Guidance contentId="guidance.form.type">
          <div className="stage-editor-section">
            <h2 id={getFieldId('type')}>Node Type</h2>
            <Disable
              disabled={!!this.props.nodeType}
              className="stage-editor__reset"
              onClick={this.props.nodeType ? this.handleAttemptTypeChange : () => {}}
            >
              <ValidatedField
                name="type"
                component={Fields.RadioGroup}
                placeholder="Enter your title here"
                className="form-fields-node-select"
                options={nodeTypes}
                validation={{ required: true }}
                optionComponent={NodeType}
              >
                <option value="" disabled>&mdash; Select type &mdash;</option>
              </ValidatedField>
            </Disable>
          </div>
        </Guidance>

        <Guidance contentId="guidance.form.variables">
          <div className="stage-editor-section">
            <h2>Add Variables and Input Types</h2>
            <p>
              Use this section to add variables from the codebook to the form, and map them
              to your preferred input type.
            </p>
            <MultiSelect
              name="fields"
              properties={[
                {
                  fieldName: 'variable',
                  selectOptionComponent: SelectOptionVariable,
                },
                {
                  fieldName: 'component',
                  selectOptionComponent: SelectOptionImage,
                },
              ]}
              options={optionGetter(variables)}
            />
          </div>
        </Guidance>
      </div>
    );
  }
}

FormEditor.propTypes = {
  toggleCodeView: PropTypes.func.isRequired,
  resetFields: PropTypes.func.isRequired,
  nodeType: PropTypes.string,
  variables: PropTypes.object.isRequired,
  nodeTypes: PropTypes.array.isRequired,
  openDialog: PropTypes.func.isRequired,
};

FormEditor.defaultProps = {
  nodeType: null,
};

const mapDispatchToProps = dispatch => ({
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
});

export { FormEditor };

export default connect(null, mapDispatchToProps)(FormEditor);
