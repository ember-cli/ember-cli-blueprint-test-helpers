'use strict';

var RSVP             = require('rsvp');
var MockBlueprintTaskFor = require('ember-cli-internal-test-helpers/lib/helpers/mock-blueprint-task-for');
var fs               = require('fs-extra');
var remove           = RSVP.denodeify(fs.remove);
var tmpenv           = require('./tmp-env');
var debug            = require('debug')('ember-cli:testing');
var requireFromCLI = require('./require-from-cli');

/**
  Prepare the test context for the blueprint tests.

  @method setupTestHooks
  @param {Object} scope
  @param {Object} [options]
  @param {Number} [options.timeout=20000]
  @param {Object} [options.tmpenv]
  @param {String} [options.cliPath='ember-cli'] path to the `ember-cli` dependency
*/
module.exports = function setupTestHooks(scope, options) {
  var timeout = options && options.timeout || 20000;
  var tmp = options && options.tmpenv || scope.tmpenv || tmpenv;
  scope.timeout(timeout);

  if (options && options.cliPath) {
    requireFromCLI.setBasePath(options.cliPath);
  }

  var Blueprint = requireFromCLI('lib/models/blueprint');

  before(function () {
    MockBlueprintTaskFor.disableTasks(Blueprint, ['npm-install']);
  });

  after(function() {
    MockBlueprintTaskFor.restoreTasks(Blueprint);
  });

  beforeEach(function() {
    tmp.freshDir();
    process.chdir(tmp.tmpdir);
    debug("beforeEach cwd: " + process.cwd());
  });

  afterEach(function() {
    this.timeout(10000);
    process.chdir(tmp.root);
    return remove(tmp.tmproot);
  });
};
