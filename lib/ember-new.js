var fs = require('fs');
var path = require('path');

var ember = require('./helpers/ember');
var modifyPackages = require('./modify-packages');
var rethrowFromErrorLog = require('./rethrow-from-error-log');

/**
 * Create a new Ember.js app or addon in the current working directory.
 *
 * @param {Object} [options] optional parameters
 * @param {String} [options.target='app'] the type of project to create (`app`, `addon` or `in-repo-addon`)
 * @returns {Promise}
 */
module.exports = function(options) {
  options = options || {};

  var target = options.target || 'app';
  var isAddon = (target === 'addon');

  var projectName = isAddon ? 'my-addon' : 'my-app';
  var command = isAddon ? 'addon' : 'new';

  var cliOptions = {
    disableDependencyChecker: true
  };

  return ember([command, projectName, '--skip-npm', '--skip-bower'], cliOptions)
    .then(generateInRepoAddon(target))
    .then(linkAddon)
    .catch(rethrowFromErrorLog);
};

function generateInRepoAddon(target) {
  return function() {
    if (target === 'in-repo-addon') {
      return ember(['generate', 'in-repo-addon', 'my-addon'])
    }
  }
}

function linkAddon() {
  var projectPath = path.resolve(process.cwd(), '../../..');
  var projectName = require(path.resolve(projectPath, 'package.json')).name;

  var symlinkPath = path.resolve(projectPath, 'node_modules', projectName);

  if (!fs.existsSync(path.resolve(symlinkPath, '..'))) {
    fs.mkdirSync(path.resolve(symlinkPath, '..'));
  }

  if (!fs.existsSync(path.resolve(symlinkPath, 'package.json'))) {
    fs.symlinkSync(projectPath, symlinkPath, 'dir');
  }

  modifyPackages([{ name: projectName, dev: true }]);
}
