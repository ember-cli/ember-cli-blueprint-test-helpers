var setupTestHooks = require('../../lib/helpers/setup');

var blueprintHelpers = require('../../helpers');
var emberNew = blueprintHelpers.emberNew;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;
var path = require('path');

var chai = require('../../chai');
var expect = chai.expect;
var dir = chai.dir;

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

  describe('setupTestHooks', function() {
    var symlink = path.resolve(__dirname, '..', '..', 'node_modules', 'ember-cli-blueprint-test-helpers');

    after(function() {
      expect(dir(symlink)).to.not.exist;
    });

    it('cleans up symlinked addon', function() {
      return emberNew()
        .then(() => {
          expect(dir(symlink)).to.exist;
        });
    });
  });
});
