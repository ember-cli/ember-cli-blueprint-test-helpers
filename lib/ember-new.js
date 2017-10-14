'use strict';

const fs = require('fs');
const path = require('path');

const ember = require('./helpers/ember');
const modifyPackages = require('./modify-packages');
const rethrowFromErrorLog = require('./rethrow-from-error-log');

/**
 * Create a new Ember.js app or addon in the current working directory.
 *
 * @param {Object} [options] optional parameters
 * @param {String} [options.target='app'] the type of project to create (`app`, `addon` or `in-repo-addon`)
 * @returns {Promise}
 */
module.exports = function(options) {
  options = options || {};

  let target = options.target || 'app';
  let isAddon = (target === 'addon');

  let projectName = isAddon ? 'my-addon' : 'my-app';
  let command = isAddon ? 'addon' : 'new';

  let cliOptions = {
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
  let projectPath = path.resolve(process.cwd(), '../../..');
  let projectName = require(path.resolve(projectPath, 'package.json')).name;

  let symlinkPath = path.resolve(projectPath, 'node_modules', projectName);

  if (!fs.existsSync(path.resolve(symlinkPath, '..'))) {
    fs.mkdirSync(path.resolve(symlinkPath, '..'));
  }

  if (!fs.existsSync(path.resolve(symlinkPath, 'package.json'))) {
    fs.symlinkSync(projectPath, symlinkPath, 'dir');
  }

  modifyPackages([{ name: projectName, dev: true }]);
}
