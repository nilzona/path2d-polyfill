module.exports = {
  require: ['babel-register'],
  nyc: {
    reportDir: 'test/coverage',
  },
  mocha: {
    useColors: true,
  },
};
