var fs = require('fs');
var path = require('path');

module.exports = function(packages) {
  var packagePath = path.resolve(process.cwd(), 'package.json');

  var contents  = JSON.parse(fs.readFileSync(packagePath, { encoding: 'utf8' }));
  contents.dependencies = contents.dependencies || {};
  contents.devDependencies = contents.devDependencies || {};

  packages.forEach(function(pkg) {
    if (pkg.delete) {
      delete contents.dependencies[pkg.name];
      delete contents.devDependencies[pkg.name];
    } else {
      var dependencies = pkg.dev ? contents.devDependencies : contents.dependencies;
      dependencies[pkg.name] = pkg.version || '*';
    }
  });

  fs.writeFileSync(packagePath, JSON.stringify(contents, null, 2));
};
