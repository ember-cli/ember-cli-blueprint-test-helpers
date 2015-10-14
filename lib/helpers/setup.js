'use strict';

var Promise          = require('ember-cli/lib/ext/promise');
var conf             = require('ember-cli-internal-test-helpers/lib/helpers/conf');
var BlueprintNpmTask = require('ember-cli-internal-test-helpers/lib/helpers/disable-npm-on-blueprint');
var fs               = require('fs-extra');
var remove           = Promise.denodeify(fs.remove);
var tmpenv           = require('./tmp-env');

module.exports = function setupTestHooks(scope, options) {
  var timeout = options && options.timeout || 20000;
  var tmp = options && options.tmpenv || scope.tmpenv || tmpenv;
  scope.timeout(timeout);

  before(function () {
    if (options && options.before) {
      options.before();
    }
    BlueprintNpmTask.disableNPM();
    conf.setup();
  });

  after(function() {
    if (options && options.after) {
      options.after();
    }
    BlueprintNpmTask.restoreNPM();
    conf.restore();
  });

  beforeEach(function() {
    if (options && options.beforeEach) {
      options.beforeEach();
    }
    tmp.freshDir();
    process.chdir(tmp.tmpdir);
  });

  afterEach(function() {
    if (options && options.afterEach) {
      options.afterEach();
    }
    this.timeout(10000);
    process.chdir(tmp.root);
    return remove(tmp.tmproot);
  });
};
