const isTestEnv = process.env.NODE_ENV === 'test';

export default {
  port: process.env.PORT || 3000,
  connection: isTestEnv ? './__tests__/__data' : './data',
  secret: isTestEnv ? 'TEST' : 'VERYSECRETKEY',
};
