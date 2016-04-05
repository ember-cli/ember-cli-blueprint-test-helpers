module.exports = {
  setupTestHooks: require('./lib/helpers/setup'),
  emberNew: require('./lib/ember-new'),
  emberGenerate: require('./lib/ember-generate'),
  emberDestroy: require('./lib/ember-destroy'),
  emberGenerateDestroy: require('./lib/ember-generate-destroy'),
  modifyPackages: require('./lib/modify-packages'),
  setupPodConfig: require('./lib/setup-pod-config'),
};
