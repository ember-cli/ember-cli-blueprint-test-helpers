'use strict';

var blueprintHelpers = require('../../helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerate = blueprintHelpers.emberGenerate;

var fs = require('fs-extra');
var stripAnsi = require('strip-ansi');
var expect = require('../../chai').expect;
var file = require('../../chai').file;

describe('Acceptance: ember generate ember-cli-blueprint-test-helpers', function() {
  setupTestHooks(this);

  it('ember-cli-blueprint-test-helpers', function() {
    var args = ['ember-cli-blueprint-test-helpers'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerate(args))
      .then((result) => {
        // test ui output because we can't test for actual npm install modifying package.json
        expect(stripAnsi(result.outputStream.join(' ')))
          .to.contain('install package mocha');
        expect(file('.npmignore')).to.contain('node-tests/');
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
