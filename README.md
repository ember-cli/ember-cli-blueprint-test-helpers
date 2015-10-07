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
  // pass in test instance, and timeout duration (default 20000)
  setupTestHooks(this, 20000);
  
```

Use `generate`, `destroy`, or `generateAndDestroy` to run a test.

All three methods take the following signature:
commandArgs (array), options (object)

The commandArgs should contain any commandline properties and options that would be passed to a generate or destroy command.

The options should contain a files object, as well as any of the following options:
* usePods (boolean),
* podModulePrefix (string)
* target (string) ('app', 'addon', 'inRepoAddon')
* files (array) (object: {file (string): 'path-to-file', contains (array): ['file contents to compare']})

```
var BlueprintHelpers   = require('ember-cli-blueprint-test-helpers/lib/helpers/blueprint-helper');
var generateAndDestroy = BlueprintHelpers.generateAndDestroy
...

  it('blueprint test', function() {
    return generateAndDestroy(['my-blueprint', 'foo'], {
      files: [
        {
          file: 'path/to/file.js',
          contents: [
            'file contents to match',
            'more file contents' + EOL
          ]
        }
      ]
    });
  });
```
Use EOL for line breaks, as it provides cross platform 