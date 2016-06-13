var ember = require('./helpers/ember');
var rethrowFromErrorLog = require('./rethrow-from-error-log');

/**
 * Run a blueprint destructor.
 *
 * @param {Array.<String>} args arguments to pass to `ember destroy` (e.g. `['my-blueprint', 'foo']`)
 * @returns {Promise}
 */
module.exports = function(args) {
  var commandArgs = ['destroy'].concat(args);

  var cliOptions = {
    disableDependencyChecker: true,
  };

  return ember(commandArgs, cliOptions)
    .catch(rethrowFromErrorLog);
};
