'use strict';

const lint = require('mocha-eslint');

let paths = [
  'blueprints',
  'lib',
  'node-tests',
  'tests',
];

lint(paths);
