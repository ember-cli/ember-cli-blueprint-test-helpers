'use strict';

var ember     = require('ember-cli/tests/helpers/ember');
var Promise   = require('ember-cli/lib/ext/promise');
var fs        = require('fs-extra');
var path      = require('path');
var walkSync  = require('walk-sync');
var existsSync = require('exists-sync');
var tmpenv    = require('./tmp-env');
var debug     = require('debug')('ember-cli:testing');
var setupPodConfig = require('./project-setup').setupPodConfig;
var setupPackage = require('./project-setup').setupPackage;
var appPreset = [ 'init', '--blueprint=app', '--name=my-app', '--skip-npm', '--skip-bower' ];

var initPresets = {
  app: function() {
    return appPreset;
  },
  addon: function() {
    return [ 'addon', 'my-addon', '--skip-npm', '--skip-bower' ];
  },
  inRepoAddon: function() {
    return appPreset;
  }
};

/**
init a mock project for testing blueprints
*/
module.exports = function(options) {
  var target = options && options.target || 'app';
  var type = (target === 'inRepoAddon') ? 'app' : target;
  var presets = initPresets[target]();
  var projectName = (target === 'addon') ? 'my-addon' : 'my-app';
  var cliOptions = {
    package: options.package || path.resolve(process.cwd(), '..', '..', 'tests', 'fixtures', type, 'package'),
    type: type,
    disableDependencyChecker: true
  };
  
  // so we can skip if we've already generated the project in a previous step
  if (options && options.skipInit) {
    debug('skipping init');
    return Promise.resolve()
      .then(stepIntoTmpDir.bind(null, projectName));
  }
  
  if (target === 'inRepoAddon') {
    return setupApp(target, options)
      .then(function() {
        return ember(initPresets['app'](), cliOptions);
      })
      .then(setupConfig.bind(null, options))
      .then(stepIntoTmpDir.bind(null, projectName))
      .then(setupPackage.bind(null, options))
      .then(linkAsDependency.bind(null, options))
      .then(initInRepoAddon.bind(null, cliOptions))
      .catch(errHandler);
  }

  return setupApp(target, options)
    .then(function() {
      return ember(presets, cliOptions);
    })
    .then(setupConfig.bind(null, options))
    .then(stepIntoTmpDir.bind(null, projectName))
    .then(setupPackage.bind(null, options))
    .then(linkAsDependency.bind(null, options))
    .catch(errHandler);
};

function setupApp(target) {
  if (target === 'app' || target === 'inRepoAddon') {
    fs.mkdirsSync('my-app');
    process.chdir(path.resolve(tmpenv.tmpdir, 'my-app'));
  }
  
  return Promise.resolve();
}

function linkAsDependency(options) {
  var dep = path.join(options.projectRoot, 'node_modules', options.packageName);
  
  if (!existsSync(path.resolve(dep, 'package.json'))) {
    debug('linking: ' + dep);
    fs.symlinkSync(options.projectRoot, dep, 'dir');
  }
}

function errHandler(err) {
  console.error(err.message);
  console.error(err.stack);
  throw err;
}
function initInRepoAddon(options) {
  return ember([ 
    'generate', 
    'in-repo-addon', 
    'my-addon' 
  ], options);
}

function stepIntoTmpDir(projectName) {
  var tmp = path.resolve(tmpenv.tmpdir, projectName);
  debug('Stepping into ' + tmp + ', exists: ' + existsSync(tmp));
  debug('Initial project contents: ', walkSync(tmpenv.tmpdir));
  return process.chdir(tmp);
}

function setupConfig(options) {
  return setupPodConfig(options);
}