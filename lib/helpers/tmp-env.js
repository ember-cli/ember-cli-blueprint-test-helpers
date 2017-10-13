'use strict';

const tmp              = require('tmp-sync');
const path             = require('path');
const root             = process.cwd();
const tmproot          = path.resolve(root, 'tmp');
/**
  Return tmp environment
*/
let tmpenv = {
  root: root,
  tmproot: tmproot,
  tmpdir: null
};

/**
  Create a fresh tmp dir and return it
*/
function freshDir() {
  tmpenv.tmpdir = tmp.in(tmproot);
  return tmpenv.tmpdir;
}

module.exports = tmpenv;
module.exports.freshDir = freshDir;
