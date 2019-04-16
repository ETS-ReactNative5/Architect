/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import { getFieldId } from '../../../utils/issues';
import { ValidatedField } from '../../Form';
import * as ArchitectFields from '../../Form/Fields';
import * as Fields from '../../../ui/components/Fields';
import { Row } from '../../OrderedList';
import NewVariableWindow from '../../NewVariableWindow';
import withOptionsForPreset from './withOptionsForPreset';
import withNewVariableWindowHandlers, {
  propTypes as newVariableWindowPropTypes,
} from '../../enhancers/withNewVariableWindowHandlers';

const PresetFields = ({
  entity,
  type,
  layoutVariblesForSubject,
  groupVariablesForSubject,
  edgesForSubject,
  highlightVariablesForSubject,
  handleCreateLayoutVariable,
  handleCreateGroupVariable,
  openNewVariableWindow,
  closeNewVariableWindow,
  newVariableName,
  showNewVariableWindow,
}) => (
  <React.Fragment>
    <Row>
      <h3 id={getFieldId('text')}>Preset label</h3>
      <ValidatedField
        name="label"
        component={Fields.Text}
        label=""
        placeholder="Enter a label for the preset here"
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <ValidatedField
        name="layoutVariable"
        component={ArchitectFields.CreatableSelect}
        label="Layout variable"
        placeholder="&mdash; Select a layout variable &mdash;"
        validation={{ required: true }}
        options={layoutVariblesForSubject}
        onCreateOption={handleCreateLayoutVariable}
      />
    </Row>
    <Row>
      <ValidatedField
        name="groupVariable"
        component={ArchitectFields.CreatableSelect}
        label="Group variable"
        options={groupVariablesForSubject}
        onCreateOption={name => openNewVariableWindow(name)}
      />
    </Row>
    <Row>
      <Field
        name="edges.display"
        component={Fields.CheckboxGroup}
        label="Display the following edges:"
        placeholder="&mdash; Toggle an edge to display &mdash;"
        options={edgesForSubject}
      />
    </Row>
    <Row>
      <Field
        name="highlight"
        component={Fields.CheckboxGroup}
        label="Highlight nodes with the following attribute:"
        placeholder="&mdash; Toggle a variable to highlight &mdash;"
        options={highlightVariablesForSubject}
      />
    </Row>

    <NewVariableWindow
      initialValues={{
        type: 'categorical',
        name: newVariableName,
      }}
      show={showNewVariableWindow}
      entity={entity}
      type={type}
      onComplete={handleCreateGroupVariable}
      onCancel={closeNewVariableWindow}
    />
  </React.Fragment>
);

PresetFields.propTypes = {
  layoutVariblesForSubject: PropTypes.array,
  groupVariablesForSubject: PropTypes.array,
  edgesForSubject: PropTypes.array,
  highlightVariablesForSubject: PropTypes.array,
  handleCreateLayoutVariable: PropTypes.func.isRequired,
  handleCreateGroupVariable: PropTypes.func.isRequired,
  ...newVariableWindowPropTypes,
};

PresetFields.defaultProps = {
  layoutVariblesForSubject: [],
  groupVariablesForSubject: [],
  edgesForSubject: [],
  highlightVariablesForSubject: [],
};

export { PresetFields };

export default compose(
  withNewVariableWindowHandlers,
  withOptionsForPreset,
)(PresetFields);
