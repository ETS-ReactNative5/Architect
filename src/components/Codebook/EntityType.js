import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { actionCreators as codebookActionCreators } from '@modules/protocol/codebook';
import { actionCreators as dialogActionCreators } from '@modules/dialogs';
import { getType, getVariables } from '@selectors/codebook';
import { Button } from '@ui/components';
import Variables from './Variables';
import Tag from './Tag';
import EntityIcon from './EntityIcon';
import { getUsageAsStageName } from './helpers';

const EntityType = ({
  name,
  color,
  inUse,
  usage,
  entity,
  type,
  variables,
  handleDelete,
}) => (
  <div className="codebook__entity">
    <div className="codebook__entity-detail">
      <div className="codebook__entity-icon">
        <EntityIcon color={color} entity={entity} type={type} />
      </div>
      <div className="codebook__entity-name">
        <h2>
          {name}
        </h2>
      </div>
      <div className="codebook__entity-meta">
        { !inUse && <Tag>not in use</Tag> }
        { inUse && <React.Fragment><em>used in:</em> {usage.join(', ')}</React.Fragment> }
      </div>
      <div className="codebook__entity-control">
        { !inUse &&
          <Button
            size="small"
            color="neon-coral"
            onClick={handleDelete}
          >
            Delete entity
          </Button>
        }
      </div>
    </div>
    { variables.length > 0 &&
      <div className="codebook__entity-variables">
        <h3>Variables:</h3>
        <Variables
          variables={variables}
          entity={entity}
          type={type}
        />
      </div>
    }
  </div>
);

EntityType.propTypes = {
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  usage: PropTypes.array.isRequired,
  inUse: PropTypes.boolean,
  handleDelete: PropTypes.func.isRequired,
  variables: PropTypes.array,
};

EntityType.defaultProps = {
  variables: [],
  inUse: true, // Don't allow delete unless we explicitly say so
  handleDelete: () => {},
};

const mapStateToProps = (state, { entity, type }) => {
  const subject = { entity, type };
  const entityMeta = getType(state, { subject });
  const variables = getVariables(state, { subject })
    .map(({ id, inUse, usage, properties }) => ({
      id,
      name: properties.name,
      type: properties.type,
      component: properties.component,
      inUse,
      usage: getUsageAsStageName(state, usage),
    }));

  return {
    name: entityMeta.properties.name,
    color: entityMeta.properties.color,
    variables,
  };
};

const withEntityHandlers = compose(
  connect(null, {
    openDialog: dialogActionCreators.openDialog,
    deleteType: codebookActionCreators.deleteType,
  }),
  withHandlers({
    handleDelete: ({ deleteType, openDialog, entity, type, name }) =>
      () => {
        openDialog({
          type: 'Warning',
          title: `Delete ${name} ${entity}`,
          message: (
            <p>
              Are you sure you want to delete the {name} {entity}? This cannot be undone.
            </p>
          ),
          onConfirm: () => { deleteType(entity, type); },
          confirmLabel: `Delete ${name} ${entity}`,
        });
      },
  }),
);

export { EntityType };

export default compose(
  connect(mapStateToProps),
  withEntityHandlers,
)(EntityType);
