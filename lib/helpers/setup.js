'use strict';

var Promise          = require('ember-cli/lib/ext/promise');
var Blueprint        = require('ember-cli/lib/models/blueprint');
var conf             = require('ember-cli-internal-test-helpers/lib/helpers/conf');
var BlueprintNpmTask = require('ember-cli-internal-test-helpers/lib/helpers/disable-npm-on-blueprint');
var fs               = require('fs-extra');
var walkSync         = require('walk-sync');
var existsSync       = require('exists-sync');
var remove           = Promise.denodeify(fs.remove);
var tmpenv           = require('./tmp-env');
var debug            = require('debug')('ember-cli:testing');

/**
  Setup mocha test hooks
  @method setupTestHooks
  @param {Object} scope
  @param {Object} [options]
  @param {Number} [options.timeout]
  @param {Object} [options.tmpenv]
  @return {null}
*/
module.exports = function setupTestHooks(scope, options) {
  var timeout = options && options.timeout || 20000;
  var tmp = options && options.tmpenv || scope.tmpenv || tmpenv;
  scope.timeout(timeout);

  before(function () {
    BlueprintNpmTask.disableNPM(Blueprint);
    conf.setup();
  });

  after(function() {
    BlueprintNpmTask.restoreNPM(Blueprint);
    conf.restore();
  });

  beforeEach(function() {
    tmp.freshDir();
    process.chdir(tmp.tmpdir);
    debug("beforeEach cwd: " + process.cwd());
  });

  afterEach(function() {
    debug('afterEach:tmpdir: ', walkSync(tmp.tmpdir));
    this.timeout(10000);
    process.chdir(tmp.root);
    return remove(tmp.tmproot)
      .then(function() {
        debug('afterEach:tmp exists: ' + existsSync(tmp.tmproot));
      });
  });

};
