var Promise          = require('ember-cli/lib/ext/promise');
var conf             = require('ember-cli-internal-test-helpers/lib/helpers/conf');
var BlueprintNpmTask = require('ember-cli-internal-test-helpers/lib/helpers/disable-npm-on-blueprint');
var fs               = require('fs-extra');
var remove           = Promise.denodeify(fs.remove);
var tmpenv           = require('./helpers/tmp-env');

exports.moduleForBlueprint = function(QUnit, description, options) {
  QUnit.module(description, {
    beforeEach: function() {
      tmpenv.freshDir();
      process.chdir(tmpenv.tmpdir);

      conf.setup();
      BlueprintNpmTask.disableNPM();

      if (options && options.beforeEach) {
        options.beforeEach.apply(this, arguments);
      }
    },

    afterEach: function() {
      if (options && options.afterEach) {
        options.afterEach.apply(this, arguments);
      }

      BlueprintNpmTask.restoreNPM();
      conf.restore();

      process.chdir(tmpenv.root);
      return remove(tmpenv.tmproot);
    }
  });
};
