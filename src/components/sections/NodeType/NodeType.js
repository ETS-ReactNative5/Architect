import React, { Component } from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import cx from 'classnames';
import Button from '@codaco/ui/lib/components/Button';
import Field from '@components/Form/Field';
import { getFieldId } from '../../../utils/issues';
import NodeSelect from '../../Form/Fields/NodeSelect';
import withDisableAndReset from './withDisableAndReset';
import withCreateNewType from './withCreateNewType';
import withNodeTypeOptions from './withNodeTypeOptions';
import withSubjectVariables from './withSubjectHasNameVariable';
import Section from '../Section';
import Row from '../Row';
import Tip from '../../Tip';

class NodeType extends Component {
  static propTypes = {
    nodeTypes: PropTypes.arrayOf(PropTypes.object),
    disabled: PropTypes.bool,
    typeScreenMessage: PropTypes.any,
    handleResetStage: PropTypes.func.isRequired,
    handleOpenCreateNewType: PropTypes.func.isRequired,
    handleTypeScreenMessage: PropTypes.func.isRequired,
    subjectHasVariableCalledName: PropTypes.bool.isRequired,
    type: PropTypes.string,
  };

  static defaultProps = {
    nodeTypes: [],
    disabled: false,
    displayVariable: null,
    typeScreenMessage: null,
    type: null,
  };

  // componentDidUpdate() {
  //   this.props.handleTypeScreenMessage(this.props.typeScreenMessage);
  // }

  render() {
    const {
      nodeTypes,
      disabled,
      handleResetStage,
      handleOpenCreateNewType,
      subjectHasVariableCalledName,
      onChange,
      onValidate,
      type,
    } = this.props;

    const nodeTypeClasses = cx('stage-editor-section', 'stage-editor-section-node-type', { 'stage-editor-section-node-type--disabled': disabled });

    return (
      <Section contentId="guidance.editor.node_type" className={nodeTypeClasses}>
        <Row>
          <div id={getFieldId('subject')} data-name="Node type" />
          <h2>Node Type</h2>
          <p>Which node type is used on this stage?</p>
          <div
            className="stage-editor-section-node-type__edit"
            onClick={handleResetStage}
          >
            <div className="stage-editor-section-node-type__edit-capture">
              <Field
                name="subject"
                parse={value => ({ type: value, entity: 'node' })}
                format={value => get(value, 'type')}
                options={nodeTypes}
                component={NodeSelect}
                validation={{ required: true }}
                onChange={onChange}
                onValidate={onValidate}
              />

              { nodeTypes.length === 0 &&
                <p className="stage-editor-section-node-type__empty">
                  No node types currently defined. Use the button below to create one.
                </p>
              }

              <Button
                color="primary"
                icon="add"
                size="small"
                onClick={handleOpenCreateNewType}
              >
                Create new node type
              </Button>
              { nodeTypes.length !== 0 && type && !subjectHasVariableCalledName &&
              <Tip type="warning">
                <p>
                  Ensure you create and assign a variable called &quot;name&quot; for this
                  node type, unless you have a good reason not to. Network Canvas will then
                  automatically use this variable as the label for the node in the interview.
                </p>
              </Tip>
              }
            </div>
          </div>
        </Row>
      </Section>
    );
  }
}

export { NodeType };

export default compose(
  withNodeTypeOptions,
  withSubjectVariables,
  // withDisableAndReset,
  // withCreateNewType,
)(NodeType);
