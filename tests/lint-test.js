'use strict';

const lint = require('mocha-eslint');

var paths = [
  'blueprints',
  'lib',
  'node-tests',
  'tests',
];

lint(paths);
