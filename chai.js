'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiFiles = require('chai-files');

chai.use(chaiAsPromised);
chai.use(chaiFiles);

module.exports = chai;
module.exports.file = chaiFiles.file;
module.exports.dir = chaiFiles.dir;
