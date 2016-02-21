ember-cli-blueprint-test-helpers
================================

About
-----

ember-cli-blueprint-test-helpers contains several test helpers for testing blueprints.

Usage
-----

Install ember-cli-blueprint-test-helpers

Running Tests
-------------

To run the blueprint tests, run `node tests/nodetest-runner.js`.
For convenience and CI purposes you can add the following to your `package.json`:
```json
"scripts": {
  "nodetest": "node tests/nodetest-runner.js
}
```
Then you can use `npm run nodetest` to run.

Generating Blueprint Tests
--------------------------

Generate a blueprint test scaffold using the blueprint-test blueprint.
`ember g blueprint-test my-blueprint`

Unlike normal tests, the blueprint test will be generated inside the blueprint folder as:
```
  blueprints/my-blueprint/blueprint-nodetest.js
```
The minimum common setup is in the generated test, setup for generating and destroying a blueprint in one test.

Test Setup
----------

The `setupTestHooks` convenience method sets up a blueprint test with a timeout as well as before, after, beforeEach, and afterEach hooks:

```js
describe('Acceptance: ember generate', function() {
  // pass in test instance, and an optional options object.
  setupTestHooks(this, {timeout: 1000});
```

If you need to override or add to any of the hooks, you may pass a function in the options.
The options supported are:
* __timeout__ _(number)_: Duration before test times out.
* __tmpenv__ _(tmpenv object)_: Object containing info about the temporary directory for the test. Defaults to [`lib/helpers/tmp-env.js`](https://github.com/ember-cli/ember-cli-blueprint-test-helpers/blob/master/lib/helpers/tmp-env.js)
* __before__ _(function)_: Hook to execute code at the beginning of the before function.
* __after__ _(function)_: Hook to execute code at the beginning of the after function.
* __beforeEach__ _(function)_: Hook to execute code at the beginning of the beforeEach function.
* __afterEach__ _(function)_: Hook to execute code at the beginning of the afterEach function.

Generate and Destroy Test Helpers
---------------------------------

Use `generate`, `destroy`, or `generateAndDestroy` to run a test.

All three methods take the following signature:
commandArgs (array), options (object)

The commandArgs should contain any commandline properties and options that would be passed to a generate or destroy command.

The options should contain a files object, as well as any of the following options:
* __usePods__ _(boolean)_: Sets up `.ember-cli` file with `"usePods": true`. Default: false
* __podModulePrefix__ _(boolean)_: Sets up `config/environment.js` with 'app/pods' as the `podModulePrefix`. Default: false
* __target__ _(string)_: Defines the type of project to setup for the test. Recognized values: __'app'__, __'addon'__, __'inRepoAddon'__
* __files__ _(array)_: Array of files to assert, represented by objects with `file`, `exists`, `contains`, or `doesNotContain` properties. Example object: `{file: 'path-to-file', contains: ['file contents to compare'], doesNotContain: ['file contents that shouldn\'t be present'], exists: true}`
* __throws__ _(regexp / / or object)_: Expected error message or excerpt to assert. Optionally, can be an object containing a `message` and `type` property. The `type` is a string of the error name. Example RegExp: `/Expected error message text./` Example object: `{message: /Expected message/, type: 'SilentError'}`
* __beforeGenerate__ _(function)_: Hook to execute before generating blueprint. Can be used for additional setup and assertions.
* __afterGenerate__ _(function)_: Hook to execute after generating blueprint. Can be used for additional setup and assertions.
* __beforeDestroy__ _(function)_: Hook to execute before destroying blueprint. Can be used for additional setup and assertions.
* __afterDestroy__ _(function)_: Hook to execute before destroying blueprint. Can be used for additional teardown and assertions.

Example Tests
-------------

The following is a basic test, asserting `my-blueprint` generated the files in the `files` array and that their content matches, and then that the blueprint was destroyed and that the files in the `files` array were properly removed.

```js
var setupTestHooks     = require('ember-cli-blueprint-test-helpers/lib/helpers/setup');
var BlueprintHelpers   = require('ember-cli-blueprint-test-helpers/lib/helpers/blueprint-helper');
var generateAndDestroy = BlueprintHelpers.generateAndDestroy;

describe('Acceptance: ember generate and destroy blueprint', function() {
  setupTestHooks(this);

  it('blueprint test', function() {
    return generateAndDestroy(['my-blueprint', 'foo'], {
      files: [
        {
          file: 'path/to/file.js',
          contains: [
            'file contents to match',
            'more file contents\n'
          ]
        }
      ]
    });
  });
```

To assert that an error is thrown when incorrect input is used, you can use the `throws` option. The throws option simply requires a regex of the full or partial error message.

```js
it('adapter application cannot extend from --base-class=application', function() {
  return generateAndDestroy(['adapter', 'application', '--base-class=application'], {
    throws: /Adapters cannot extend from themself/
  });
});
```

You can also pass an object containing the message and error type.

```js
it('adapter application cannot extend from --base-class=application', function() {
  return generateAndDestroy(['adapter', 'application', '--base-class=application'], {
    throws: { 
      message: /Adapters cannot extend from themself/,
      type: 'SilentError'
    }
  });
});
```

To generate another blueprint beforehand, you can use the `afterGenerate` hook to do your actual assertions, like in the example below

```js
it('adapter extends from application adapter if present', function() {
  return generateAndDestroy(['adapter', 'application'], {
    afterGenerate: function() {
      return generateAndDestroy(['adapter', 'foo'], {
        files: [
          {
            file:'app/adapters/foo.js',
            contains: [
              "import ApplicationAdapter from './application';"
            ]
          }
        ]
      });
    }
  });
});
```

To setup a test project with a `podModulePrefix` or `usePods` setting, use the following options:

```js
it('blueprint test', function() {
  return generateAndDestroy(['my-blueprint', 'foo'], {
    usePods: true,
    podModulePrefix: true
  });
});
```

To test generating into addons, in-repo-addons, and dummy projects, you can use the `target` option:

```js
it('blueprint test', function() {
  return generateAndDestroy(['my-blueprint', 'foo'], {
    // supported options are 'app', 'addon', and 'inRepoAddon'
    target: 'addon'
  });
});
```
