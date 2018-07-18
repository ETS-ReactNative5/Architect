import React, { Component } from 'react';
import { Form } from 'redux-form';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { get, keys, map, toPairs, fromPairs } from 'lodash';
import { ValidatedField, MultiSelect } from '../Form';
import * as Fields from '../../ui/components/Fields';
import * as ArchitectFields from '../Form/Fields';
import { Guided } from '../Guided';
import Guidance from '../Guidance';
import Disable from '../Disable';
import FormCodeView from '../FormCodeView';
import NodeType from './NodeType';

const allowedTypes = ['text', 'number', 'boolean'];

const getInputsForType = (type) => {
  switch (type) {
    case 'boolean':
      return ['Checkbox'];
    default:
      return ['TextInput', 'SeamlessText'];
  }
};

const optionGetter = (variables) => {
  const allowedVariables = fromPairs(
    toPairs(variables)
      .filter(([, options]) => allowedTypes.includes(options.type)),
  );
  const variableNames = keys(allowedVariables);

  return (property, rowValues, allValues) => {
    const variable = get(rowValues, 'variable');
    switch (property) {
      case 'variable': {
        const used = map(allValues, 'variable');
        return variableNames
          .map(
            value =>
              ({ value, label: value, disabled: value !== variable && used.includes(value) }),
          );
      }
      case 'component':
        return getInputsForType(get(variables, [variable, 'type']));
      default:
        return [];
    }
  };
};

class FormEditor extends Component {
  handleAttemptTypeChange = () => {
    // eslint-disable-next-line no-alert
    if (confirm('First you will need to reset the rest of the form, are you sure?')) {
      this.props.resetFields();
    }
  }

  render() {
    const {
      nodeTypes,
      variables,
      handleSubmit,
      toggleCodeView,
      codeView,
      form,
      dirty,
      valid,
    } = this.props;

    return (
      <Form onSubmit={handleSubmit} className={cx('stage-editor', { 'stage-editor--show-code': codeView })}>
        <FormCodeView toggleCodeView={toggleCodeView} form={form} />
        <Guided
          className="stage-editor__sections"
          form={form}
        >
          <h1>Edit Form</h1>
          { dirty && !valid && (
            <p style={{ color: 'var(--error)' }}>
              There are some errors that need to be fixed before this can be saved!
            </p>
          ) }
          <small>(<a onClick={toggleCodeView}>Show Code View</a>)</small>

          <Guidance contentId="guidance.form.title">
            <div className="stage-editor-section">
              <h2>Title</h2>
              <ValidatedField
                name="title"
                component={ArchitectFields.SeamlessText}
                placeholder="Enter your title here"
                validation={{ required: true }}
              />
            </div>
          </Guidance>

          <Guidance contentId="guidance.form.type">
            <div className="stage-editor-section">
              <h2>Type</h2>
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
              <h2>Form variables</h2>
              <MultiSelect
                name="fields"
                properties={[
                  'variable',
                  'component',
                ]}
                options={optionGetter(variables)}
              />
            </div>
          </Guidance>

          <Guidance contentId="guidance.form.continue">
            <div className="stage-editor-section">
              <ValidatedField
                name="optionToAddAnother"
                component={ArchitectFields.Mode}
                label="Enable 'Add another' option"
                options={[[true, 'enabled'], [false, 'disabled']]}
                validation={{ required: true }}
              />
            </div>
          </Guidance>
        </Guided>
      </Form>
    );
  }
}

FormEditor.propTypes = {
  toggleCodeView: PropTypes.func.isRequired,
  codeView: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  resetFields: PropTypes.func.isRequired,
  nodeType: PropTypes.string,
  variables: PropTypes.object.isRequired,
  nodeTypes: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
};

FormEditor.defaultProps = {
  nodeType: null,
};

export { FormEditor };

export default FormEditor;