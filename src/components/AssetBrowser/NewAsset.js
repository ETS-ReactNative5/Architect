import React from 'react';
import PropTypes from 'prop-types';
import AutoFileDrop from '../Form/AutoFileDrop';

/**
 * Data source, which can be async or json file
 *
 * Value should be assetId
 */
const NewAsset = ({
  type,
  onCreate,
}) => (
  <div className="asset-browser-new-asset">
    <h3>Import a new asset</h3>
    <AutoFileDrop
      type={type}
      onDrop={onCreate}
    />
  </div>
);

NewAsset.propTypes = {
  type: PropTypes.string,
  onCreate: PropTypes.func,
};

NewAsset.defaultProps = {
  type: null,
  onCreate: () => {},
};

export { NewAsset };

export default NewAsset;
