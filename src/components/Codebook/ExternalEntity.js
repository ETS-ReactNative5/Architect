import React from 'react';
import PropTypes from 'prop-types';
import useVariablesFromExternalData from '@hooks/useVariablesFromExternalData';
import VariableList from './VariableList';
import EntityIcon from './EntityIcon';

const ExternalEntity = ({
  id,
  name,
}) => {
  const { variables } = useVariablesFromExternalData(id);

  return (
    <div className="codebook__entity">
      <div className="codebook__entity-detail">
        <div className="codebook__entity-icon">
          <EntityIcon entity="asset" />
        </div>
        <div className="codebook__entity-name">
          <h2>
            {name}
          </h2>
        </div>
      </div>
      { variables.length > 0
        && (
        <div className="codebook__entity-variables">
          <h3>Variables:</h3>
          <VariableList
            variables={variables}
          />
        </div>
        )}
    </div>
  );
};

ExternalEntity.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default ExternalEntity;
