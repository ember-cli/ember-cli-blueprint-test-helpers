var fs = require('fs-extra');
var path = require('path');

module.exports = {
  description: 'Installs dependencies for ember-cli-blueprint-test-helpers',

  normalizeEntityName: function() {},

  afterInstall: function(options) {
    this.insertTestCallToPackage(options);

    return Promise.all([
      this.insertIntoFile('./.npmignore', '/node-tests'),
      this.addPackagesToProject([{name: 'mocha', target: '^3.5.3'}]),
    ]);
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
