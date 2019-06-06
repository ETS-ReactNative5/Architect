import { isArray, values } from 'lodash';
import { createSelector } from 'reselect';
import { getProtocol } from './protocol';
import collectPaths from '../utils/collectPaths';

/**
 * Returns index of used edges (entities)
 * Checks for usage in the following:
 * - `stages[].prompts[].edges.create`
 * - `stages[].prompts[].edges.display[]`
 * - `stages[].presets[].edges.display[]`
 * - `stages[].subject.type`
 * @returns {object} in format: { [path]: variable }
 */
const getEdgeIndex = createSelector(
  getProtocol,
  (protocol) => {
    const createEdges = collectPaths('stages[].prompts[].edges.create', protocol);

    const displayEdges = collectPaths('stages[].prompts[].edges.display', protocol);

    const narrativeEdges = collectPaths('stages[].presets[].edges.display', protocol);

    const alterEdgeFormEdges = collectPaths('stages[].subject.type', protocol);

    return {
      ...createEdges,
      ...displayEdges,
      ...narrativeEdges,
      ...alterEdgeFormEdges,
    };
  },
);

/**
 * Returns index of used nodes (entities)
 * Checks for usage in the following:
 * - `stages[].subject.type`
 * @returns {object} in format: { [path]: variable }
 */
const getNodeIndex = createSelector(
  getProtocol,
  protocol => collectPaths('stages[].subject.type', protocol),
);

/**
 * Returns index of used variables
 * Checks for usage in the following:
 * - `prompts[].variable`
 * - `prompts[].form.fields[].variable`
 * - `prompts[].highlight.variable`
 * @returns {object} in format: { [path]: variable }
 */
const getVariableIndex = createSelector(
  getProtocol,
  (protocol) => {
    const formIndex = collectPaths('stages[].form.fields[].variable', protocol);
    const sociogramIndex = collectPaths('stages[].prompts[].highlight.variable', protocol);
    const variableIndex = collectPaths('stages[].prompts[].variable', protocol);

    return {
      ...formIndex,
      ...sociogramIndex,
      ...variableIndex,
    };
  },
);

/**
 * Returns index of used assets
 * Checks for usage in the following:
 * - `stages[].prompts[].items[].content`
 * - `stages[].prompts[].panels[].dataSource`
 * - `stages[].prompts[].dataSource`
 * - `stages[].background.image`
 * @returns {object} in format: { [path]: variable }
 */
const getAssetIndex = createSelector(
  getProtocol,
  (protocol) => {
    const informationItems = collectPaths('stages[].items[].content', protocol);
    const nameGeneratorPanels = collectPaths('stages[].panels[].dataSource', protocol);
    const nameGeneratorDataSources = collectPaths('stages[].dataSource', protocol);
    const sociogramBackground = collectPaths('stages[].background.image', protocol);

    return {
      ...informationItems,
      ...nameGeneratorPanels,
      ...nameGeneratorDataSources,
      ...sociogramBackground,
    };
  },
);

const combineLists = lists =>
  lists
    .map(list => (!isArray(list) ? values(list) : list))
    .reduce((acc, list) => [...acc, ...list], []);

/**
 * Creates a Set of items from arrays or path objects
 * @param {Array[paths|Array]} include array of path object
 * e.g. from `collectPaths()` or array of ids
 * @param {Array[paths|Array]} excluded array of path object
 * e.g. from `collectPaths()` or array of ids
 * @returns {Set} of ids
 */
const buildSearch = (include = [], exclude = []) => {
  const combinedInclude = combineLists(include);
  const combinedExclude = combineLists(exclude);
  const lookup = new Set(combinedInclude);

  combinedExclude.forEach(value => lookup.delete(value));

  return lookup;
};

const utils = {
  buildSearch,
  collectPaths,
};

export {
  getVariableIndex,
  getAssetIndex,
  getNodeIndex,
  getEdgeIndex,
  utils,
};
