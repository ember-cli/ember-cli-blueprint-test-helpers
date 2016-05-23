var Promise = require('ember-cli/lib/ext/promise');
var existsSync = require('exists-sync');
var path = require('path');

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
      this.addPackageToProject('mocha', '^2.2.1')
    ];
    if (options.babel) {
      afterInstallTasks.splice(0, 0,
        this.insertIntoFile('./node-tests/mocha.opts', '--require babel-register\n--recursive'),
        this.addPackagesToProject([
          {name: 'babel-plugin-transform-es2015-arrow-functions', target: '^6.5.2'},
          {name: 'babel-plugin-transform-es2015-shorthand-properties', target: '^6.5.0'},
          {name: 'babel-register', target: '^6.7.2'}
        ]));
      if (existsSync(path.resolve('./node-tests/.babelrc'))) {
        afterInstallTasks.splice(0, 0,this.insertIntoFile('./node-tests/.babelrc','\n\t\t"transform-es2015-arrow-functions",\n\t\t"transform-es2015-shorthand-properties"\n', {after: '"plugins": ['}));
      } else {
        afterInstallTasks.splice(0, 0, this.insertIntoFile('./node-tests/.babelrc','{\n\t"plugins": [\n\t\t"transform-es2015-arrow-functions",\n\t\t"transform-es2015-shorthand-properties"\n\t]\n}'));
      }
    }
    // console.log('ADDING TO BABEL', options);
    return Promise.all(afterInstallTasks);
  }
};
