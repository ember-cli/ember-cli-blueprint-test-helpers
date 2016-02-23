'use strict';

var tmp              = require('tmp-sync');
var path             = require('path');
var root             = process.cwd();
var tmproot          = path.resolve(root, 'tmp');
/**
  Return tmp environment
*/
var tmpenv = {
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
