module.exports = () => ({
  files: [
    'server/src/**/*.js',
    'server/data/**/*.*',
    'server/__tests__/__data/**/*.*',
    'server/__tests__/helpers/**/*.js',
  ],
  env: {
    type: 'node',
  },
  debug: true,
  testFramework: 'jest',
});
