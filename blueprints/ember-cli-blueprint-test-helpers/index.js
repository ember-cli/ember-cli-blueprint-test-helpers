var Promise = require('ember-cli/lib/ext/promise');

module.exports = {
  description: 'Installs dependencies for ember-cli-blueprint-test-helpers',
  normalizeEntityName: function(){},
  afterInstall: function() {
    return Promise.all([
      this.insertIntoFile('./.npmignore', 'node-tests/'),
      this.addPackageToProject('mocha', '^2.2.1'),
    ]);
  }
};
