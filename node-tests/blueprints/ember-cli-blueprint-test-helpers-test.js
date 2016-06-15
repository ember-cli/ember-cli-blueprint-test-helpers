'use strict';

var blueprintHelpers = require('../../helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerate = blueprintHelpers.emberGenerate;

var fs = require('fs-extra');
var path = require('path');
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
  it('ember-cli-blueprint-test-helpers -babel', function() {
    var args = ['ember-cli-blueprint-test-helpers', '--babel'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerate(args))
      .then((result) => {
        let output = result.outputStream.join('');
        // test ui output because we can't test for actual npm install modifying package.json
        expect(output).to.contain('babel-register');
        expect(output).to.contain('babel-plugin-transform-es2015-arrow-functions');
        expect(output).to.contain('babel-plugin-transform-es2015-shorthand-properties');

        expect(file('node-tests/.babelrc'))
          .to.contain('"plugins": [')
          .to.contain('"transform-es2015-arrow-functions",')
          .to.contain('"transform-es2015-shorthand-properties"');
        expect(file('package.json'))
          .to.contain('--recursive --require babel-register');
      });
  });
  it('doesn\'t write to existing nodetest scripts', function() {
    var args = ['ember-cli-blueprint-test-helpers', '--babel'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => {
        // modify package
        let packagePath = path.resolve(process.cwd(), 'package.json');
        let pkg = fs.readJsonSync(packagePath);
        pkg.scripts.nodetest = 'mocha tests';
        fs.writeJsonSync(packagePath, pkg, {spaces:2});
      })
      .then(() => emberGenerate(args))
      .then((result) => {
        let output = result.outputStream.join('');
        expect(output).to.contain('Could not update "nodetest" script in package.json. Please add "mocha node-tests --recursive --require babel-register" to your nodetest script.');
        expect(file('package.json')).to.contain('mocha tests');
      });
  });
});
