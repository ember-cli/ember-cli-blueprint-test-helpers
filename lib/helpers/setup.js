'use strict';

var Promise          = require('ember-cli/lib/ext/promise');
var conf             = require('ember-cli/tests/helpers/conf');
var fs               = require('fs-extra');
var path             = require('path');
var remove           = Promise.denodeify(fs.remove);
var root             = process.cwd();
var tmp              = require('tmp-sync');
var tmproot          = path.join(root, 'tmp');
var BlueprintNpmTask = require('ember-cli/tests/helpers/disable-npm-on-blueprint');
var tmpdir;

var methods = { 
  before: function () {
    BlueprintNpmTask.disableNPM();
    conf.setup();
  },

  after: function() {
    BlueprintNpmTask.restoreNPM();
    conf.restore();
  },

  beforeEach: function() {
    tmpdir = tmp.in(tmproot);
    process.chdir(tmpdir);
  },

  afterEach: function() {
    this.timeout(10000);
    process.chdir(root);
    return remove(tmproot);
  }
};

module.exports = methods;

module.exports.setupTestHooks = function(scope, timeout) {
  var timeout = timeout || 20000;
  scope.timeout(timeout);

  before(methods.before);

  after(methods.after);

  beforeEach(methods.beforeEach);

  afterEach(methods.afterEach);
};

