import uuid from 'uuid';
import { omit } from 'lodash';
import { importAsset as fsImportAsset } from '../../../other/protocols';
import { getActiveProtocolMeta } from '../../../selectors/protocol';

const IMPORT_ASSET = Symbol('PROTOCOL/IMPORT_ASSET');
const IMPORT_ASSET_COMPLETE = Symbol('PROTOCOL/IMPORT_ASSET_COMPLETE');
const IMPORT_ASSET_FAILED = Symbol('PROTOCOL/IMPORT_ASSET_FAILED');
const DELETE_ASSET = Symbol('PROTOCOL/DELETE_ASSET');

const getNameFromFilename = filename =>
  filename.split('.')[0];

const deleteAsset = id =>
  ({
    type: DELETE_ASSET,
    id,
  });

/**
 * @param {string} filename - Name of file
 */
const importAsset = filename =>
  ({
    type: IMPORT_ASSET,
    filename,
  });

/**
 * @param {string} filename - Name of file
 * @param {string} fileType - File MIME type
 */
const importAssetComplete = (filename, name, assetType) =>
  ({
    id: uuid(),
    type: IMPORT_ASSET_COMPLETE,
    name,
    filename,
    assetType,
  });

/**
 * @param {string} filename - Name of file
 */
const importAssetFailed = filename =>
  ({
    type: IMPORT_ASSET_FAILED,
    filename,
  });

/**
 * @param {File} asset - File to import
 * @param {string} assetType - type of asset, as listed in asset manifest
 */
const importAssetThunk = (asset, assetType) =>
  (dispatch, getState) => {
    const state = getState();
    const { workingPath } = getActiveProtocolMeta(state);
    const name = getNameFromFilename(asset.name);
    const reject = () =>
      dispatch(importAssetFailed(name));

    dispatch(importAsset(name));

    if (!workingPath) { return Promise.reject(reject()); }

    return fsImportAsset(workingPath, asset)
      .then(filename =>
        dispatch(importAssetComplete(filename, name, assetType)))
      .catch(reject);
  };

const initialState = {};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case IMPORT_ASSET_COMPLETE:
      return {
        ...state,
        [action.id]: {
          id: action.id,
          type: action.assetType,
          name: action.name,
          source: action.filename,
        },
      };
    case DELETE_ASSET:
      // Don't delete from disk, this allows us to rollback the protocol. Disk changes should
      // be commited on save.
      return omit(state, action.id);
    default:
      return state;
  }
}

const actionCreators = {
  importAsset: importAssetThunk,
  importAssetComplete,
  deleteAsset,
};

const actionTypes = {
  IMPORT_ASSET,
  IMPORT_ASSET_COMPLETE,
  IMPORT_ASSET_FAILED,
  DELETE_ASSET,
};

export {
  actionCreators,
  actionTypes,
};
