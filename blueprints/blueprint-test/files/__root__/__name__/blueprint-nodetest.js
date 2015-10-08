'use strict';

var EOL                = require('os').EOL;
var tmpenv             = require('ember-cli-blueprint-test-helpers/lib/helpers/tmp-env');
var setupTestHooks     = require('ember-cli-blueprint-test-helpers/lib/helpers/setup');
var BlueprintHelpers   = require('ember-cli-blueprint-test-helpers/lib/helpers/blueprint-helper');
var generateAndDestroy = BlueprintHelpers.generateAndDestroy;

describe('Acceptance: ember generate <%= blueprintName %>', function() {
  setupTestHooks(this, 20000, tmpenv);;
  
  it('<%= blueprintName %>', function() {
    return generateAndDestroy(['<%= blueprintName %>', 'foo'], {
      files: [
        // { file: 'app/type/foo.js', contents: ['foo']}
      ]
    });
  });

});