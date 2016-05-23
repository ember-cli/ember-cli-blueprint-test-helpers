'use strict';

var blueprintHelpers = require('../../helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;
var emberGenerate = blueprintHelpers.emberGenerate;

var expect = require('../../chai').expect;
var file = require('../../chai').file;

describe('Acceptance: ember generate and destroy ember-cli-blueprint-test-helpers', function() {
  setupTestHooks(this);

  it('ember-cli-blueprint-test-helpers', function() {
    var args = ['ember-cli-blueprint-test-helpers'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerate(args)
      .then((result) => {
        // test ui output because we can't test for actual npm install modifying package.json
        expect(result.outputStream.join(' ')).to.contain('install package\u001b[39m mocha');
        expect(file('.npmignore')).to.contain('node-tests/');
    }));
  });
  it('ember-cli-blueprint-test-helpers', function() {
    var args = ['ember-cli-blueprint-test-helpers', '-babel'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerate(args)
      .then((result) => {
        let output = result.outputStream.join('');
        // test ui output because we can't test for actual npm install modifying package.json
        expect(output).to.contain('babel-register')
        expect(output).to.contain('babel-plugin-transform-es2015-arrow-functions')
        expect(output).to.contain('babel-plugin-transform-es2015-shorthand-properties');

        expect(file('node-tests/.babelrc'))
          .to.contain('"plugins": [')
          .to.contain('"transform-es2015-arrow-functions",')
          .to.contain('"transform-es2015-shorthand-properties"')
        expect(file('node-tests/mocha.opts'))
          .to.contain('--require babel-register\n--recursive');
    }));
  });
});
