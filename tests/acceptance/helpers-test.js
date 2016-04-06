var setupTestHooks = require('../../lib/helpers/setup');

var blueprintHelpers = require('../../helpers');
var emberNew = blueprintHelpers.emberNew;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

var chai = require('../../chai');
var expect = chai.expect;

describe('Acceptance: helpers', function() {
  setupTestHooks(this);
  describe('emberGenerateDestroy', function() {
    it('blueprint-test foo', function() {
      return emberNew()
        .then(() => emberGenerateDestroy(['blueprint-test', 'foo'], (file) => {
          expect(file('node-tests/blueprints/foo-test.js'))
            .to.contain('return emberNew()')
            .to.contain('.then(() => emberGenerateDestroy(args, (file) => {');
        }));
    });
  });
});
