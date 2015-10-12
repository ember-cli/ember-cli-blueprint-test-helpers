'use strict';

var EOL                = require('os').EOL;
var tmpenv             = require('ember-cli-blueprint-test-helpers/lib/helpers/tmp-env');
var setupTestHooks     = require('ember-cli-blueprint-test-helpers/lib/helpers/setup');
var BlueprintHelpers   = require('ember-cli-blueprint-test-helpers/lib/helpers/blueprint-helper');
var generateAndDestroy = BlueprintHelpers.generateAndDestroy;

describe('Acceptance: ember generate and destroy <%= blueprintName %>', function() {
  setupTestHooks(this, 20000, tmpenv);
  
  it('<%= blueprintName %> foo', function() {
    // pass any additional command line options in the arguments array
    return generateAndDestroy(['<%= blueprintName %>', 'foo'], {
      // define files to assert, and their contents
      files: [
        // { file: 'app/type/foo.js', contents: ['foo']}
      ]
    });
  });

});