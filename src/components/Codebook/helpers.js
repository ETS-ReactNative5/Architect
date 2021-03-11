import {
  reduce, get, compact, uniq, map,
} from 'lodash';
import { getType } from '@selectors/codebook';
import { makeGetIsUsed } from '@selectors/codebook/isUsed';
import { getVariableIndex } from '@selectors/indexes';
import { getProtocol } from '@selectors/protocol';

const getIsUsed = makeGetIsUsed({ formNames: [] });

/**
 * Extract basic stage meta by index from the app state
 * @param {Object} state Application state
 * @returns {Object[]} Stage meta sorted by index in state
 */
const getStageMetaByIndex = (state) => {
  const protocol = getProtocol(state);
  return protocol.stages
    .map(({ label, id }) => ({ label, id }));
};

/**
 * Extract the stage name from a path string
 * @param {string} path {}
 * @returns {string | null} return a stageIndex or null if stage not found.
 */
const getStageIndexFromPath = (path) => {
  const matches = /stages\[([0-9]+)\]/.exec(path);
  return get(matches, 1, null);
};

/**
 * Filters a usage index for items that match value.
 * @param {Object.<string, string>}} index Usage index in (in format `{[path]: value}`)
 * @param {any} value Value to match in usage index
 * @returns {string[]} List of paths ("usage array")
 */
export const getUsage = (index, value) => reduce(index, (acc, indexValue, path) => {
  if (indexValue !== value) { return acc; }
  return [...acc, path];
}, []);

/**
 * Get stage meta that matches "usage array" (deduped).
 * See `getUsage()` for details of usage array,
 * Any stages that can't be found in the index are omitted.
 * @param {Object} state Application state
 * @param {string[]} usage "Usage array"
 * @returns {Object[]} List of stage meta `{ label, id }`.
 */
export const getUsageAsStageMeta = (state, usage) => {
  const stageMetaByIndex = getStageMetaByIndex(state);
  const stageIndexes = compact(uniq(usage.map(getStageIndexFromPath)));
  return stageIndexes.map((stageIndex) => get(stageMetaByIndex, stageIndex));
};

const sortByLabel = (a, b) => {
  if (a.label < b.label) { return -1; }
  if (a.label > b.label) { return 1; }
  return 0;
};

export const getEntityProperties = (state, { entity, type }) => {
  const {
    name,
    color,
    variables,
  } = getType(state, { entity, type });

  const variableIndex = getVariableIndex(state);
  const isUsedIndex = getIsUsed(state);

  const variablesWithUsage = map(
    variables,
    (variable, id) => {
      const inUse = get(isUsedIndex, id, false);

      const usage = inUse
        ? getUsageAsStageMeta(state, getUsage(variableIndex, id)).sort(sortByLabel)
        : [];

      const usageString = usage.map(({ label }) => label).join(', ').toUpperCase();

      return ({
        ...variable,
        id,
        inUse,
        usage,
        usageString,
      });
    },
  );

  return {
    name,
    color,
    variables: variablesWithUsage,
  };
};
