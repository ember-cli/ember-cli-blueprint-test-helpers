var existsSync = require('exists-sync');
var path       = require('path');
var fs         = require('fs');
var debug      = require('debug')('ember-cli:testing');

/**
  Teardown
  @param {Object} [options]
  @param {Boolean} [options.teardown]
  @return {null}
*/
module.exports = function(options) {
  if (options.teardown) {
    return unlinkAsDependency(options);
  } else {
    return;
  }
};

/**
  Unlink package as dependecy
  @method unlinkAsDependency
  @param {Object} [options]
  @param {String} [options.packageName]
  @param {Path} [options.projectRoot]
  @return {null}
*/
function unlinkAsDependency(options) {
  var dep = path.join(options.projectRoot, 'node_modules', options.packageName);

  if (existsSync(path.resolve(dep, 'package.json'))) {
    debug('unlinking: ' + dep);
    fs.unlinkSync(dep);
  }
}
