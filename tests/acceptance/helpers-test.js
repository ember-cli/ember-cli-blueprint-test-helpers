"use strict";
const setupTestHooks = require("../../lib/helpers/setup");

const blueprintHelpers = require("../../helpers");
const emberNew = blueprintHelpers.emberNew;
const emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

const chai = require("../../chai");
const expect = chai.expect;
const fs = require("fs");

describe("Acceptance: helpers", function() {
  setupTestHooks(this);

  describe("emberGenerateDestroy", () => {
    beforeEach(() => {
      return emberNew({ target: "addon", isModuleUnification: true }).then(
        () => {
          fs.readdir(".", (err, files) => {
            files.forEach(file => {
              console.log(file);
            });
          });
        }
      );
    });

    it("blueprint-test foo - in a MU app with MU flag", () => {
      return emberGenerateDestroy(
        ["blueprint-test", "foo"],
        file => {
          expect(file("node-tests/blueprints/foo-test.js")).to.contain(
            "return emberNew({ isModuleUnification: true })"
          );
        },
        { isModuleUnification: true }
      );
    });

    it("blueprint-test foo - in a MU app with MU flag", () => {
      return emberGenerateDestroy(
        ["blueprint-test", "foo"],
        file => {
          expect(file("node-tests/blueprints/foo-test.js")).to.contain(
            "return emberNew({ isModuleUnification: true })"
          );
        },
        { isModuleUnification: true }
      );
    });
  });
});
