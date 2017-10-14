'use strict';

const chai = require('../chai');
const emberGenerate = require('./ember-generate');
const emberDestroy = require('./ember-destroy');

const expect = chai.expect;
const file = chai.file;

/**
 * @callback assertionCallback
 * @param {file} file
 */

/**
 * Run a blueprint generator and the corresponding blueprint destructor while
 * checking assertions in between.
 *
 * @param {Array.<String>} args arguments to pass to `ember generate` (e.g. `['my-blueprint', 'foo']`)
 * @param {assertionCallback} assertionCallback the callback function in which the assertions should happen
 * @returns {Promise}
 */
module.exports = function(args, assertionCallback) {
  let paths = [];

  let _file = function(path) {
    paths.push(path);
    return file(path);
  };

  return emberGenerate(args)
    .then(() => assertionCallback(_file))
    .then(() => emberDestroy(args))
    .then(() => {
      if (paths.length === 0) {
        throw new Error('The file() parameter of the emberGenerateDestroy() callback function was never used.');
      }

      paths.forEach((path) => {
        expect(file(path)).to.not.exist;
      })
    });
};
