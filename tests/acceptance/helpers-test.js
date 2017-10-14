'use strict';
const setupTestHooks = require('../../lib/helpers/setup');

const blueprintHelpers = require('../../helpers');
const emberNew = blueprintHelpers.emberNew;
const emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;
const path = require('path');

const chai = require('../../chai');
const expect = chai.expect;
const dir = chai.dir;

describe('Acceptance: helpers', function() {
  setupTestHooks(this);
  describe('emberGenerateDestroy', () => {
    it('blueprint-test foo', () => {
      return emberNew()
        .then(() => emberGenerateDestroy(['blueprint-test', 'foo'], (file) => {
          expect(file('node-tests/blueprints/foo-test.js'))
            .to.contain('return emberNew()')
            .to.contain('.then(() => emberGenerateDestroy(args, (file) => {');
        }));
    });
  });

  describe('setupTestHooks', () => {
    var symlink = path.resolve(__dirname, '..', '..', 'node_modules', 'ember-cli-blueprint-test-helpers');

    after(() => {
      expect(dir(symlink)).to.not.exist;
    });

    it('cleans up symlinked addon', () => {
      return emberNew()
        .then(() => {
          expect(dir(symlink)).to.exist;
        });
    });
  });
});
