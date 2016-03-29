var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var chaiFiles = require('chai-files');

chai.use(chaiAsPromised);
chai.use(chaiFiles);

module.exports = chai;
module.exports.file = chaiFiles.file;
