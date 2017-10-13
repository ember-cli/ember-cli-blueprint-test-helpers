'use strict';

const blueprintHelpers = require('../../helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

const expect = require('../../chai').expect;

describe('Acceptance: ember generate and destroy blueprint-test', function() {
  setupTestHooks(this);

  it('blueprint-test foo', () => {
    let args = ['blueprint-test', 'foo'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, file => {
        expect(file('node-tests/blueprints/foo-test.js'))
          .to.contain('describe(\'Acceptance: ember generate and destroy foo\', function() {');
      }));
  });
});
