var existsSync = require('exists-sync');
var path       = require('path');
var fs         = require('fs');
var debug      = require('debug')('ember-cli:testing');

module.exports = function(options) {
  if (options.teardown) {
    return unlinkAsDependency(options);
  } else {
    return;
  }
};

function unlinkAsDependency(options) {
  var dep = path.join(options.projectRoot, 'node_modules', options.packageName);
  
  if (existsSync(path.resolve(dep, 'package.json'))) {
    debug('unlinking: ' + dep);
    fs.unlinkSync(dep);
  }
}