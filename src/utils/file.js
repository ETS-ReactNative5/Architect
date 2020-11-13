import { remote } from 'electron';
import fse from 'fs-extra';
import log from 'electron-log';
import path from 'path';
import uuid from 'uuid';
import pruneAssets from '@app/utils/protocols/pruneAssets';
import { archive, extract } from '@app/utils/protocols/lib/archive';
import validateProtocol from '@app/utils/validateProtocol';

export const errors = {
  MissingPermissions: new Error('Protocol does not have read/write permissions'),
  ExtractFailed: new Error('Protocol could not be extracted'),
  BackupFailed: new Error('Protocol could not be backed up'),
  SaveFailed: new Error('Protocol could not be saved to destination'),
};

const throwHumanReadableError = readableError =>
  (e) => {
    log.error(e);
    throw readableError;
  };

const getStringifiedProtocol = protocol =>
  new Promise((resolve, reject) => {
    try {
      return resolve(JSON.stringify(protocol, null, 2));
    } catch (e) {
      log.error(e);
      return reject(e);
    }
  });

/**
 * @param {string} workingPath - working path in application /tmp/protocols/ dir
 * @param {object} protocol - The protocol object.
 */
export const exportNetcanvas = (workingPath, protocol) => {
  const exportPath = path.join(remote.app.getPath('temp'), 'export', uuid());
  const protocolJsonPath = path.join(workingPath, 'protocol.json');
  log.info(`Save protocol object to ${protocolJsonPath}`);

  return getStringifiedProtocol(protocol)
    .then(protocolData => fse.writeFile(protocolJsonPath, protocolData))
    .then(() => pruneAssets(workingPath))
    .then(() => archive(workingPath, exportPath))
    .then(() => exportPath);
};

/**
 * Create a working copy of a protocol in the application
 * tmp directory. If bundled, extract it, if not, copy it.
 *
 * @param filePath .netcanvas file path
 *
 * @returns A promise which resolves to the destination path.
 */
export const importNetcanvas = (filePath) => {
  const destinationPath = path.join(remote.app.getPath('temp'), 'protocols', uuid());

  return fse.access(filePath, fse.constants.W_OK)
    .catch(throwHumanReadableError(errors.MissingPermissions))
    .then(() => extract(filePath, destinationPath))
    .catch(throwHumanReadableError(errors.ExtractFailed))
    .then(() => destinationPath);
};

export const backupAndReplace = (exportPath, destinationPath) => {
  const backupPath = `${destinationPath}.backup-${new Date().getTime()}`;
  return fse.rename(destinationPath, backupPath)
    .catch(throwHumanReadableError(errors.BackupFailed))
    .then(() => fse.rename(exportPath, destinationPath))
    .catch(throwHumanReadableError(errors.SaveFailed))
    .then(() => ({ savePath: destinationPath, backupPath }));
};

/**
 * Given the working path for a protocol (in /tmp/protocols `protocol.json`,
 * returns a promise that resolves to the parsed json object
 * @param {string} protocolPath - The protocol directory.
 * @returns {object} The protocol as an object
 */
export const readProtocol = (protocolPath) => {
  const protocolFile = path.join(protocolPath, 'protocol.json');

  return fse.readJson(protocolFile);
};

/**
 * Read a netcanvas file, extract it and try to read protocol.json
 * @param filePath - .netcanvas file path
 * @returns {Promise} Resolves to true if protocol is read successfully
 */
export const verifyNetcanvas = filePath =>
  importNetcanvas(filePath)
    .then(readProtocol)
    .then(validateProtocol)
    .then(() => true);