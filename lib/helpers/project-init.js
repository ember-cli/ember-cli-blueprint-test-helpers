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
  Init a mock project for testing blueprints
  @param {Object} [options]
  @param {String} [options.target]
  @param {Object} [options.package]
  @param {Path} [options.projectRoot]
  @param {String} [options.projectName]
  @return {Promise}
*/
module.exports = function(options) {
  var target = options && options.target || 'app';
  var type = (target === 'inRepoAddon') ? 'app' : target;
  var presets = initPresets[target]();
  var projectName = (target === 'addon') ? 'my-addon' : 'my-app';
  var cliOptions = {
    package: options.package || path.resolve(process.cwd(), '..', '..', 'node-tests', 'fixtures', type, 'package'),
    type: type,
    disableDependencyChecker: true
  };

  // so we can skip if we've already generated the project in a previous step
  if (options && options.skipInit) {
    debug('skipping init');
    return Promise.resolve()
      .then(stepIntoTmpDir.bind(null, projectName));
  }
  // inRepoAddons require a project setup first
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

  // normal app/addon setup
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

/**
  Setup `my-app` project in temp
  @method setupApp
  @param {String} [target]
  @return {Promise}
*/
function setupApp(target) {
  if (target === 'app' || target === 'inRepoAddon') {
    fs.mkdirsSync('my-app');
    process.chdir(path.resolve(tmpenv.tmpdir, 'my-app'));
  }

  return Promise.resolve();
}

/**
  Symlink project in node_modules
  @method linkAsDependency
  @param {Object} [options]
  @param {String} [options.packageName]
  @param {Path} [options.projectRoot]
  @return {null}
*/
function linkAsDependency(options) {
  var dep = path.join(options.projectRoot, 'node_modules', options.packageName);

  if (!existsSync(path.resolve(dep, 'package.json'))) {
    debug('linking: ' + dep);
    fs.symlinkSync(options.projectRoot, dep, 'dir');
  }
}

/**
  Generate an inRepoAddon
  @method initInRepoAddon
  @param {Object} [options]
  @return {Promise}
*/
function initInRepoAddon(options) {
  return ember([
    'generate',
    'in-repo-addon',
    'my-addon'
  ], options);
}

/**
  Resolve temp project dir and step into it
  @method stepIntoTmpDir
  @param {String} [projectName] `my-app` or `my-addon`
  @return {}
*/
function stepIntoTmpDir(projectName) {
  var tmp = path.resolve(tmpenv.tmpdir, projectName);
  debug('Stepping into ' + tmp + ', exists: ' + existsSync(tmp));
  debug('Initial project contents: ', walkSync(tmpenv.tmpdir));
  return process.chdir(tmp);
}

/**
  Setup config, currently only used for pod config
  @method setupConfig
  @param {Object} [options]
  @return {Promise}
*/
function setupConfig(options) {
  return setupPodConfig(options);
}

function errHandler(err) {
  console.error(err.message);
  console.error(err.stack);
  throw err;
}
