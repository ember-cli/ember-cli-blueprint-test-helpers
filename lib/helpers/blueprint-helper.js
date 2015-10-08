'use strict';

var ember       = require('./ember');
var Promise     = require('ember-cli/lib/ext/promise');
var initProject = require('./project-init');
var path        = require('path');
var expect      = require('chai').expect;
var existsSync  = require('exists-sync');
var walkSync    = require('walk-sync');
var assertFile  = require('./assert-file');
var tmpenv      = require('./tmp-env');

/**
generate blueprint then assert generated contents against options.files
*/
function generate(args, options) {
  var fileAssertions = options.files || [];
  return processCommand('generate', args, options)
    .then(assertGenerated.bind(null, fileAssertions));
}

/**
destroy blueprint then assert options.files destroyed
*/
function destroy(args, options) {
  var fileAssertions = options.files || [];
  return processCommand('destroy', args, options)
    .then(assertDestroyed.bind(null, fileAssertions));
}

/**
generate blueprint and assert contents, then destroy blueprint and assert destroyed
*/
function generateAndDestroy(args, options) {
  var fileAssertions = options.files || [];
  return processCommand('generate', args, options)
    .then(assertGenerated.bind(null, fileAssertions))
    .then(function() {
      options.skipInit = true;
      return processCommand('destroy', args, options);
    })
    .then(assertDestroyed.bind(null, fileAssertions));
}

/**
process command
*/
function processCommand(command, args, options) {
  var commandArgs = [command].concat(args);
  if (options && options.target === 'inRepoAddon') {
    commandArgs.push('--in-repo-addon=my-addon');
  }
  var beforeProcess = function() {return;};
  var afterProcess = function() {return;};
  
  if (command === 'generate' && options && options.beforeGenerate || options.afterGenerate) {
    beforeProcess = options.beforeGenerate;
    afterProcess = options.afterGenerate;
  } else if (command === 'destroy' && options && options.beforeDestroy || options.afterDestroy) {
    beforeProcess = options.beforeDestroy;
    afterProcess = options.afterDestroy;
  }
    
  return initProject(options)
    .then(resultContents.bind(null, options, tmpenv))
    .then(beforeProcess)
    .then(function() {
      return ember(commandArgs);
    })
    .then(resultContents.bind(null, options, tmpenv))
    .then(afterProcess);
}

function resultContents(options, env) {
  return {
    options: options,
    outputPath: env && env.tmpdir || null,
    outputFiles: env && env.tmpdir && walkSync(env.tmpdir) || null
  };
}

/**
assert generated contents
*/
function assertGenerated(files) {
  files.forEach(function(file) {
    assertFile(file.file, {contains: file.contains});
  });
}

/**
assert destroyed files
*/
function assertDestroyed(files) {
  files.forEach(function(file) {
    assertFileNotExists(file.file);
  });
}

function assertFileNotExists(file) {
  var filePath = path.join(process.cwd(), file);
  expect(!existsSync(filePath), 'expected ' + file + ' not to exist');
}

module.exports = {
  generate: generate,
  destroy: destroy,
  generateAndDestroy: generateAndDestroy
};
