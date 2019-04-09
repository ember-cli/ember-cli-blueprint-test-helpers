'use strict';

const { 
  setupTestHooks,
  emberNew,
  emberGenerateDestroy,
} = require('ember-cli-blueprint-test-helpers/helpers');

const {
  expect
} = require('ember-cli-blueprint-test-helpers/chai');

describe('Acceptance: ember generate and destroy <%= blueprintName %>', function() {
  setupTestHooks(this);

  it('<%= blueprintName %> foo', function() {
    const args = ['<%= blueprintName %>', 'foo'];

    // pass any additional command line options in the arguments array
    return emberNew(<%= muOption %>)
      .then(() => emberGenerateDestroy(args, () => {
        // expect(file('app/type/foo.js')).to.contain('foo');
    }));
  });
});
