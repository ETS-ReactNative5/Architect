import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import NativeSelect from '@components/Form/Fields/NativeSelect';
import RichText from '@codaco/ui/lib/components/Fields/RichText/Field';
import { Section, Row } from '@components/EditorLayout';
import { getFieldId } from '@app/utils/issues';
import NewVariableWindow, { useNewVariableWindowState } from '@components/NewVariableWindow';
import ValidatedField from '@components/Form/ValidatedField';
import VariableSelect from '@components/Form/Fields/VariableSelect';
import Tip from '@components/Tip';
import Options from '@components/Options';
import withVariableOptions from './withVariableOptions';
import withCreateEdgeHandlers from './withCreateEdgeHandler';
import withEdgesOptions from './withEdgesOptions';

const PromptFields = ({
  form,
  changeForm,
  edgesForSubject,
  handleCreateEdge,
  handleChangeCreateEdge,
  createEdge,
  edgeVariable,
  variableOptions,
  optionsForVariable,
  optionsForVariableDraft,
}) => {
  const newVariableWindowInitialProps = {
    entity: 'edge',
    type: createEdge,
    initialValues: { name: null, type: null },
  };

  console.log('blah', {
    edgeVariable, variableOptions, optionsForVariable, optionsForVariableDraft,
  });

  const handleCreatedNewVariable = (id, { field }) => changeForm(form, field, id);

  const [newVariableWindowProps, openNewVariableWindow] = useNewVariableWindowState(
    newVariableWindowInitialProps,
    handleCreatedNewVariable,
  );

  const handleNewVariable = (name) => openNewVariableWindow({ initialValues: { name, type: 'ordinal' } }, { field: 'edgeVariable' });

  const totalOptionsLength = (optionsForVariableDraft && optionsForVariableDraft.length);
  const showVariableOptionsTip = totalOptionsLength > 5;

  return (
    <>
      <Section>
        <Row>
          <h3 id={getFieldId('text')}>Tie-Strength Census Prompts</h3>
          <p>
            Tie-Strength Census prompts explain to your participant which relationship they should
            evaluate (for example, &apos;friendship&apos;, &apos;material
            support&apos; or &apos;conflict&apos;). Enter prompt text below, and select an
            edge type that will be created when the participant answers &apos;yes&apos;.
          </p>
          <p>
            Remember to write your prompt text to take into account that the participant will be
            looking at pairs of prompts in sequence. Use phrases such
            as &apos;
            <strong>these people</strong>
            &apos;,
            or &apos;
            <strong>the two people shown</strong>
            &apos; to
            indicate that the participant should focus on the visible pair.
          </p>
          <ValidatedField
            name="text"
            component={RichText}
            className="stage-editor-section-prompt__textarea"
            label="Prompt Text"
            placeholder="Enter text for the prompt here..."
            validation={{ required: true, maxLength: 220 }}
          />
        </Row>
        <Section>
          <h2 id={getFieldId('set-ordinal-value')}>Tie Strength Configuration</h2>
          <p>This interface works by presenting the user with a choice to either:</p>
          <ul>
            <li>
              Create an edge between two alters, and simultaneously assign a value to
              an ordinal variable.
            </li>
            <li>
              Decline to create an edge
            </li>
          </ul>
          <p>
            Begin by selecting or creating an edge type. You will then be able to select
            or create an ordinal variable on this edge type. The options of this ordinal
            variable will represent the choices provided to the user when creating an edge.
          </p>
          <Row>
            <ValidatedField
              name="createEdge"
              component={NativeSelect}
              options={edgesForSubject}
              onCreateOption={(option) => {
                handleChangeCreateEdge(handleCreateEdge(option));
              }}
              onChange={handleChangeCreateEdge}
              placeholder="Select or create an edge type"
              createLabelText="✨ Create new edge type ✨"
              createInputLabel="New edge type name"
              createInputPlaceholder="Enter an edge type..."
              label="Select an edge type"
              validation={{ required: true, allowedNMToken: 'edge type name' }}
            />
          </Row>
          { createEdge
          && (
            <>
              <Row>
                <ValidatedField
                  name="edgeVariable"
                  component={VariableSelect}
                  entity="edge"
                  type="ordinal"
                  label="Select an ordinal variable for this edge type"
                  options={variableOptions}
                  onCreateOption={handleNewVariable}
                  validation={{ required: true }}
                />
              </Row>
              { edgeVariable && (
              <Row>
                <h3 id={getFieldId('variableOptions')}>Variable Options</h3>
                <p>
                  The following choices or &apos;options&apos; are configured for this variable.
                  We suggest no more than four options should be used on this interface.
                </p>
                { showVariableOptionsTip
                && (
                <Tip type="error">
                  <p>
                    The ordinal bin interface is designed to use
                    { ' ' }
                    <strong>
                      up to 5 option values
                    </strong>
                    including the negative label. Using more will create
                    a sub-optimal experience for participants, and might reduce data quality.
                  </p>
                </Tip>
                )}
                <Options
                  name="variableOptions"
                  label="Options"
                />
              </Row>
              )}
            </>
          )}
          <Row>
            <h3 id={getFieldId('negativeLabel')}>Label for decline option</h3>
            <p>
              Enter text to display in the option that will
              { ' ' }
              <strong>cancel edge creation</strong>
              . This option will be shown on the far right of the screen. Use
              the preview mode to verify the visual display of your text.
            </p>
            <ValidatedField
              name="negativeLabel"
              component={RichText}
              inline
              className="stage-editor-section-prompt__textarea"
              label=""
              placeholder="Enter text for the negative label here..."
              validation={{ required: true, maxLength: 220 }}
            />
          </Row>
        </Section>
      </Section>
      <NewVariableWindow
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...newVariableWindowProps}
      />
    </>
  );
};

PromptFields.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  edgesForSubject: PropTypes.array.isRequired,
  handleCreateEdge: PropTypes.func.isRequired,
  handleChangeCreateEdge: PropTypes.func.isRequired,
};

export default compose(
  withCreateEdgeHandlers,
  withEdgesOptions,
  withVariableOptions,
)(PromptFields);
