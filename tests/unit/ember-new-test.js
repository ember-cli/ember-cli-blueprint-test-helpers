'use strict';
const setupTestHooks = require('../../lib/helpers/setup');

const chai = require('../../chai');
const expect = chai.expect;
const td = require('testdouble')

let ember;

describe('Unit: emberNew', function () {
  setupTestHooks(this);

  afterEach(() => {
    td.reset();
    ember = undefined;
  });

  it('emberNew - extraCliArgs', () => {
    const originalEmber = require('../../lib/helpers/ember.js');
    ember = td.replace('../../lib/helpers/ember.js');

    // "spy" on the original ember function.
    // testdouble.js doesn't have built-in support for this because it considers it a bad practise:
    // https://github.com/testdouble/testdouble.js/issues/512#issuecomment-1527511338
    td.when(ember(td.matchers.contains('--typescript', '--no-welcome'), td.matchers.anything())).thenDo((...args) => {
      return originalEmber(...args);
    });

    // We require emberNew here so the testdouble dependency replacement works
    const emberNew = require('../../lib/ember-new');

    return emberNew({ extraCliArgs: ['--typescript', '--no-welcome'] })
      .then(() => {
        // If we get here that means our testdouble matcher worked and things were called as expected.
        expect(true).to.be.true;
      });
  });
});
