module.exports = {
  fileMapTokens() {
    return {
      __root__(/* options */) {
        return 'node-tests/blueprints';
      },
      __name__(options) {
        return options.locals.blueprintName;
      }
    };
  },

  locals(options) {
    return {
      blueprintName: options.entity.name
    };
  }

};
