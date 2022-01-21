import { resolve } from 'path';
import { find as findEntry } from 'lodash/fp';

import config from '../config';

const dataPath = resolve(__dirname, '..', '..', config.connection, 'usersData');
const users = require(dataPath);

export async function find(query) {
  return findEntry(query, users);
}

export async function list() {
  return users;
}

export async function update(query, values) {
  const entry = find(query);
  if (entry) {
    Object.assign(entry, values);
  }
}
