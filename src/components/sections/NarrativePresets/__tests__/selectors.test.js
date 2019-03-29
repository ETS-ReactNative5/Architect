/* eslint-env jest */
import {
  getLayoutVariablesForNodeType,
  getHighlightVariablesForNodeType,
  getGroupVariablesForNodeType,
  getEdgesForNodeType,
} from '../selectors';

const nodeType = '1234-1234-1234';

const mockCodebook = {
  node: {
    [nodeType]: {
      variables: {
        '1234-1234-1': {
          name: 'my layout',
          type: 'layout',
        },
        '1234-1234-2': {
          name: 'my category',
          type: 'categorical',
        },
        '1234-1234-3': {
          name: 'my boolean',
          type: 'boolean',
        },
      },
    },
  },
  edge: {
    '1234-5': {
      name: 'an edge',
      color: 'blue',
    },
  },
};

const mockState = {
  protocol: {
    present: {
      codebook: mockCodebook,
    },
  },
};

describe('NarrativePresets', () => {
  describe('selectors', () => {
    it('get layout variables for node type', () => {
      const result = getLayoutVariablesForNodeType(mockState, nodeType);

      expect(result).toEqual([{
        value: '1234-1234-1',
        label: 'my layout',
        type: 'layout',
      }]);
    });

    it('get highlight variables for node type', () => {
      const result = getHighlightVariablesForNodeType(mockState, nodeType);

      expect(result).toEqual([{
        value: '1234-1234-3',
        label: 'my boolean',
        type: 'boolean',
      }]);
    });

    it('get group variables for node type', () => {
      const result = getGroupVariablesForNodeType(mockState, nodeType);

      expect(result).toEqual([
        {
          value: '',
          label: '\u2014 None \u2014',
        },
        {
          value: '1234-1234-2',
          label: 'my category',
          type: 'categorical',
        },
      ]);
    });

    it('get edges for node type', () => {
      const result = getEdgesForNodeType(mockState, nodeType);

      expect(result).toEqual([{
        value: '1234-5',
        label: 'an edge',
        color: 'blue',
      }]);
    });
  });
});