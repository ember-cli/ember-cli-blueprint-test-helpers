'use strict';

/**
  Enable Module Unification blueprints
  (set EMBER_CLI_MODULE_UNIFICATION to true).
  It returns EMBER_CLI_MODULE_UNIFICATION original value.

  @method enableModuleUnification
  @param {Boolean} [isMU] is module unification blueprint
  @returns {String}
*/
function enableModuleUnification(isMU) {
  let originalENV = process.env['EMBER_CLI_MODULE_UNIFICATION'];

  if (isMU) {
    process.env['EMBER_CLI_MODULE_UNIFICATION'] = true;
  }

  return originalENV;
}

/**
  Restore original EMBER_CLI_MODULE_UNIFICATION env var.

  @method disableModuleUnification
  @param {String} [originalENV] original EMBER_CLI_MODULE_UNIFICATION value
*/
function disableModuleUnification(originalENV) {
  if (originalENV) {
    process.env['EMBER_CLI_MODULE_UNIFICATION'] = originalENV;
  } else {
    delete process.env['EMBER_CLI_MODULE_UNIFICATION'];
  }
}

module.exports = { enableModuleUnification, disableModuleUnification };
