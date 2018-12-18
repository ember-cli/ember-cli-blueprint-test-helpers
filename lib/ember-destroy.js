'use strict';

const ember = require('./helpers/ember');
const rethrowFromErrorLog = require('./rethrow-from-error-log');
const {
  enableModuleUnification,
  disableModuleUnification
} = require('./helpers/module-unification-experiment');

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

  let originalENV = enableModuleUnification(options.isModuleUnification);

  return ember(commandArgs, cliOptions)
    .catch(rethrowFromErrorLog)
    .finally(() => disableModuleUnification(originalENV));
};
