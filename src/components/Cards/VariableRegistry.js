import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { map, has, get } from 'lodash';
import { TransitionGroup } from 'react-transition-group';
import { Wipe } from '../Transitions';
import { Node, Icon, Button } from '../../ui/components';
import { Guided } from '../Guided';
import Guidance from '../Guidance';
import Card from '../Card';
import { getProtocol } from '../../selectors/protocol';
import { actionCreators as variableRegistryActions } from '../../ducks/modules/protocol/variableRegistry';

class VariableRegistry extends Component {
  handleDelete = (category, type) => {
    this.props.deleteType(category, type);
  };

  renderNode = (node, key) => (
    <Wipe key={key}>
      <div className="list__item" key={key}>
        <div className="list__attribute list__attribute--icon">
          <Link to={`${this.props.protocolPath}/registry/node/${key}`}>
            <Node label="" color={node.color} />
          </Link>
        </div>
        <div className="list__attribute">
          <h3>
            <Link to={`${this.props.protocolPath}/registry/node/${key}`}>
              {key}
            </Link>
          </h3>
        </div>
        <div className="list__attribute list__attribute--options">
          <Button size="small" color="neon-coral" onClick={() => this.handleDelete('node', key)}>
            Delete
          </Button>
        </div>
      </div>
    </Wipe>
  );

  renderEdge = (edge, key) => (
    <Wipe key={key}>
      <div className="list__item" key={key}>
        <div className="list__attribute list__attribute--icon">
          <Link to={`${this.props.protocolPath}/registry/edge/${key}`}>
            <Icon name="links" color={edge.color.replace('color-', '')} />
          </Link>
        </div>
        <div className="list__attribute">
          <h3>
            <Link to={`${this.props.protocolPath}/registry/edge/${key}`}>
              {key}
            </Link>
          </h3>
        </div>
        <div className="list__attribute list__attribute--options">
          <Button size="small" color="neon-coral" onClick={() => this.handleDelete('edge', key)}>Delete</Button>
        </div>
      </div>
    </Wipe>
  );

  renderEdges() {
    const edges = get(this.props.variableRegistry, 'edge', {});

    if (edges.length === 0) {
      return 'No node types defined';
    }

    return (
      <div className="list">
        <TransitionGroup>
          {map(edges, this.renderEdge)}
        </TransitionGroup>
      </div>
    );
  }

  renderNodes() {
    const nodes = get(this.props.variableRegistry, 'node', {});

    if (nodes.length === 0) {
      return 'No node types defined';
    }

    return (
      <div className="list">
        <TransitionGroup>
          {map(nodes, this.renderNode)}
        </TransitionGroup>
      </div>
    );
  }

  renderButtons() {
    return ([
      <Button key="cancel" size="small" color="platinum" onClick={this.props.onComplete}>Back</Button>,
    ]);
  }

  render() {
    const {
      show,
      protocolPath,
    } = this.props;

    if (!protocolPath) { return null; }

    return (
      <Card
        show={show}
        buttons={this.renderButtons()}
      >
        <div className="editor variable-registry">
          <Guided className="editor__sections">
            <h1>Variable Registry</h1>

            <Guidance contentId="guidance.registry.nodes">
              <div className="editor__section">
                <h2>Nodes</h2>
                <div className="editor__subsection">
                  {this.renderNodes()}
                </div>
                <div className="editor__subsection">
                  <Link
                    to={`${protocolPath}/registry/node/`}
                    className="button button--small"
                  >
                    Create new Node type
                  </Link>
                </div>
              </div>
            </Guidance>

            <Guidance contentId="guidance.registry.edges">
              <div className="editor__section">
                <h2>Edges</h2>
                <div className="editor__subsection">
                  {this.renderEdges()}
                </div>
                <div className="editor__subsection">
                  <Link
                    to={`${protocolPath}/registry/edge/`}
                    className="button button--small"
                  >
                    Create new Edge type
                  </Link>
                </div>
              </div>
            </Guidance>
          </Guided>
        </div>
      </Card>
    );
  }
}

VariableRegistry.propTypes = {
  show: PropTypes.bool,
  variableRegistry: PropTypes.shape({
    node: PropTypes.object.isRequired,
    edge: PropTypes.object.isRequired,
  }).isRequired,
  protocolPath: PropTypes.string,
  onComplete: PropTypes.func,
  deleteType: PropTypes.func.isRequired,
};

VariableRegistry.defaultProps = {
  protocolPath: null,
  variableRegistry: {
    node: {},
    edge: {},
  },
  show: true,
  onComplete: () => {},
};

const mapStateToProps = (state, props) => {
  const protocol = getProtocol(state);

  return {
    variableRegistry: protocol.variableRegistry,
    protocolPath: has(props, 'match.params.protocol') ?
      `/edit/${get(props, 'match.params.protocol')}` : null,
  };
};

const mapDispatchToProps = dispatch => ({
  deleteType: bindActionCreators(variableRegistryActions.deleteType, dispatch),
});

export { VariableRegistry };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VariableRegistry);
