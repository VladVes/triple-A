import { resolve } from 'path';
import { find as findEntry, reject } from 'lodash/fp';

import config from '../config';

let tokens = require(resolve(
  __dirname,
  '..',
  '..',
  config.connection,
  'refreshTokensData',
));

export async function find(query) {
  return findEntry(tokens, query);
}

export async function create(entry) {
  tokens.push(entry);
}

export async function remove(query) {
  tokens = reject(tokens, query);
}
