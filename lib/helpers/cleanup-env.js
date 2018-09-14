'use strict';

function cleanupENV() {
  delete process.env["EMBER_CLI_MODULE_UNIFICATION"];
}

module.exports = cleanupENV;
