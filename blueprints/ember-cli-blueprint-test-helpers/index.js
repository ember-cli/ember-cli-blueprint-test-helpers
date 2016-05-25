var Promise = require('ember-cli/lib/ext/promise');
var existsSync = require('exists-sync');
var fs = require('fs-extra');
var path = require('path');
var merge = require('lodash.merge');
var writeFile = Promise.denodeify(fs.outputFile);

module.exports = {
  description: 'Installs dependencies for ember-cli-blueprint-test-helpers',
  availableOptions: [
    {
      name: 'babel',
      type: Boolean,
      default: false
    }
  ],
  normalizeEntityName: function(){},
  afterInstall: function(options) {
    var afterInstallTasks = [
      this.insertIntoFile('./.npmignore', 'node-tests/'),
      this.insertTestCallToPackage(options)
    ];
    var packages = [{name: 'mocha', target: '^2.2.1'}];

    if (options.babel) {
      afterInstallTasks.push(this.insertIntoJsonFile('./node-tests/.babelrc',{plugins: ["transform-es2015-arrow-functions", "transform-es2015-shorthand-properties"]}));
      // add babel specific packages
      packages.push({name: 'babel-plugin-transform-es2015-arrow-functions', target: '^6.5.2'},
          {name: 'babel-plugin-transform-es2015-shorthand-properties', target: '^6.5.0'},
          {name: 'babel-register', target: '^6.7.2'});
    }
    afterInstallTasks.push(this.addPackagesToProject(packages));
    return Promise.all(afterInstallTasks);
  },
  insertIntoJsonFile: function(pathRelativeToProjectRoot, contents) {
    var fullPath = path.join(this.project.root, pathRelativeToProjectRoot);
    var contentsToWrite;
    var originalContents = {};
    if (existsSync(fullPath)) {
      originalContents = JSON.parse(fs.readFileSync(fullPath, { encoding: 'utf8' }));
    }
    contentsToWrite = JSON.stringify(merge(originalContents, contents), null, 2);
    var returnValue = {
      path: fullPath,
      originalContents: originalContents,
      contents: contentsToWrite,
      inserted: false
    };
    if (contentsToWrite !== originalContents) {
      returnValue.inserted = true;

      return writeFile(fullPath, contentsToWrite)
        .then(function() {
          return returnValue;
        });
    } else {
      return Promise.resolve(returnValue);
    }
  },
  insertTestCallToPackage: function(options) {
    var contentsToWrite;
    var fullPath = path.join(this.project.root, 'package.json');
    var scriptContents = 'mocha node-tests --recursive';
    var babelContents = ' --require babel-register';
    var originalContents = fs.readJsonSync(fullPath, { throws: false });
    if (originalContents.scripts.nodetest === scriptContents) {
      if (options.babel) {
        originalContents.scripts.nodetest += babelContents;
      }
    } else if (typeof originalContents.scripts.nodetest === 'undefined') {
      originalContents.scripts.nodetest = scriptContents + (options.babel ? babelContents : '');
    } else {
      this.ui.writeLine('Could not update "nodetest" script in package.json. Please add "' + scriptContents +
        (options.babel ? babelContents : '') + '" to your nodetest script.');
    }
    contentsToWrite = JSON.stringify(originalContents, null, 2);
    var returnValue = {
      path: fullPath,
      originalContents: originalContents,
      contents: contentsToWrite,
      inserted: false
    };
    if (contentsToWrite !== originalContents) {
      returnValue.inserted = true;

      return writeFile(fullPath, contentsToWrite)
        .then(function() {
          return returnValue;
        });
    } else {
      return Promise.resolve(returnValue);
    }
  }
};
