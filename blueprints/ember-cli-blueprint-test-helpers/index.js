var Promise = require('ember-cli/lib/ext/promise');

module.exports = {
  description: 'Installs dependencies for ember-cli-blueprint-test-helpers',
  normalizeEntityName: function(){},
  afterInstall: function() {
    return Promise.all([
      this.insertIntoFile('./.npmignore', 'node-tests/'),
      this.addPackageToProject('ember-cli-internal-test-helpers', '^0.7.0'),
      this.addPackageToProject('glob', '5.0.13'),
      this.addPackageToProject('mocha', '^2.2.1'),
      this.addPackageToProject('mocha-only-detector', '0.0.2'),
      this.addPackageToProject('rimraf', '^2.4.3'),
    ]);
  }
};
