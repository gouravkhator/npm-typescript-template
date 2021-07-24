import "mocha/mocha";
import chai from 'chai/chai';
import { getHostName, checkDirExists } from "../src/index";

const { assert } = chai;

describe("App function", function () {
  it("should return hostname", function () {    
    assert.equal(getHostName(), "gourav-HP");
  });

  it("should check directory exists or not", function () {  
    assert.equal(checkDirExists("/home/gourav/Desktop/"), true);
  });
});
