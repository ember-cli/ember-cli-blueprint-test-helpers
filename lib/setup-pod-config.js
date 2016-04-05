var replaceFile = require('ember-cli-internal-test-helpers/lib/helpers/file-utils').replaceFile;

/**
 * Setup `usePods` in `.ember-cli` and/or `podModulePrefix` in `environment.js`.
 *
 * @param {Object} [options] optional parameters
 * @param {Boolean} [options.usePods] add `usePods` in `.ember-cli`
 * @param {Boolean} [options.podModulePrefix] set `npodModulePrefix` to
 * `app/pods` in `config/environment.js`
 */
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
