var Promise = require('ember-cli/lib/ext/promise');

module.exports = {
  fileMapTokens: function() {
    return {
      __root__: function(options) {
        return 'blueprints';
      },
      __name__: function(options) {
        return options.locals.blueprintName;
      }
    };
  },
  
  afterInstall: function() {
    return Promise.all([
      this.addPackageToProject('ember-cli-blueprint-test-helpers', '^1.0.0'),
      this.addPackageToProject('glob', '5.0.13'),
      this.addPackageToProject('mocha', '^2.2.1')
    ]);
  },
  
  locals: function(options) {
    return {
      blueprintName: options.entity.name
    };
  }
  
};