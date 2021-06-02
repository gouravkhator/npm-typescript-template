import "mocha/mocha";
import chai from "chai/chai";
import { getHostName } from "../src";

const { assert } = chai;

suite("Test", () => {
  test(() => {
    assert(getHostName() === "gourav-hp");
  });
});
