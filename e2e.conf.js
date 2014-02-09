// An example configuration file.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
 
  capabilities: { 'browserName': 'chrome' },

  baseUrl: 'localhost:9000',

  specs: ['test/e2e/**/*spec.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};