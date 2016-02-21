module.exports = {
  fileMapTokens: function() {
    return {
      __root__: function(/* options */) {
        return 'node-tests/blueprints';
      },
      __name__: function(options) {
        return options.locals.blueprintName;
      }
    };
  },

  locals: function(options) {
    return {
      blueprintName: options.entity.name
    };
  }

};
