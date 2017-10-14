'use strict';

const requireFromCLI = require('./require-from-cli');

function ember() {
  return requireFromCLI('tests/helpers/ember').apply(this, arguments);
}

module.exports = ember;
