'use strict';

const blueprintHelpers = require('../../helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerate = blueprintHelpers.emberGenerate;

const fs = require('fs-extra');
const stripAnsi = require('strip-ansi');
const expect = require('../../chai').expect;
const file = require('../../chai').file;
const EOL = require('os').EOL;

function getDevDependencies() {
  let pkg = fs.readJsonSync('package.json');
  return Object.keys(pkg.devDependencies);
}

describe('Acceptance: ember generate ember-cli-blueprint-test-helpers', () => {
  describe('with mocking', function() {
    setupTestHooks(this);

    it('ember-cli-blueprint-test-helpers', () => {
      let args = ['ember-cli-blueprint-test-helpers'];

      // pass any additional command line options in the arguments array
      return emberNew()
        .then(() => emberGenerate(args))
        .then((result) => {
          // test ui output because we can't test for actual npm install modifying package.json
          expect(stripAnsi(result.outputStream.join(' ')))
            .to.contain('install package mocha');
          expect(file('.npmignore')).to.contain(`/node-tests${EOL}`);
        });
    });

    it('doesn\'t write to existing nodetest scripts', () => {
      let args = ['ember-cli-blueprint-test-helpers'];

      // pass any additional command line options in the arguments array
      return emberNew()
        .then(() => {
          // modify package
          let pkg = fs.readJsonSync('package.json');
          pkg.scripts.nodetest = 'mocha tests';
          fs.writeJsonSync('package.json', pkg, {spaces:2});
        })
        .then(() => emberGenerate(args))
        .then((result) => {
          let output = result.outputStream.join('');
          expect(output).to.contain('Could not update "nodetest" script in package.json. Please add "mocha node-tests --recursive" to your nodetest script.');
          expect(file('package.json')).to.contain('mocha tests');
        });
    });
  });

  describe('without mocking', function() {
    setupTestHooks(this, {
      disabledTasks: [],
      timeout: 300000
    });

    it('adds mocha as a dependency', () => {
      let args = ['ember-cli-blueprint-test-helpers'];

      return emberNew()
        .then(() => {
          expect(getDevDependencies()).to.not.contain('mocha');
        })
        .then(() => emberGenerate(args))
        .then(() => {
          expect(getDevDependencies()).to.contain('mocha');
        });
    });
  });
});
