import { remote } from 'electron';
import { get } from 'lodash';

import codenames from '../codenames.json';

const appVersion = remote.app.getVersion();
const codename = get(codenames, appVersion, 'Codename');

export default appVersion;

export {
  codename,
  appVersion,
};
