
ember-cli-blueprint-test-helpers
==============================================================================

[![Build Status](https://travis-ci.org/ember-cli/ember-cli-blueprint-test-helpers.svg?branch=master)](https://travis-ci.org/ember-cli/ember-cli-blueprint-test-helpers)
[![Build status](https://ci.appveyor.com/api/projects/status/github/ember-cli/ember-cli-blueprint-test-helpers?svg=true)](https://ci.appveyor.com/project/embercli/ember-cli-blueprint-test-helpers/branch/master)

test helpers for [ember-cli](https://github.com/ember-cli/ember-cli) blueprints


Installation
------------------------------------------------------------------------------

Install the helpers via npm:

```
npm install --save-dev ember-cli-blueprint-test-helpers
```

Run the following command to generate the test runner:

```
ember generate ember-cli-blueprint-test-helpers
```

If you are using `ember-cli-blueprint-test-helpers` on Node v4.x or lower, you'll want to use the `--babel` option, to add ES6 support.
```
ember generate ember-cli-blueprint-test-helpers --babel
```

It should be noted that `ember-cli-blueprint-test-helpers` currently [only works for testing blueprints inside addon projects](https://github.com/ember-cli/ember-cli-blueprint-test-helpers/issues/56).

Usage
------------------------------------------------------------------------------

### Running Tests

The blueprint tests can be run by:

```
node_modules/.bin/mocha node-tests --recursive
```

For convenience you should add the following to your `package.json`:

```json
"scripts": {
  "nodetest": "mocha node-tests --recursive"
}
```

to be able to use `npm run nodetest` to run the tests.


### Generating Tests

Generate a blueprint test scaffold using the `blueprint-test` generator:

```
ember generate blueprint-test my-blueprint
```

which will generate a test file at `node-tests/blueprints/my-blueprint-test.js`.


### Example Usage

```js
describe('Acceptance: ember generate and destroy my-blueprint', function() {
  // create and destroy temporary working directories
  setupTestHooks(this);

  it('my-blueprint foo', function() {
    var args = ['my-blueprint', 'foo'];

    // create a new Ember.js app in the working directory
    return emberNew()

      // then generate and destroy the `my-blueprint` blueprint called `foo`
      .then(() => emberGenerateDestroy(args, (file) => {

        // and run some assertions in between
        expect(file('path/to/file.js'))
          .to.contain('file contents to match')
          .to.contain('more file contents\n');
      }));

     // magically done for you: assert that the generated files are destroyed again
  });
});
```

or more explicitly:

```js
describe('Acceptance: ember generate and destroy my-blueprint', function() {
  // create and destroy temporary working directories
  setupTestHooks(this);

  it('my-blueprint foo', function() {
    var args = ['my-blueprint', 'foo'];

    // create a new Ember.js app in the working directory
    return emberNew()

      // then generate the `my-blueprint` blueprint called `foo`
      .then(() => emberGenerate(args))

      // then assert that the files were generated correctly
      .then(() => expect(file('path/to/file.js'))
        .to.contain('file contents to match')
        .to.contain('more file contents\n'))

      // then destroy the `my-blueprint` blueprint called `foo`
      .then(() => emberDestroy(args))

      // then assert that the files were destroyed correctly
      .then(() => expect(file('path/to/file.js')).to.not.exist);
  });
});
```

API Reference
------------------------------------------------------------------------------

This project exports two major API endpoints for you to use:

- `require('ember-cli-blueprint-test-helpers/chai')`

  This endpoint exports the [Chai](http://chaijs.com/) assertion library
  including the [chai-as-promised](https://github.com/domenic/chai-as-promised)
  and [chai-files](https://github.com/Turbo87/chai-files) plugins

- `require('ember-cli-blueprint-test-helpers/helpers')`

  This endpoint exports the functions mentioned in the following API reference

---

### `setupTestHooks(scope, options)`

Prepare the test context for the blueprint tests.

**Parameters:**

- `{Object} scope` the test context (i.e. `this`)
- `{Object} [options]` optional parameters
- `{Number} [options.timeout=20000]` the test timeout in milliseconds
- `{Object} [options.tmpenv]` object containing info about the temporary directory for the test.
- `{String} [options.cliPath='ember-cli']` path to the `ember-cli` dependency
  Defaults to [`lib/helpers/tmp-env.js`](lib/helpers/tmp-env.js)

**Returns:** `{Promise}`

---

### `emberNew(options)`

Create a new Ember.js app or addon in the current working directory.

**Parameters:**

- `{Object} [options]` optional parameters
- `{String} [options.target='app']` the type of project to create (`app`, `addon` or `in-repo-addon`)

**Returns:** `{Promise}`

---

### `emberGenerate(args)`

Run a blueprint generator.

**Parameters:**

- `{Array.<String>} args` arguments to pass to `ember generate` (e.g. `['my-blueprint', 'foo']`)

**Returns:** `{Promise}`

---

### `emberDestroy(args)`

Run a blueprint destructor.

**Parameters:**

- `{Array.<String>} args` arguments to pass to `ember destroy` (e.g. `['my-blueprint', 'foo']`)

**Returns:** `{Promise}`

---

### `emberGenerateDestroy(args, assertionCallback)`

Run a blueprint generator and the corresponding blueprint destructor while
checking assertions in between.

**Parameters:**

- `{Array.<String>} args` arguments to pass to `ember generate` (e.g. `['my-blueprint', 'foo']`)
- `{Function} assertionCallback` the callback function in which the assertions should happen

**Returns:** `{Promise}`

---

### `modifyPackages(packages)`

Modify the dependencies in the `package.json` file of the test project.

**Parameters:**

- `{Array.<Object>} packages` the list of packages that should be added,
  changed or removed

---

### `setupPodConfig(options)`

Setup `usePods` in `.ember-cli` and/or `podModulePrefix` in `environment.js`.

**Parameters:**

- `{Object} [options]` optional parameters
- `{Boolean} [options.usePods]` add `usePods` in `.ember-cli`
- `{Boolean} [options.podModulePrefix]` set `npodModulePrefix` to `app/pods`
  in `config/environment.js`


Used by
------------------------------------------------------------------------------

- https://github.com/emberjs/ember.js
- https://github.com/emberjs/data
- https://github.com/ember-cli/ember-cli-legacy-blueprints
- https://github.com/simplabs/ember-simple-auth
- https://github.com/DockYard/ember-suave


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
