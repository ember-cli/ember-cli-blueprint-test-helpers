'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Modify the dependencies in the `package.json` file of the test project.
 *
 * @param {Array.<Object>} packages the list of packages that should be added,
 * changed or removed
 */
module.exports = function(packages) {
  let packagePath = path.resolve(process.cwd(), 'package.json');

  let contents  = JSON.parse(fs.readFileSync(packagePath, { encoding: 'utf8' }));
  contents.dependencies = contents.dependencies || {};
  contents.devDependencies = contents.devDependencies || {};

  packages.forEach((pkg) => {
    if (pkg.delete) {
      delete contents.dependencies[pkg.name];
      delete contents.devDependencies[pkg.name];
    } else {
      let dependencies = pkg.dev ? contents.devDependencies : contents.dependencies;
      dependencies[pkg.name] = pkg.version || '*';
    }
  });

  fs.writeFileSync(packagePath, JSON.stringify(contents, null, 2));
};
