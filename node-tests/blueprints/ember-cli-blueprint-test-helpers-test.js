'use strict';

var blueprintHelpers = require('../../helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerate = blueprintHelpers.emberGenerate;

var fs = require('fs-extra');
var stripAnsi = require('strip-ansi');
var expect = require('../../chai').expect;
var file = require('../../chai').file;
var EOL = require('os').EOL;

function getDevDependencies() {
  let pkg = fs.readJsonSync('package.json');
  return Object.keys(pkg.devDependencies);
}

describe('Acceptance: ember generate ember-cli-blueprint-test-helpers', function() {
  describe('with mocking', function() {
    setupTestHooks(this);

    it('ember-cli-blueprint-test-helpers', function() {
      var args = ['ember-cli-blueprint-test-helpers'];

      // pass any additional command line options in the arguments array
      return emberNew({ target: 'addon' })
        .then(() => emberGenerate(args))
        .then((result) => {
          // test ui output because we can't test for actual npm install modifying package.json
          expect(stripAnsi(result.outputStream.join(' ')))
            .to.contain('install package mocha', 'shows console output');
          expect(file('.npmignore')).to.contain('/node-tests' + EOL, 'updates .npmignore');
          expect(file('.travis.yml')).to.contain('- env: EMBER_TRY_SCENARIO=ember-canary' + EOL + '  include:', 'updates .travis.yml');
        });
    });

    it('doesn\'t write to existing nodetest scripts', function() {
      var args = ['ember-cli-blueprint-test-helpers'];

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

    it('adds mocha as a dependency', function() {
      var args = ['ember-cli-blueprint-test-helpers'];

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
