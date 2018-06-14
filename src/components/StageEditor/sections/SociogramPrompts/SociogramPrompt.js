import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { Field, clearFields, isDirty, FormSection } from 'redux-form';
import { keys, get, toPairs } from 'lodash';
import Prompt from '../../Prompt';
import Node from '../../../../ui/components/Node';
import * as Fields from '../../../Form/Fields';

// Background options
const BACKGROUND_IMAGE = 'BACKGROUND/BACKGROUND_IMAGE';
const CONCENTRIC_CIRCLES = 'BACKGROUND/CONCENTRIC_CIRCLES';

// On node click options
const HIGHLIGHT = 'CLICK/HIGHLIGHT';
const CREATE_EDGE = 'CLICK/CREATE_EDGE';

class SociogramPrompt extends Component {
  static propTypes = {
    fieldId: PropTypes.string.isRequired,
    nodeTypes: PropTypes.array.isRequired,
    edgeTypes: PropTypes.array.isRequired,
    layoutsForNodeType: PropTypes.array.isRequired,
    variablesForNodeType: PropTypes.array.isRequired,
    clearField: PropTypes.func.isRequired,
    isDirty: PropTypes.bool,
  };

  static defaultProps = {
    isDirty: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      backgroundType: CONCENTRIC_CIRCLES,
    };
  }

  handleChooseBackgroundType = (option) => {
    this.setState({ backgroundType: option });
  }

  handleHighlightOrCreateEdge = (type) => {
    switch (type) {
      case HIGHLIGHT:
        return this.props.clearField('edges.create');
      case CREATE_EDGE:
        return this.props.clearField('highlight.allowHighlighting');
      default:
        return null;
    }
  }

  render() {
    const { backgroundType } = this.state;
    const {
      fieldId,
      nodeTypes,
      edgeTypes,
      layoutsForNodeType,
      variablesForNodeType,
    } = this.props;

    return (
      <Prompt
        className="stage-editor-section-sociogram-prompt"
        open={this.props.isDirty}
        preview={(
          <Fragment>
            <div className="stage-editor-section-sociogram-prompt__preview-icon">
              <Field
                name={`${fieldId}.subject.type`}

                component={field => (<Node label={field.input.value} />)}
              />
            </div>
            <Field
              name={`${fieldId}.text`}
              component={field => (
                <Markdown
                  className="stage-editor-section-sociogram-prompt__preview-text"
                  source={field.input.value}
                />
              )}
            />
          </Fragment>
        )}
      >
        <FormSection name={fieldId}>
          <div className="stage-editor-section-prompt__group">
            <Field
              name="text"
              component={Fields.TextArea}
              className="stage-editor-section-prompt__setting"
              label="Text for prompt"
              placeholder="Enter text for the prompt here"
            />
          </div>
          <div className="stage-editor-section-prompt__group">
            <h4 className="stage-editor-section-prompt__group-title">Nodes</h4>
            <Field
              name="subject"
              component={Fields.Contexts}
              className="stage-editor-section-prompt__setting"
              parse={value => ({ type: value, entity: 'node' })}
              format={value => get(value, 'type')}
              options={nodeTypes}
              label="Which node would you like to layout?"
            />
          </div>
          <div className="stage-editor-section-prompt__group">
            <h4 className="stage-editor-section-prompt__group-title">Layout</h4>
            <Field
              name="layout.variable"
              component={Fields.Select}
              className="stage-editor-section-prompt__setting"
              label="Layout variable"
            >
              <option disabled value="">Select one</option>
              {layoutsForNodeType.map(([variableName, meta]) => (
                <option value={variableName}>{meta.label}</option>
              ))}
            </Field>
            <Field
              name="layout.allowPositioning"
              component={Fields.Checkbox}
              className="stage-editor-section-prompt__setting"
              label="Allow positioning?"
            />
          </div>
          <div className="stage-editor-section-prompt__group">
            <h4 className="stage-editor-section-prompt__group-title">Attributes</h4>
            <Field
              name="highlight.variable"
              component={Fields.Select}
              className="stage-editor-section-prompt__setting"
              label="Would you like to highlight nodes based on any attribute?"
            >
              <option />
              {variablesForNodeType.map(([variableName, meta]) => (
                <option value={variableName}>{meta.label}</option>
              ))}
            </Field>
            <Field
              name="highlight.allowHighlighting"
              component={Fields.Checkbox}
              className="stage-editor-section-prompt__setting"
              label="Click a node to toggle this attribute (disables edge creation)"
              onChange={() => this.handleHighlightOrCreateEdge(HIGHLIGHT)}
            />
          </div>
          <div className="stage-editor-section-prompt__group">
            <h4 className="stage-editor-section-prompt__group-title">Edges</h4>
            <Field
              name="edges.display"
              component={Fields.CheckboxList}
              className="stage-editor-section-prompt__setting"
              options={edgeTypes}
              label="Which edges would you like to show?"
            />
            <Field
              name="edges.create"
              component={Fields.RadioGroup}
              className="stage-editor-section-prompt__setting"
              options={edgeTypes}
              onChange={() => this.handleHighlightOrCreateEdge(CREATE_EDGE)}
              label="Click nodes to create an edge? (disables attribute toggling)"
            />
          </div>
          <div className="stage-editor-section-prompt__group">
            <h4 className="stage-editor-section-prompt__group-title">Background</h4>
            <Fields.Mode
              label="Choose a background type"
              className="stage-editor-section-prompt__setting"
              options={[
                [CONCENTRIC_CIRCLES, 'Circles'],
                [BACKGROUND_IMAGE, 'Image'],
              ]}
              input={{
                value: backgroundType,
                onChange: this.handleChooseBackgroundType,
              }}
            />
            { (backgroundType === CONCENTRIC_CIRCLES) &&
              <Fragment>
                <Field
                  name="background.concentricCircles"
                  component={Fields.Text}
                  className="stage-editor-section-prompt__setting"
                  label="How many circles?"
                  type="number"
                  placeholder="5"
                />
                <Field
                  name="background.skewedTowardCenter"
                  component={Fields.Checkbox}
                  className="stage-editor-section-prompt__setting"
                  label="Skewed towards center?"
                />
              </Fragment>
            }
            { (backgroundType === BACKGROUND_IMAGE) &&
              <div style={{ position: 'relative', minHeight: '100px' }}>
                <Field
                  name="background.image"
                  component={Fields.Image}
                  className="stage-editor-section-prompt__setting"
                  label="Background image"
                />
              </div>
            }
          </div>
        </FormSection>
      </Prompt>
    );
  }
}

const getVariablesForNodeType = (state, nodeType) => {
  const variableRegistry = get(state, 'protocol.present.variableRegistry', {});
  return get(variableRegistry, ['node', nodeType, 'variables'], {});
};

const mapStateToProps = (state, props) => {
  const nodeType = get(props.form.getValues(state, props.fieldId), 'subject.type');
  const variables = toPairs(getVariablesForNodeType(state, nodeType));
  const isFieldDirty = isDirty(props.form.name);

  return {
    layoutsForNodeType: variables.filter(([, meta]) => meta.type === 'layout'),
    variablesForNodeType: variables.filter(([, meta]) => meta.type === 'boolean'),
    isDirty: isFieldDirty(state, props.fieldId),
    nodeTypes: keys(state.protocol.present.variableRegistry.node),
    edgeTypes: keys(state.protocol.present.variableRegistry.edge),
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  clearField: (field) => {
    dispatch(clearFields(props.form.name, false, false, `${props.fieldId}.${field}`));
  },
});

export { SociogramPrompt };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  SociogramPrompt,
);
