// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-undef
module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.ts',
      { pattern: 'public/*', instrument: false, output: 'public' }
    ],

    tests: [
      'test/**/*.ts'
    ],
    env: {
      type: 'node'
    },
  };
};