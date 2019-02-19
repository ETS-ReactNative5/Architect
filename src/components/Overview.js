import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Flipped } from 'react-flip-toolkit';
import { map, get, size } from 'lodash';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { Node, Button, Icon } from '../ui/components';
import FormCard from './StageEditor/sections/Form/FormCard';
import * as Fields from '../ui/components/Fields';
import ProtocolLink from './ProtocolLink';
import { getProtocol } from '../selectors/protocol';
import { actionCreators as protocolActions } from '../ducks/modules/protocol';

class Overview extends Component {
  get renderNodeTypes() {
    const nodeTypes = get(this.props.codebook, 'node', {});
    if (size(nodeTypes) === 0) {
      return (
        <em>No node types defined, yet. <ProtocolLink to="codebook/node/">Create one?</ProtocolLink></em>
      );
    }

    return map(
      nodeTypes,
      (node, key) => (
        <ProtocolLink to={`codebook/node/${key}`} key={key}>
          <Node label={node.label} color={get(node, 'color', '')} />
        </ProtocolLink>
      ),
    );
  }

  get renderEdgeTypes() {
    const edgeTypes = get(this.props.codebook, 'edge', {});

    if (size(edgeTypes) === 0) {
      return (
        <em>No edge types defined, yet. <ProtocolLink to="codebook/edge/">Create one?</ProtocolLink></em>
      );
    }

    return map(
      edgeTypes,
      (edge, key) => (
        <ProtocolLink
          to={`codebook/edge/${key}`}
          key={key}
          title={edge.label}
        >
          <Icon name="links" color={get(edge, 'color', '')} />
        </ProtocolLink>
      ),
    );
  }

  get renderForms() {
    const forms = this.props.forms;
    const nodeTypes = get(this.props.codebook, 'node', {});
    if (size(nodeTypes) === 0) {
      return (
        <React.Fragment>
          <em>No forms defined, yet. Create one or more node types and then create a form.</em>
        </React.Fragment>
      );
    }

    if (size(forms) === 0) {
      return (
        <em>No forms defined, yet. <ProtocolLink to="form/">Create one?</ProtocolLink></em>
      );
    }

    return (
      <React.Fragment>
        {map(
          forms,
          (form, key) => (
            <ProtocolLink key={key} to={`form/${key}`}>
              <FormCard
                label={form.title}
                input={{
                  onChange: () => {},
                  value: ' ',
                }}
              />
            </ProtocolLink>
          ),
        )}
      </React.Fragment>
    );
  }

  render() {
    const {
      name,
      description,
      updateOptions,
      show,
      flipId,
    } = this.props;

    if (!show || !flipId) { return null; }

    return (
      <React.Fragment>
        <Flipped flipId={flipId}>
          <div className="overview">
            <div className="overview__panel">
              <div className="overview__groups">
                <div className="overview__group overview__group--title">
                  <h1 className="overview__name">{name}</h1>
                  <Fields.Text
                    className="timeline-overview__name"
                    placeholder="Enter a description for your protocol here"
                    label="Protocol description"
                    input={{
                      value: description,
                      onChange:
                        ({ target: { value } }) => {
                          updateOptions({ description: value });
                        },
                    }}
                  />
                </div>
                <div className="overview__group overview__group--codebook">
                  <legend className="overview__group-title">Codebook</legend>
                  <div className="overview__group-section">
                    <h4>Node types</h4>
                    { this.renderNodeTypes }
                  </div>
                  <div className="overview__group-section">
                    <h4>Edge types</h4>
                    { this.renderEdgeTypes }
                  </div>
                  <div className="overview__manage-button">
                    <ProtocolLink to={'codebook'}>
                      <Button size="small">Manage codebook</Button>
                    </ProtocolLink>
                  </div>
                </div>
                <div className="overview__group overview__group--forms">
                  <legend className="overview__group-title">Forms</legend>
                  { this.renderForms }
                  <div className="overview__manage-button">
                    <ProtocolLink to={'forms'}>
                      <Button size="small">Manage forms</Button>
                    </ProtocolLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Flipped>
      </React.Fragment>
    );
  }
}

Overview.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  forms: PropTypes.object.isRequired,
  codebook: PropTypes.object.isRequired,
  updateOptions: PropTypes.func,
  flipId: PropTypes.string,
  show: PropTypes.bool,
};

Overview.defaultProps = {
  show: true,
  name: null,
  description: '',
  flipId: null,
  updateOptions: () => {},
};

const mapDispatchToProps = dispatch => ({
  updateOptions: bindActionCreators(protocolActions.updateOptions, dispatch),
});

const mapStateToProps = (state) => {
  const protocol = getProtocol(state);

  return {
    name: protocol && protocol.name,
    description: protocol && protocol.description,
    forms: protocol && protocol.forms,
    codebook: protocol && protocol.codebook,
  };
};

export { Overview };

export default compose(connect(mapStateToProps, mapDispatchToProps))(Overview);
