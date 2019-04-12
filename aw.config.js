module.exports = {
  nyc: {
    reportDir: 'coverage',
    reporter: ['html', 'text-summary'],
  },
  mocha: {
    useColors: true,
  },
};
