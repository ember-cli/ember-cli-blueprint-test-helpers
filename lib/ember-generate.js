var ember = require('ember-cli/tests/helpers/ember');
var rethrowFromErrorLog = require('./rethrow-from-error-log');

module.exports = function(args) {
  var commandArgs = ['generate'].concat(args);

  var cliOptions = {
    disableDependencyChecker: true,
  };

  return ember(commandArgs, cliOptions)
    .catch(rethrowFromErrorLog);
};
