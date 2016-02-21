'use strict';

var Promise          = require('ember-cli/lib/ext/promise');
var Blueprint        = require('ember-cli/lib/models/blueprint');
var acceptance       = require('ember-cli-internal-test-helpers/lib/helpers/acceptance');
var conf             = require('ember-cli-internal-test-helpers/lib/helpers/conf');
var BlueprintNpmTask = require('ember-cli-internal-test-helpers/lib/helpers/disable-npm-on-blueprint');
var assertDirEmpty   = require('ember-cli-internal-test-helpers/lib/helpers/assert-dir-empty');
var fs               = require('fs-extra');
var walkSync         = require('walk-sync');
var existsSync       = require('exists-sync');
var expect           = require('chai').expect;
var remove           = Promise.denodeify(fs.remove);
var tmpenv           = require('./tmp-env');
var debug            = require('debug')('ember-cli:testing');

/**
  Setup mocha test hooks
  @method setupTestHooks
  @param {Object} [scope]
  @param {Object} [options]
  @param {Number} [options.timeout]
  @param {Object} [options.tmpenv]
  @param {Function} [options.before]
  @param {Function} [options.after]
  @param {Function} [options.beforeEach]
  @param {Function} [options.afterEach]
  @return {null}
*/
module.exports = function setupTestHooks(scope, options) {
  var timeout = options && options.timeout || 20000;
  var tmp = options && options.tmpenv || scope.tmpenv || tmpenv;
  scope.timeout(timeout);
  /*
  before(function() {
    return acceptance.createTestTargets('my-app');
  });

  after(function() {
    return acceptance.teardownTestTargets();
  });

  beforeEach(function() {
    return acceptance.linkDependencies('my-app');
  });

  afterEach(function() {
    return acceptance.cleanupRun().then(function() {
      assertDirEmpty('tmp');
    });
  });
  */
  before(function () {
    if (options && options.before) {
      options.before();
    }
    BlueprintNpmTask.disableNPM(Blueprint);
    conf.setup();
  });

  after(function() {
    if (options && options.after) {
      options.after();
    }
    BlueprintNpmTask.restoreNPM(Blueprint);
    conf.restore();
  });

  beforeEach(function() {
    if (options && options.beforeEach) {
      options.beforeEach();
    }
    tmp.freshDir();
    process.chdir(tmp.tmpdir);
    debug("beforeEach cwd: " + process.cwd());
  });

  afterEach(function() {
    if (options && options.afterEach) {
      options.afterEach();
    }
    debug('afterEach:tmpdir: ', walkSync(tmp.tmpdir));
    this.timeout(10000);
    process.chdir(tmp.root);
    return remove(tmp.tmproot)
      .then(function() {
        debug('afterEach:tmp exists: ' + existsSync(tmp.tmproot));
      });
  });

};
