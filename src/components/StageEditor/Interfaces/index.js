/* eslint-disable import/prefer-default-export */

import { get } from 'lodash';
import Information from './Information';
import NameGenerator from './NameGenerator';
import NameGeneratorList from './NameGeneratorList';
import NameGeneratorAutoComplete from './NameGeneratorAutoComplete';
import Sociogram from './Sociogram';

const interfaces = {
  Information,
  NameGenerator,
  NameGeneratorList,
  NameGeneratorAutoComplete,
  Sociogram,
};

const emptyInterface = {
  sections: [],
};

export const getInterface = interfaceType =>
  get(interfaces, interfaceType, emptyInterface);
