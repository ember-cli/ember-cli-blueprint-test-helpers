'use strict';

var blueprintHelpers = require('../../helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

var expect = require('../../chai').expect;

describe('Acceptance: ember generate and destroy blueprint-test', function() {
  setupTestHooks(this);

  it('blueprint-test foo', function() {
    var args = ['blueprint-test', 'foo'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, file => {
        expect(file('node-tests/blueprints/foo-test.js'))
          .to.contain('describe(\'Acceptance: ember generate and destroy foo\', function() {');
      }));
  });
});
