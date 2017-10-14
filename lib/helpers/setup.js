'use strict';

const path             = require('path');
const MockBlueprintTaskFor = require('ember-cli-internal-test-helpers/lib/helpers/mock-blueprint-task-for');
const fs               = require('fs-extra');
const tmpenv           = require('./tmp-env');
const debug            = require('debug')('ember-cli:testing');
const requireFromCLI   = require('./require-from-cli');

/**
  Prepare the test context for the blueprint tests.

  @method setupTestHooks
  @param {Object} scope
  @param {Object} [options]
  @param {Number} [options.timeout=20000]
  @param {Object} [options.tmpenv]
  @param {String} [options.cliPath='ember-cli'] path to the `ember-cli` dependency
  @param {Boolean} [options.disabledTasks=['addon-install', 'bower-install', 'npm-install']] override the mocked installs
*/
module.exports = function setupTestHooks(scope, options) {
  options = options || {};
  let timeout = options.timeout || 20000;
  let tmp = options.tmpenv || scope.tmpenv || tmpenv;
  let disabledTasks = options.disabledTasks || ['addon-install', 'bower-install', 'npm-install'];

  scope.timeout(timeout);

  if (options.cliPath) {
    requireFromCLI.setBasePath(options.cliPath);
  }

  if (disabledTasks.length) {
    let Blueprint = requireFromCLI('lib/models/blueprint');

    before(() => {
      MockBlueprintTaskFor.disableTasks(Blueprint, disabledTasks);
    });

    after(() => {
      MockBlueprintTaskFor.restoreTasks(Blueprint);
    });
  }

  beforeEach(() => {
    tmp.freshDir();
    process.chdir(tmp.tmpdir);
    debug(`beforeEach cwd: ${process.cwd()}`);
  });

  afterEach(() => {
    process.chdir(tmp.root);
    return fs.remove(tmp.tmproot)
      .then(() => {
        // remove symlinked addon added by emberNew
        let projectName = require(path.resolve(process.cwd(), 'package.json')).name;
        return fs.remove(path.join('node_modules', projectName));
      })
  });
};
