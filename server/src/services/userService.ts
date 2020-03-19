import { resolve } from 'path';
import { find as findEntry } from 'lodash/fp';

import config from '../config';
import { User } from '../types/users';

type Query = {
  id: number;
};

const users: Array<User> = require(resolve(__dirname, '..', '..', config.connection, 'usersData'));

export async function find(query: Query): Promise<User | undefined> {
  return findEntry<User>(query, users);
}

export async function list() {
  return users;
}

export async function update(query: Query, values: { [key: string]: string | number }): Promise<void> {
  const entry = find(query);
  if (entry) {
    Object.assign(entry, values);
  }
}
