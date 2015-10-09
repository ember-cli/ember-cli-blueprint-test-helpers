'use strict';

var Promise          = require('ember-cli/lib/ext/promise');
var conf             = require('ember-cli-internal-test-helpers/lib/helpers/conf');
var BlueprintNpmTask = require('ember-cli-internal-test-helpers/lib/helpers/disable-npm-on-blueprint');
var fs               = require('fs-extra');
var remove           = Promise.denodeify(fs.remove);
var tmpenv           = require('./tmp-env');

module.exports = function setupTestHooks(scope, timeout, tmpenv) {
  var timeout = timeout || 20000;
  scope.timeout(timeout);

  before(function () {
    BlueprintNpmTask.disableNPM();
    conf.setup();
  });

  after(function() {
    BlueprintNpmTask.restoreNPM();
    conf.restore();
  });

  beforeEach(function() {
    //tmpenv.tmpdir = tmpenv.freshDir();
    tmpenv.freshDir();
    process.chdir(tmpenv.tmpdir);
  });

  afterEach(function() {
    this.timeout(10000);
    process.chdir(tmpenv.root);
    return remove(tmpenv.tmproot);
  });
};
