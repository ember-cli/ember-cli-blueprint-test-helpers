ember-cli-blueprint-test-helpers
================================

About
-----

ember-cli-blueprint-test-helpers contains several test helpers for testing blueprints.

Usage
-----

Install ember-cli-blueprint-test-helpers


Generate a blueprint test scaffold, which will also install `ember-cli-blueprint-test-helpers`:
`ember g blueprint-test my-blueprint`

Setup a blueprint test with a timeout as well as before, after, beforeEach, and afterEach hooks:
```
describe('Acceptance: ember generate', function() {
  // pass in test instance, and timeout duration (default 20000), and the tmp environment
  setupTestHooks(this, 20000, tmpenv);
  
```

Use `generate`, `destroy`, or `generateAndDestroy` to run a test.

All three methods take the following signature:
commandArgs (array), options (object)

The commandArgs should contain any commandline properties and options that would be passed to a generate or destroy command.

The options should contain a files object, as well as any of the following options:
* __usePods__ _(boolean)_: Sets up `.ember-cli` file with `"usePods": true`. Default: false
* __podModulePrefix__ _(boolean)_: Sets up `config/environment.js` with 'app/pods' as the `podModulePrefix`. Default: false
* __target__ _(string)_: Defines the type of project to setup for the test. Recognized values: __'app'__, __'addon'__, __'inRepoAddon'__
* __files__ _(array)_: Array of files to assert, represented by objects with `file` and `contains` properties. Example object: `{file: 'path-to-file', contains: ['file contents to compare']}`
* __throws__ _(regex / /)_: Expected error message or excerpt to assert. Example: `/Expected error message text./`
* __beforeGenerate__ _(function)_: Hook to execute before generating blueprint. Can be used for additional setup and assertions.
* __afterGenerate__ _(function)_: Hook to execute after generating blueprint. Can be used for additional setup and assertions.
* __beforeDestroy__ _(function)_: Hook to execute before destroying blueprint. Can be used for additional setup and assertions.
* __afterDestroy__ _(function)_: Hook to execute before destroying blueprint. Can be used for additional teardown and assertions.

```
var EOL                = require('os').EOL;
var tmpenv             = require('ember-cli-blueprint-test-helpers/lib/helpers/tmp-env');
var setupTestHooks     = require('ember-cli-blueprint-test-helpers/lib/helpers/setup');
var BlueprintHelpers   = require('ember-cli-blueprint-test-helpers/lib/helpers/blueprint-helper');
var generateAndDestroy = BlueprintHelpers.generateAndDestroy;

describe('Acceptance: ember generate and destroy blueprint', function() {
  setupTestHooks(this, 20000, tmpenv);

  it('blueprint test', function() {
    return generateAndDestroy(['my-blueprint', 'foo'], {
      files: [
        {
          file: 'path/to/file.js',
          contains: [
            'file contents to match',
            'more file contents' + EOL
          ]
        }
      ]
    });
  });
```
Use EOL for line breaks, as it provides cross platform support.

To assert that an error is thrown when incorrect input is used, you can use the `throws` option. The throws option simply requires a regex of the full or partial error message.
```
it('adapter application cannot extend from --base-class=application', function() {
  return generateAndDestroy(['adapter', 'application', '--base-class=application'], {
    throws: /Adapters cannot extend from themself/
  });
});
```

To generate another blueprint beforehand, you can use the `afterGenerate` hook to do your actual assertions, like in the example below
```
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