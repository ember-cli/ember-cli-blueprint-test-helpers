'use strict';

const ember = require('./helpers/ember');
const rethrowFromErrorLog = require('./rethrow-from-error-log');
const cleanupENV = require('./helpers/cleanup-env');

/**
 * Run a blueprint generator.
 *
 * @param {Array.<String>} args arguments to pass to `ember generate` (e.g. `['my-blueprint', 'foo']`)
 * @returns {Promise}
 */
module.exports = function(args, options) {
  options = options || {};

  let commandArgs = ['generate'].concat(args);

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
