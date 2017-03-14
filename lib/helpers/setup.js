'use strict';

var path             = require('path');
var RSVP             = require('rsvp');
var MockBlueprintTaskFor = require('ember-cli-internal-test-helpers/lib/helpers/mock-blueprint-task-for');
var fs               = require('fs-extra');
var remove           = RSVP.denodeify(fs.remove);
var tmpenv           = require('./tmp-env');
var debug            = require('debug')('ember-cli:testing');
var requireFromCLI   = require('./require-from-cli');

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
  var timeout = options.timeout || 20000;
  var tmp = options.tmpenv || scope.tmpenv || tmpenv;
  var disabledTasks = options.disabledTasks || ['addon-install', 'bower-install', 'npm-install'];

  scope.timeout(timeout);

  if (options.cliPath) {
    requireFromCLI.setBasePath(options.cliPath);
  }

  if (disabledTasks.length) {
    var Blueprint = requireFromCLI('lib/models/blueprint');

    before(function () {
      MockBlueprintTaskFor.disableTasks(Blueprint, disabledTasks);
    });

    after(function() {
      MockBlueprintTaskFor.restoreTasks(Blueprint);
    });
  }

  beforeEach(function() {
    tmp.freshDir();
    process.chdir(tmp.tmpdir);
    debug("beforeEach cwd: " + process.cwd());
  });

  afterEach(function() {
    process.chdir(tmp.root);
    return remove(tmp.tmproot)
      .then(function() {
        // remove symlinked addon added by emberNew
        var projectName = require(path.resolve(process.cwd(), 'package.json')).name;
        return remove(path.join('node_modules', projectName));
      })
  });
};
