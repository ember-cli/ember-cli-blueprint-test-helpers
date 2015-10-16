'use strict';

var ember     = require('ember-cli/tests/helpers/ember');
var Promise   = require('ember-cli/lib/ext/promise');
var path      = require('path');
var walkSync  = require('walk-sync');
var tmpenv    = require('./tmp-env');
var debug     = require('debug')('ember-cli:testing');
var setupPodConfig = require('./project-setup').setupPodConfig;

var initPresets = {
  app: function() {
    return [ 'init', '--blueprint=app', '--name=my-app', '--skip-npm', '--skip-bower' ];
  },
  addon: function() {
    return [ 'addon', 'my-addon', '--skip-npm', '--skip-bower' ];
  }
};

/**
init a mock project for testing blueprints
*/
module.exports = function(options) {
  var target = options && options.target || 'app';
  var presets = initPresets[target]();
  var projectName = (target === 'app') ? 'my-app' : 'my-addon';
  var cliOptions = {
    type: target,
    disableDependencyChecker: true
  };
  // so we can skip if we've already generated the project in a previous step
  if (options && options.skipInit) {
    debug('skipping init');
    return Promise.resolve()
      .then(stepIntoTmpDir.bind(null, projectName));
  }
  
  if (target === 'inRepoAddon') {
    return ember(initPresets['app'](), cliOptions)
      .then(setupConfig.bind(null, options))
      .then(stepIntoTmpDir.bind(null, projectName))
      .then(initInRepoAddon);
  }

  return ember(presets, cliOptions)
    .then(setupConfig.bind(null, options))
    .then(stepIntoTmpDir.bind(null, projectName));
};

function initInRepoAddon() {
  return ember([ 
    'generate', 
    'in-repo-addon', 
    'my-addon' 
    ]);
}

function stepIntoTmpDir(projectName) {
  debug('Stepping into ' + projectName);
  debug('Initial project contents: ', walkSync(tmpenv.tmpdir));
  return process.chdir(tmpenv.tmpdir);
}

function setupConfig(options) {
  return setupPodConfig(options);
}