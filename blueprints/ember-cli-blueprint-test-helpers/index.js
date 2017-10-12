var fs = require('fs-extra');
var path = require('path');
var EOL = require('os').EOL;

module.exports = {
  description: 'Installs dependencies for ember-cli-blueprint-test-helpers',

  normalizeEntityName: function() {},

  afterInstall: function(options) {
    this.insertTestCallToPackage(options);

    return Promise.all([
      this.insertIntoNpmIgnore(),
      this.addMochaToPackage(),
    ]);
  },

  insertIntoNpmIgnore: function() {
    return this.insertIntoFile('./.npmignore', EOL + '/node-tests', { before: '/tests' + EOL });
  },

  addMochaToPackage: function() {
    var pkg = fs.readJsonSync(path.join(__dirname, '../../package.json'));

    return this.addPackageToProject('mocha', pkg.devDependencies['mocha']);
  },

  insertTestCallToPackage: function() {
    var insert = false;
    var fullPath = path.join(this.project.root, 'package.json');
    var scriptContents = 'mocha node-tests --recursive';
    var packageContents = fs.readJsonSync(fullPath, { throws: false });
    if (!('nodetest' in packageContents.scripts)) {
      packageContents.scripts.nodetest = scriptContents;
      insert = true;
    } else {
      this.ui.writeLine('Could not update "nodetest" script in package.json. Please add "' + scriptContents +
        '" to your nodetest script.');
    }

    if (insert) {
      fs.writeJsonSync(fullPath, packageContents, {spaces:2});
    }
  }
};
