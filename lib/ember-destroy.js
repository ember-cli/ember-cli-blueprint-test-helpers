'use strict';

const ember = require('./helpers/ember');
const rethrowFromErrorLog = require('./rethrow-from-error-log');

/**
 * Run a blueprint destructor.
 *
 * @param {Array.<String>} args arguments to pass to `ember destroy` (e.g. `['my-blueprint', 'foo']`)
 * @returns {Promise}
 */
module.exports = function(args) {
  let commandArgs = ['destroy'].concat(args);

  let cliOptions = {
    disableDependencyChecker: true,
  };

  return ember(commandArgs, cliOptions)
    .catch(rethrowFromErrorLog);
};
