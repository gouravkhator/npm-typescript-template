import "mocha/mocha";
import chai from "chai/chai";
import { getHostName, checkDirExists } from "../src";

const { assert } = chai;

suite("Test", () => {
  test(function hostname() {
    assert(typeof getHostName() === "string");
  });

  test(function direxists() {
    assert.equal(checkDirExists("/home/gourav/Music/"), true);
  });
});
