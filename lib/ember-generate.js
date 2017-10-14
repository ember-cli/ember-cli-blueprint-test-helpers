'use strict';

const ember = require('./helpers/ember');
const rethrowFromErrorLog = require('./rethrow-from-error-log');

/**
 * Run a blueprint generator.
 *
 * @param {Array.<String>} args arguments to pass to `ember generate` (e.g. `['my-blueprint', 'foo']`)
 * @returns {Promise}
 */
module.exports = function(args) {
  let commandArgs = ['generate'].concat(args);

  let cliOptions = {
    disableDependencyChecker: true,
  };

  return ember(commandArgs, cliOptions)
    .catch(rethrowFromErrorLog);
};
