'use strict';

var lint = require('mocha-eslint');

var paths = [
  'blueprints',
  'lib',
  'tests',
];

lint(paths);
