'use strict';

var basePath = 'ember-cli';

function requireFromCLI(path) {
  return require(basePath + '/' + path);
}

requireFromCLI.setBasePath = function(path) {
  basePath = path;
};

module.exports = requireFromCLI;
