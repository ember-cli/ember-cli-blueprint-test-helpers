var chai           = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

module.exports = chai.assert;

//TODO: Remove this after assertions have been extracted to separate library