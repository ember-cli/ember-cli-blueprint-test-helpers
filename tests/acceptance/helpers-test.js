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

describe('Acceptance: helpers', function() {
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

    it('emberNew - MU app', () => {
      return emberNew({ isModuleUnification: true })
        .then(() => {
          const srcPath = path.resolve(process.cwd(), 'src');
          expect(fs.existsSync(srcPath)).to.equal(true);
        })
        .then(() => {
          expect(process.env["EMBER_CLI_MODULE_UNIFICATION"]).to.equal(undefined);
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

    it('blueprint-test foo - in a MU app with no flag', () => {
      return emberNew({ isModuleUnification: true })
        .then(() => emberGenerateDestroy(['blueprint-test', 'foo'], (file) => {
          expect(file('node-tests/blueprints/foo-test.js'))
            .to.contain('return emberNew()');
        }));
    });

    it('blueprint-test foo - in a MU app with MU flag', () => {
      return emberNew({ isModuleUnification: true })
        .then(() => emberGenerateDestroy(['blueprint-test', 'foo'], (file) => {
          expect(file('node-tests/blueprints/foo-test.js'))
            .to.contain('return emberNew({ isModuleUnification: true })');
        }, { isModuleUnification: true }))
        .then(() => {
          expect(process.env["EMBER_CLI_MODULE_UNIFICATION"]).to.equal(undefined);
        });
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

    it('blueprint-test foo - in a MU app', () => {
      const args = ['blueprint-test', 'foo'];

      return emberNew({ isModuleUnification: true })
        .then(() => emberGenerate(args, { isModuleUnification: true }))
        .then(() => {
          expect(file('node-tests/blueprints/foo-test.js'))
            .to.contain('return emberNew({ isModuleUnification: true })');
        })
        .then(() => emberDestroy(args, { isModuleUnification: true }))
        .then(() => {
          expect(file('node-tests/blueprints/foo-test.js')).to.not.exist;

          expect(process.env["EMBER_CLI_MODULE_UNIFICATION"]).to.equal(undefined);
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
