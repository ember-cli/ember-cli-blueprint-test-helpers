'use strict';

var Promise     = require('ember-cli/lib/ext/promise');
var replaceFile = require('ember-cli-internal-test-helpers/lib/helpers/file-utils').replaceFile;
var EOL         = require('os').EOL;

/**
setupPodConfig will setup a mock project's config files
to use pods or use a podModulePrefix.
*/
module.exports.setupPodConfig = function(options) {
  // if no options, exit early
  if (!options) {
    return Promise.resolve();
  }
  // setup usePods for a project in .ember-cli
  if (options.usePods) {
    replaceFile('.ember-cli', '"disableAnalytics": false', '"disableAnalytics": false,' + EOL + '"usePods" : true' + EOL);  
  }
  // setup environment.js with a pre-set podModulePrefix
  if (options.podModulePrefix) {
    replaceFile('config/environment.js', "var ENV = {", "var ENV = {" + EOL + "podModulePrefix: 'app/pods', " + EOL);
  }
  
  return Promise.resolve();
};