'use strict';

var Promise     = require('ember-cli/lib/ext/promise');
var replaceFile = require('ember-cli-internal-test-helpers/lib/helpers/file-utils').replaceFile;
var EOL         = require('os').EOL;
var path        = require('path');
var fs          = require('fs');

/**
  SetupPodConfig will setup a mock project's config files
  to use pods or use a podModulePrefix.
  @method setupPodConfig
  @param {Object} [options]
  @param {Boolean} [options.usePods]
  @param {String} [options.podModulePrefix]
  @return {Promise}
*/
function setupPodConfig(options) {
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
}

/**
  Setup package.json
  @method setupPackage
  @param {Object} [options]
  @param {String} [options.packageName]
  @param {Path} [options.packagePath]
  @return {Promise}
*/
function setupPackage(options) {
  if (options && options.packageName) {
    // console.log('packageName',options.packageName)
    var packagePath = path.join(process.cwd(),'package.json');
    var contents  = JSON.parse(fs.readFileSync(packagePath, { encoding: 'utf8' }));
    // console.log(packagePath);
    contents.devDependencies[options.packageName] = '*';
    // console.log(contents)
    fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(contents, null, 2));
  }
  return Promise.resolve();
}


module.exports = {
  setupPodConfig: setupPodConfig,
  setupPackage: setupPackage
};
