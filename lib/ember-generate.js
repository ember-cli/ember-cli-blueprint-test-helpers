var ember = require('./helpers/ember');
var rethrowFromErrorLog = require('./rethrow-from-error-log');

/**
 * Run a blueprint generator.
 *
 * @param {Array.<String>} args arguments to pass to `ember generate` (e.g. `['my-blueprint', 'foo']`)
 * @returns {Promise}
 */
module.exports = function(args) {
  var commandArgs = ['generate'].concat(args);

  var cliOptions = {
    disableDependencyChecker: true,
  };

  return ember(commandArgs, cliOptions)
    .catch(rethrowFromErrorLog);
};
