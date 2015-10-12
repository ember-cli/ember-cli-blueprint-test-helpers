'use strict';

var ember       = require('ember-cli/tests/helpers/ember');
var Promise     = require('ember-cli/lib/ext/promise');
var initProject = require('./project-init');
var path        = require('path');
var expect      = require('chai').expect;
var existsSync  = require('exists-sync');
var walkSync    = require('walk-sync');
var assert      = require('ember-cli-internal-test-helpers/lib/helpers/assert');
var assertFile  = require('ember-cli-internal-test-helpers/lib/helpers/assert-file');
var tmpenv      = require('./tmp-env');

/**
generate blueprint then assert generated contents against options.files
*/
function generate(args, options) {
  var fileAssertions = options.files || [];
  var throwsMessage = options.throws || / /;
  return processCommand('generate', args, options)
    .then(assertGenerated.bind(null, fileAssertions))
    .catch(assertThrows.bind(null, throwsMessage));
}

/**
destroy blueprint then assert options.files destroyed
*/
function destroy(args, options) {
  var fileAssertions = options.files || [];
  var throwsMessage = options.throws || / /;
  return processCommand('destroy', args, options)
    .then(assertDestroyed.bind(null, fileAssertions))
    .catch(assertThrows.bind(null, throwsMessage));
}

/**
generate blueprint and assert contents, then destroy blueprint and assert destroyed
*/
function generateAndDestroy(args, options) {
  var assertions = options.assertions || [];
  var fileAssertions = options.files || [];
  var throwsMessage = options.throws || / /;
  return processCommand('generate', args, options)
    .then(assertGenerated.bind(null, fileAssertions))
    .then(processAssertions.bind(null, assertions))
    .then(function() {
      options.skipInit = true;
      return processCommand('destroy', args, options);
    })
    .then(assertDestroyed.bind(null, fileAssertions))
    .catch(assertThrows.bind(null, throwsMessage));
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

function resultContents(options, env, result) {
  // if throws is defined, and there is an result.error
  if (options && options.throws && result && result.error) {
    // if the result has a SilentError, throw so we can assert
    if (result.error.name === 'SilentError') {
      throw result.error;
    }
  }
  return {
    result: result,
    options: options,
    outputPath: env && env.tmpdir || null,
    outputFiles: env && env.tmpdir && walkSync(env.tmpdir) || null
  };
}
/**
process assertions from hook
*/
function processAssertions(assertions) {
  assertions.forEach(function(assertion) {
    expect(assertion);
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
/**
assert file doesn't exist
*/
function assertFileNotExists(file) {
  var filePath = path.join(process.cwd(), file);
  expect(!existsSync(filePath), 'expected ' + file + ' not to exist');
}

/**
assert specific error is thrown.
*/
function assertThrows(message, err) {
  expect(err.message).to.match(message);
}

module.exports = {
  generate: generate,
  destroy: destroy,
  generateAndDestroy: generateAndDestroy
};
