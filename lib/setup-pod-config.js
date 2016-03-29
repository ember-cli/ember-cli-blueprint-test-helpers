var replaceFile = require('ember-cli-internal-test-helpers/lib/helpers/file-utils').replaceFile;

module.exports = function(options) {
  options = options || {};

  // setup usePods for a project in .ember-cli
  if (options.usePods) {
    replaceFile('.ember-cli', '"disableAnalytics": false', '"disableAnalytics": false,\n"usePods" : true\n');
  }

  // setup environment.js with a pre-set podModulePrefix
  if (options.podModulePrefix) {
    replaceFile('config/environment.js', 'var ENV = {', 'var ENV = {\npodModulePrefix: \'app/pods\', \n');
  }
};
