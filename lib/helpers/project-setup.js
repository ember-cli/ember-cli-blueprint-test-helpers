'use strict';

var Promise     = require('ember-cli/lib/ext/promise');
var replaceFile = require('ember-cli/tests/helpers/file-utils').replaceFile;
var EOL         = require('os').EOL;

module.exports.setupPodConfig = function(options) {
  var projectOptions = options || {};
  if (!options) {
    return Promise.resolve();
  }
  if (options.usePods) {
    replaceFile('.ember-cli', '"disableAnalytics": false', '"disableAnalytics": false,' + EOL + '"usePods" : true' + EOL);  
  }
  
  if (options.podModulePrefix) {
    replaceFile('config/environment.js', "var ENV = {", "var ENV = {" + EOL + "podModulePrefix: 'app/pods', " + EOL);
  }
  
  return Promise.resolve();
};