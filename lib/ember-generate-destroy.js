var chai = require('../chai');
var emberGenerate = require('./ember-generate');
var emberDestroy = require('./ember-destroy');

var expect = chai.expect;
var file = chai.file;

module.exports = function(args, assertionCallback) {
  var paths = [];

  var _file = function(path) {
    paths.push(path);
    return file(path);
  };

  return emberGenerate(args)
    .then(function() { assertionCallback(_file); })
    .then(function() { return emberDestroy(args); })
    .then(function() {
      if (paths.length === 0) {
        throw new Error('The file() parameter of the emberGenerateDestroy() callback function was never used.');
      }

      paths.forEach(function(path) {
        expect(file(path)).to.not.exist;
      })
    });
};
