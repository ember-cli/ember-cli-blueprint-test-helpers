'use strict';

const fs = require('fs-extra');
const path = require('path');
const EOL = require('os').EOL;

module.exports = {
  description: 'Installs dependencies for ember-cli-blueprint-test-helpers',

  normalizeEntityName() {},

  afterInstall(options) {
    this.insertTestCallToPackage(options);

    return Promise.all([
      this.insertIntoFile('./.npmignore', `/node-tests${EOL}`),
      this.addMochaToPackage(),
    ]);
  },

  addMochaToPackage() {
    let pkg = fs.readJsonSync(path.join(__dirname, '../../package.json'));

    return this.addPackageToProject('mocha', pkg.devDependencies['mocha']);
  },

  insertTestCallToPackage() {
    let insert = false;
    let fullPath = path.join(this.project.root, 'package.json');
    let scriptContents = 'mocha node-tests --recursive';
    let packageContents = fs.readJsonSync(fullPath, { throws: false });
    if (!('nodetest' in packageContents.scripts)) {
      packageContents.scripts.nodetest = scriptContents;
      insert = true;
    } else {
      this.ui.writeLine(`Could not update "nodetest" script in package.json. Please add "${scriptContents}" to your nodetest script.`);
    }

    if (insert) {
      fs.writeJsonSync(fullPath, packageContents, {spaces:2});
    }
  }
};
