module.exports = {
  require: ['babel-register'],
  nyc: {
    reportDir: 'coverage',
    reporter: ['html', 'text-summary'],
  },
  mocha: {
    useColors: true,
  },
};
