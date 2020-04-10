import { get } from 'lodash';
import { getForms } from '../reduxForm';
import { getProtocol } from '../protocol';
import { getIdsFromCodebook } from './helpers';

/**
 * Gets a key value object describing variables are
 * in use (including in redux forms)
 * @returns {object} in format: { [variableId]: boolean }
 */
export const makeGetIsUsed = (formNames = ['edit-stage', 'editable-list-form']) =>
  (state) => {
    const protocol = getProtocol(state);
    const forms = getForms(formNames)(state);

    const variableIds = getIdsFromCodebook(protocol.codebook);

    const flattenedData = JSON.stringify([protocol.stages, forms]);

    const isUsed = variableIds.reduce(
      (memo, variableId) => ({
        ...memo,
        [variableId]: flattenedData.includes(`"${variableId}"`),
      }),
      {},
    );

    return isUsed;
  };

export const makeOptionsWithIsUsed = formNames =>
  (state, options) => {
    const isUsed = makeGetIsUsed(formNames)(state);
    return options.map(
      ({ value, ...rest }) =>
        ({ ...rest, value, isUsed: get(isUsed, value) }),
    );
  };