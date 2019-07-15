import uuid from 'uuid';
import { omit } from 'lodash';
import path from 'path';
import { importAsset as fsImportAsset } from 'App/other/protocols';
import { getActiveProtocolMeta } from 'App/selectors/protocol';
import { validateAsset } from 'App/other/protocols/importAsset';
import { invalidAssetErrorDialog, importAssetErrorDialog } from 'App/ducks/modules/protocol/utils/dialogs';

const IMPORT_ASSET = 'PROTOCOL/IMPORT_ASSET';
const IMPORT_ASSET_COMPLETE = 'PROTOCOL/IMPORT_ASSET_COMPLETE';
const IMPORT_ASSET_FAILED = 'PROTOCOL/IMPORT_ASSET_FAILED';
const DELETE_ASSET = 'PROTOCOL/DELETE_ASSET';

const getNameFromFilename = filename =>
  path.parse(filename).name;

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
const importAssetFailed = (filename, error) =>
  ({
    type: IMPORT_ASSET_FAILED,
    filename,
    error,
  });

/**
 * @param {File} asset - File() to import
 */
const importAssetThunk = asset =>
  (dispatch, getState) => {
    const state = getState();
    const { workingPath } = getActiveProtocolMeta(state);
    const name = getNameFromFilename(asset.name);

    dispatch(importAsset(name));

    if (!workingPath) {
      const error = new Error('No working path found, possibly no active protocol.');
      dispatch(importAssetFailed(name, error));
      dispatch(importAssetErrorDialog(name, error));
      return Promise.reject(error);
    }

    return validateAsset(asset)
      .then(() => fsImportAsset(workingPath, asset))
      .then(({ filePath, assetType }) =>
        dispatch(importAssetComplete(filePath, name, assetType)),
      )
      .catch((error) => {
        console.log('did not validate!');
        dispatch(importAssetFailed(name, error));
        dispatch(invalidAssetErrorDialog(name, error));
        throw error;
      });
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
      // Don't delete from disk, this allows us to rollback the protocol.
      // Disk changes should be commited on save.
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

const testing = {
  importAssetComplete,
  deleteAsset,
};

export {
  actionCreators,
  actionTypes,
  testing,
};
