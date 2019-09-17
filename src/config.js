/* eslint-disable import/prefer-default-export */

export const LABEL_VARIABLE_TYPES = new Set([
  'text',
  'number',
  'datetime',
]);

// Color palette sizes, they follow the pattern: ord-color-seq-1...ord-color-seq-n
export const COLOR_PALETTES = {
  'ord-color-seq': 8,
  'node-color-seq': 10,
  'edge-color-seq': 8,
};

export const COLOR_PALETTE_BY_ENTITY = {
  ordinal: 'ord-color-seq',
  node: 'node-color-seq',
  edge: 'edge-color-seq',
};

export const APP_SCHEMA_VERSION = '2';
