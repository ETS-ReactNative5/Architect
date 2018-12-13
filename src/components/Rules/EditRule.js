import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { has } from 'lodash';
import Modal from '../../ui/components/Modal';
import EditAlterVariableRule from './EditAlterVariableRule';
import EditAlterTypeRule from './EditAlterTypeRule';
import EditEdgeRule from './EditEdgeRule';
import EditEgoRule from './EditEgoRule';
import Button from '../../ui/components/Button';

class EditRule extends Component {
  get TypeComponent() {
    switch (this.props.rule.type) {
      case 'ego':
        return EditEgoRule;
      case 'edge':
        return EditEdgeRule;
      case 'alter': {
        if (!has(this.props.rule.options, 'variable')) {
          return EditAlterTypeRule;
        }
        return EditAlterVariableRule;
      }
      default:
        return null;
    }
  }

  handleSave = () => {
    this.props.onSave();
  }

  render() {
    return (
      <Modal show={!!this.props.rule}>
        <div className="rules-edit-rule">
          { this.props.rule && this.props.rule.options &&
            <this.TypeComponent
              rule={this.props.rule}
              variableRegistry={this.props.variableRegistry}
              onChange={this.props.onChange}
            />
          }
          <Button type="button" onClick={this.props.onSave}>Save</Button>
          <Button type="button" onClick={this.props.onCancel}>Cancel</Button>
        </div>
      </Modal>
    );
  }
}

EditRule.propTypes = {
  rule: PropTypes.shape({
    type: PropTypes.string,
    options: PropTypes.object,
  }).isRequired,
  variableRegistry: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export { EditRule };

export default EditRule;
