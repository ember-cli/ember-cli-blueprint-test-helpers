'use strict';

var ember   = require('./ember');
var Promise = require('ember-cli/lib/ext/promise');
var initProject = require('./project-init');
var path        = require('path');
var expect      = require('chai').expect;
var existsSync  = require('exists-sync');
var assertFile       = require('./assert-file');

/**
generate blueprint then assert generated contents against options.files
*/
module.exports.generate = function(args, options) {
  var fileAssertions = options.files || [];
  return processCommand('generate', args, options)
    .then(assertGenerated.bind(this, fileAssertions));
};

/**
destroy blueprint then assert options.files destroyed
*/
module.exports.destroy = function(args, options) {
  var fileAssertions = options.files || [];
  return processCommand('destroy', args, options)
    .then(assertDestroyed.bind(this, fileAssertions));
};

/**
generate blueprint and assert contents, then destroy blueprint and assert destroyed
*/
module.exports.generateAndDestroy = function(args, options) {
  var fileAssertions = options.files || [];
  return processCommand('generate', args, options)
    .then(assertGenerated.bind(this, fileAssertions))
    .then(function() {
      options.skipInit = true;
      return processCommand('destroy', args, options);
    })
    .then(assertDestroyed.bind(this, fileAssertions));
};

/**
process command
*/
function processCommand(command, args, options) {
  var commandArgs = [command].concat(args);
  if (options && options.target === 'inRepoAddon') {
    commandArgs.push('--in-repo-addon=my-addon');
  }
  return initProject(options)
    .then(function() {
      return ember(commandArgs);
    });
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