import * as app from '../src/app';
// const app = require('../src/app.js');

describe('app', () => {
  test('return 0', () => {
    const result = app.run();
    expect(result).toBe(0);
  });
});