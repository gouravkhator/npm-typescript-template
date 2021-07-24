/*
import { promises as fsp } from "fs";
import { terser } from "rollup-plugin-terser";
import globals from "rollup-plugin-node-globals";
import builtins from "rollup-plugin-node-builtins";
import browserify from "browserify";
import { default as os } from "os";
import { default as fs } from "fs";
import mochaRunner from "./lib/mocha-runner.mjs";
*/

import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import execute from "rollup-plugin-execute";

import del from "del";

import tscRunner from "./lib/tsc-runner.mjs";

export default async function ({ watch }) {
  await del("build");

  const builds = [];

  // Generic builds for all modes
  builds.push({
    plugins: [
      tscRunner("src", { watch }),
      nodeResolve({
        moduleDirectories: ["node_modules"],
        // the nodeResolve will look into node_modules folder recursively as specified above, to locate modules imported in the file and bundle them in our built file.
      }),
      commonjs(),
    ],
    input: ["src/index.ts"],
    output: [
      {
        dir: "build/esm/",
        format: "esm",
        entryFileNames: "[name].mjs",
        chunkFileNames: "[name].mjs",
      },
      {
        dir: "build/cjs/",
        format: "cjs",
        entryFileNames: "[name].cjs",
        chunkFileNames: "[name].cjs",
      },
    ],
    // external is only required when we don't want to bundle those packages in our built file.
  });

  // Minified iife
  /*builds.push({
    input: "build/esm/index.mjs",
    plugins: [
      nodeResolve({
        // pass custom options to the resolve plugin
        moduleDirectories: ["node_modules"],
        browser: true,
      }),
      commonjs(),
      globals(),
      builtins(),
      {
        // async writeBundle() {
        //   console.log("modifying bundle after its created started");
        //   let browserifyObj = browserify();
        //   browserifyObj.add("build/iife/index-min.js");
        //   browserifyObj.bundle(async (err, src) => {
        //     if (err) console.log(err);
        //     await fsp.writeFile("build/iife/index-min-browser.js", src);
        //   });
        // },
      },
      terser({
        compress: { ecma: 2019 },
      }),
    ],
    output: {
      file: "build/iife/index-min.js",
      format: "iife",
      esModule: false,
      name: "mypack",
      globals: {
        'os': os,
        'fs': fs,
      }
    },
    external: ["os", "fs"]
  });*/

  // Tests
  if (!process.env.PRODUCTION) {
    // development mode
    builds.push({
      plugins: [
        tscRunner("test", { watch }),
        nodeResolve({
          moduleDirectories: ["node_modules"],
          preferBuiltins: true,
        }),
        commonjs(),

        // this execute plugin runs after the bundle has been copied to rollup output path
        // executes the shell test commands to test and save reports in markdown format
        execute('npm run generate-test-report'),
      ],
      input: ["test/index.spec.ts"],
      output: {
        dir: "build/test",
        format: "esm",
      },
    });
  }

  return builds;
}
