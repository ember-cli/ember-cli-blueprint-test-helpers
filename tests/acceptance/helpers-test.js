'use strict';
const setupTestHooks = require('../../lib/helpers/setup');

const blueprintHelpers = require('../../helpers');
const emberNew = blueprintHelpers.emberNew;
const emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;
const emberGenerate = blueprintHelpers.emberGenerate;
const emberDestroy = blueprintHelpers.emberDestroy;
const path = require('path');
const fs = require('fs');

const chai = require('../../chai');
const expect = chai.expect;
const dir = chai.dir;
const file = chai.file;

describe('Acceptance: helpers', function () {
  setupTestHooks(this);

  describe('emberNew', () => {
    it('emberNew - classic app', () => {
      return emberNew()
        .then(() => {
          const appPath = path.resolve(process.cwd(), 'app');
          expect(fs.existsSync(appPath)).to.equal(true);
        });
    });

    it('emberNew - classic addon', () => {
      return emberNew({ target: 'addon' })
        .then(() => {
          const addonPath = path.resolve(process.cwd(), 'addon');
          expect(fs.existsSync(addonPath)).to.equal(true);
        });
    });
  });

  describe('emberGenerateDestroy', () => {
    it('blueprint-test foo - in a classic app', () => {
      return emberNew()
        .then(() => emberGenerateDestroy(['blueprint-test', 'foo'], (file) => {
          expect(file('node-tests/blueprints/foo-test.js'))
            .to.contain('return emberNew()');
        }));
    });
  });

  describe('emberGenerate and emberDestroy', () => {
    it('blueprint-test foo - in a classic app', () => {
      const args = ['blueprint-test', 'foo'];

      return emberNew()
        .then(() => emberGenerate(args))
        .then(() => {
          expect(file('node-tests/blueprints/foo-test.js'))
            .to.contain('return emberNew()');
        })
        .then(() => emberDestroy(args))
        .then(() => {
          expect(file('node-tests/blueprints/foo-test.js')).to.not.exist;
        });
    });
  });

  describe('setupTestHooks', () => {
    const symlink = path.resolve(__dirname, '..', '..', 'node_modules', 'ember-cli-blueprint-test-helpers');

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
