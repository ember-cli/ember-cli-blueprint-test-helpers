'use strict';

const ember = require('./helpers/ember');
const rethrowFromErrorLog = require('./rethrow-from-error-log');
const cleanupENV = require('./helpers/cleanup-env');

/**
 * Run a blueprint destructor.
 *
 * @param {Array.<String>} args arguments to pass to `ember destroy` (e.g. `['my-blueprint', 'foo']`)
 * @returns {Promise}
 */
module.exports = function(args, options) {
  options = options || {};

  let commandArgs = ['destroy'].concat(args);

  let cliOptions = {
    disableDependencyChecker: true,
  };

  if (options.isModuleUnification) {
    process.env["EMBER_CLI_MODULE_UNIFICATION"] = true
  }

  return ember(commandArgs, cliOptions)
    .catch(rethrowFromErrorLog)
    .finally(cleanupENV);
};
