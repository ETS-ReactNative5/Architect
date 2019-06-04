import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import * as Fields from '../../../ui/components/Fields';
import Select from '../../Form/Fields/Select';
import CreatableSelect from '../../Form/Fields/CreatableSelect';
import Options from '../../Options';
import Validations from '../../Validations';
import SelectOptionImage from '../../Form/Fields/SelectOptionImage';
import inputOptions, { isVariableTypeWithOptions } from '../../Form/inputOptions';
import Row from '../Row';
import Section from '../Section';
import withFieldsMeta from './withFieldsHandlers';

const PromptFields = ({
  form,
  variable,
  variableType,
  variableOptions,
  createNewVariable,
  handleChangeComponent,
  handleChangeVariable,
}) => (
  <Section>
    <Row contentId="guidance.section.form.field.name">
      <h3 id={getFieldId('variable')}>Variable</h3>
      <p>
        Create a variable below, or choose from existing variables in the drop-down list.
      </p>
      <p>
        <strong>
        Tip: When selecting an existing variable, changes you make to the input control or
        validation options will also change other uses of this variable.
        </strong>
      </p>
      <ValidatedField
        name="variable"
        component={CreatableSelect}
        options={variableOptions} // from variables
        onCreateOption={createNewVariable} // reset later fields, create variable of no type?
        onChange={handleChangeVariable} // read/reset component options validation
        validation={{ required: true }}
        placeholder="Type to create a new variable, or select an existing one from the list..."
        formatCreateLabel={inputValue => (
          <span>
            Press enter to create a variable named &quot;{inputValue}&quot;.
          </span>
        )}
      />
    </Row>
    <Row contentId="guidance.section.form.field.prompt">
      <h3 id={getFieldId('prompt')}>Question prompt</h3>
      <p>Enter question for the particpant. e.g. What is this person&apos;s name?</p>
      <ValidatedField
        name="prompt"
        component={Fields.Text}
        placeholder="What is this person's name?"
        validation={{ required: true }}
      />
    </Row>
    { variable &&
      <Row contentId="guidance.section.form.field.component">
        <h3 id={getFieldId('component')}>Input control</h3>
        <p>Choose an input control that should be used to collect the answer.</p>
        <ValidatedField
          name="component"
          component={Select}
          placeholder="Select component"
          options={inputOptions}
          selectOptionComponent={SelectOptionImage}
          validation={{ required: true }}
          onChange={handleChangeComponent}
        />
      </Row>
    }
    { isVariableTypeWithOptions(variableType) &&
      <Row contentId="guidance.section.form.field.Options">
        <h3 id={getFieldId('options')}>Categorical/Ordinal options</h3>
        <p>
          The input type you selected indicates that this is a categorical or ordinal variable.
          Next, please create a minimum of two possible values for the participant to choose
          between.
        </p>
        <Options
          name="options"
          label="Options"
          form={form}
        />
      </Row>
    }
    { variableType &&
      <Row contentId="guidance.section.form.field.validation">
        <h3 id={getFieldId('validation')}>Validation</h3>
        <p>Select any input requirements that you would like to enforce.</p>
        <Validations
          form={form}
          name="validation"
          variableType={variableType}
        />
      </Row>
    }
  </Section>
);

PromptFields.propTypes = {
  form: PropTypes.string.isRequired,
  variable: PropTypes.string,
  variableType: PropTypes.string,
  handleChangeComponent: PropTypes.func.isRequired,
  variableOptions: PropTypes.array,
  createNewVariable: PropTypes.func.isRequired,
  handleChangeVariable: PropTypes.func.isRequired,
};

PromptFields.defaultProps = {
  variable: null,
  variableType: null,
  variableOptions: null,
};

export { PromptFields };

export default compose(
  withFieldsMeta,
)(PromptFields);
