'use strict';

var expect             = require('chai').expect;
var BlueprintHelpers   = require('../../lib/helpers/blueprint-helper');
var setupTestHooks     = require('../../lib/helpers/setup');
var path               = require('path');
var generate           = BlueprintHelpers.generate;
var destroy            = BlueprintHelpers.destroy;
var generateAndDestroy = BlueprintHelpers.generateAndDestroy;
var getPackage         = BlueprintHelpers.getPackage;
var getPackageName     = BlueprintHelpers.getPackageName;
var getProjectRoot     = BlueprintHelpers.getProjectRoot;

describe('blueprint-helper', function() {
  setupTestHooks(this);
  describe('generate', function() {
    it('generates a blueprint', function() {
      return generate(['blueprint-test', 'foo'], {
        files: [
          {
            file: 'node-tests/blueprints/foo-test.js'
          }
        ]
      });
    });
  });

  describe('destroy', function() {
    it('destroys a blueprint', function() {
      return destroy(['blueprint-test', 'foo'], {
        files: [
          {
            file: 'node-tests/blueprints/foo-test.js',
            exists: false
          }
        ]
      });
    })
  });

  describe('generateAndDestroy', function() {
    it('generates and destroys a blueprint', function() {
      return generateAndDestroy(['blueprint-test', 'foo'], {
        files: [
          {
            file: 'node-tests/blueprints/foo-test.js'
          }
        ]
      });
    })
  });

  describe('getPackage', function() {
    it('gets the app package path', function() {
      var appPackage = getPackage('../../', 'app');
      expect(appPackage).to.contain('/node-tests/fixtures/app/package');
    });

    it('gets the addon package path', function() {
      var appPackage = getPackage('../../', 'addon');
      expect(appPackage).to.contain('/node-tests/fixtures/addon/package');
    });
  });

  describe('getPackageName', function() {
    it('gets package name', function() {
      var root = path.resolve(process.cwd(), '../../');
      var name = getPackageName(root);
      expect(name).to.equal('ember-cli-blueprint-test-helpers');
    });
  });

  describe('getProjectRoot', function() {
    it('finds the tmp root', function() {
      var expected = path.resolve(process.cwd(), '../../');
      var root = getProjectRoot(process.cwd());
      expect(root).to.equal(expected);
    });
  });

});