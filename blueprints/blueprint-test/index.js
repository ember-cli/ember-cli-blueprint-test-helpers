'use strict';

module.exports = {
  fileMapTokens() {
    return {
      __root__(/* options */) {
        return 'node-tests/blueprints';
      },
      __name__(options) {
        return options.locals.blueprintName;
      }
    }
  },

  locals(options) {
    const blueprintName = options.entity.name;
    const muOption =
      (options.project.isModuleUnification())
        ? '{ isModuleUnification: true }'
        : null;

    return { blueprintName, muOption };
  }
}
