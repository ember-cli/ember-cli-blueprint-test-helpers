'use strict';

var glob = require('glob');
var Mocha = require('mocha');

var mocha = new Mocha({
  reporter: 'spec'
});

var arg = process.argv[2];
var root = 'tests/';

function addFiles(mocha, files) {
  glob.sync(files).forEach(mocha.addFile.bind(mocha));
}
addFiles(mocha, 'tests/**/*-nodetest.js');
addFiles(mocha, 'blueprints/**/*-nodetest.js');

if (arg === 'all') {
  addFiles(mocha, 'tests/**/*-nodetest-slow.js');
}

mocha.run(function(failures) {
  process.on('exit', function() {
    process.exit(failures);
  });
});
