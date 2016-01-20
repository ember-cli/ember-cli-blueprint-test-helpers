'use strict';

var ember       = require('ember-cli/tests/helpers/ember');
var Promise     = require('ember-cli/lib/ext/promise');
var path        = require('path');
var findup      = Promise.denodeify(require('findup'));
var initProject = require('./project-init');
var expect      = require('chai').expect;
var existsSync  = require('exists-sync');
var walkSync    = require('walk-sync');
var assert      = require('ember-cli-internal-test-helpers/lib/helpers/assert');
var assertFile  = require('ember-cli-internal-test-helpers/lib/helpers/assert-file');
var tmpenv      = require('./tmp-env');
var debug       = require('debug')('ember-cli:testing');
var fs          = require('fs');
var teardownProject = require('./project-teardown');

/**
generate blueprint then assert generated contents against options.files
*/
function generate(args, options) {
  var fileAssertions = options.files || [];
  var command = processCommand('generate', args, options)
    .then(assertGenerated.bind(null, fileAssertions));
  
  if(options.throws) {
    command.catch(assertThrows.bind(null, options.throws));
  } else {
    command.catch(function(err) { throw err;});
  }
  
  return command;
}

/**
destroy blueprint then assert options.files destroyed
*/
function destroy(args, options) {
  var fileAssertions = options.files || [];
  var command = processCommand('destroy', args, options)
    .then(assertDestroyed.bind(null, fileAssertions));
  
  if (options.throws) {
    command.catch(assertThrows.bind(null, options.throws));
  } else {
    command.catch(function(err) { throw err;});
  }
  return command;
}

/**
generate blueprint and assert contents, then destroy blueprint and assert destroyed
*/
function generateAndDestroy(args, options) {
  var assertions = options.assertions || [];
  var fileAssertions = options.files || [];
  var command = processCommand('generate', args, options)
    .then(assertGenerated.bind(null, fileAssertions))
    .then(processAssertions.bind(null, assertions))
    .then(function() {
      options.skipInit = true;
      options.teardown = true;
      return processCommand('destroy', args, options);
    })
    .then(assertDestroyed.bind(null, fileAssertions));
    
  if(options.throws) {
    command.catch(assertThrows.bind(null, options.throws));
  } else {
    command.catch(function(err) { throw err;});
  }
  return command;
}

/**
process command
*/
function processCommand(command, args, options) {
  var commandArgs = [command].concat(args);
  var type = (options.target === 'inRepoAddon') ? 'app' : (options.target ? options.target : 'app');
  var projectRoot = options.root || getProjectRoot(process.cwd());
  // console.log(projectRoot, type);
  var mockPackage = options.package || getPackage(projectRoot, type);
  var cliOptions = {
    type: type,
    disableDependencyChecker: true,
    package: mockPackage
  };
  var beforeProcess = function() {return;};
  var afterProcess = function() {return;};
  
  if (options && options.target === 'inRepoAddon') {
    commandArgs.push('--in-repo-addon=my-addon');
  }
  options.command = command;
  options.package = mockPackage;
  options.projectRoot = projectRoot;
  options.packageName = getPackageName(projectRoot);
  
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
      return ember(commandArgs, cliOptions);
    })
    .then(resultContents.bind(null, options, tmpenv))
    .then(afterProcess)
    .then(teardownProject.bind(null, options))
    .catch(function(err) {
      throw err;
    });
}

function resultContents(options, env, result) {
  debug('After ' + options.command + ' project contents: ', walkSync(env.tmpdir));
  // console.log('After ' + options.command + ' project contents: ', walkSync(env.tmpdir));
  // if throws is defined, and there is an result.error
  if (options && options.throws && result && result.statusCode) {
    // if the result has a SilentError, throw so we can assert
    if (result.errorLog.length) {
      throw result.errorLog[0];
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
    // console.log('asserting file: ', file.file)
    if (typeof file.exists === 'undefined' || file.exists) {
      return assertFile(file.file, file);
    } else {
      return assertFileNotExists(file.file);
    }
    
  });
}

/**
assert destroyed files
*/
function assertDestroyed(files) {
  files.forEach(function(file) {
    return assertFileNotExists(file.file);
  });
}
/**
assert file doesn't exist
*/
function assertFileNotExists(file) {
  var filePath = path.resolve(process.cwd(), file);
  return expect(!existsSync(filePath), 'expected ' + file + ' not to exist');
}

/**
assert specific error is thrown.
*/
function assertThrows(assertion, err) {
  var message;
  if (assertion instanceof RegExp) {
    message = assertion;
  } else if (assertion.message){
    message = assertion.message;
  }
  expect(err.message).to.match(message);

  if (assertion.name) {
    expect(err.name).to.match(assertion.name);
  }
}

function getPackage(pathRoot, type) {
  // console.log('pathRoot:',pathRoot, type);
  // console.log(path.resolve(pathRoot, 'node-tests', 'fixtures', type, 'package'));
  return path.resolve(pathRoot, 'node-tests', 'fixtures', type, 'package');
}

function getProjectRoot(pathRoot) {
    var tmp = process.cwd();
    try {
      tmp = findup.sync(pathRoot, 'tmp');
    } catch(e) {
      console.error(e);
    }
    return tmp;
}

function getPackageName(projectRoot) {
    var contents = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), {encoding: 'utf8'}));
    return contents.name;
}

module.exports = {
  generate: generate,
  destroy: destroy,
  generateAndDestroy: generateAndDestroy,
  getPackage: getPackage
};
