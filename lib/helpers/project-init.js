'use strict';

var ember   = require('ember-cli/tests/helpers/ember');
var Promise = require('ember-cli/lib/ext/promise');
var setupPodConfig = require('./project-setup').setupPodConfig;

var initPresets = {
  app: [ 'init', '--blueprint=app', '--name=my-app', '--skip-npm', '--skip-bower' ],
  addon: [ 'addon', 'my-addon', '--skip-npm', '--skip-bower' ]
};

module.exports = function(options) {
  var target = options && options.target || 'app';
  // so we can skip if we've already generated the project in a previous step
  if (options && options.skipInit) {
    return Promise.resolve();
  }
  
  if (target === 'inRepoAddon') {
    return ember(initPresets['app'])
      .then(initInRepoAddon)
      .then(setupConfig.bind(this, options));
  }
  return ember(initPresets[target])
    .then(setupConfig.bind(this, options));
};

function initInRepoAddon() {
  return ember([ 
    'generate', 
    'in-repo-addon', 
    'my-addon' 
    ]);
}

function setupConfig(options) {
  return setupPodConfig(options);
}