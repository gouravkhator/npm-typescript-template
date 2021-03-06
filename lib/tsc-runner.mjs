import { spawn } from "child_process";
import { relative, join, parse } from "path";
import { promises as fsp } from "fs";
import { promisify } from "util";

import ts from "typescript";
import glob from "glob";

const globP = promisify(glob);

const extRe = /\.tsx?$/;

/**
 * Loads Typescript config
 * @param mainPath The folder from which tsconfig.json is to be loaded  
 * @returns A tsconfig in json format
 */
function loadConfig(mainPath) {
  const fileName = ts.findConfigFile(mainPath, ts.sys.fileExists);
  if (!fileName) throw Error("tsconfig not found");
  const text = ts.sys.readFile(fileName);
  const loadedConfig = ts.parseConfigFileTextToJson(fileName, text).config;
  const parsedTsConfig = ts.parseJsonConfigFileContent(
    loadedConfig,
    ts.sys,
    process.cwd(),
    undefined,
    fileName,
  );
  return parsedTsConfig;
}

/**
 * Tsc Runner Rollup Plugin
 * @param mainPath The folder name in project root containing tsconfig.json whose tsconfig is to be loaded.
 * @param param1: {noBuild, watch} An object having watch and noBuild modes 
 * @returns An object having rollup plugin returnable methods like load, resolveId, etc.
 */
export default function tscRunner(mainPath, { noBuild, watch } = {}) {
  const config = loadConfig(mainPath);
  const args = ["-b", mainPath];

  let done = Promise.resolve();

  if (!noBuild) {
    done = new Promise((resolve) => {
      const proc = spawn("tsc", args, {
        stdio: "inherit",
      });

      proc.on("exit", (code) => {
        if (code !== 0) {
          throw Error("TypeScript build failed");
        }
        resolve();
      });
    });
  }

  if (!noBuild && watch) {
    done.then(() => {
      spawn("tsc", [...args, "--watch", "--preserveWatchOutput"], {
        stdio: "inherit",
      });
    });
  }

  return {
    name: "simple-ts",
    async buildStart() {
      await done;
      const matches = await globP(config.options.outDir + "/**/*.js");
      for (const match of matches) this.addWatchFile(match);
    },
    resolveId(id, importer) {
      // If there is no importer, it means this plugin is 1st plugin being applied,
      // so we don't need to resolve the files relative to something.
      if (!importer) return null;

      const tsResolve = ts.resolveModuleName(
        id,
        importer,
        config.options,
        ts.sys,
      );

      if (
        // It didn't find anything
        !tsResolve.resolvedModule ||
        // Or if it's linking to a definition file, it's something in node_modules,
        // or something local like css.d.ts
        tsResolve.resolvedModule.extension === ".d.ts"
      ) {
        return null;
      }
      return tsResolve.resolvedModule.resolvedFileName;
    },
    async load(id) {
      if (!extRe.test(id)) return null;

      // Look for the JS equivalent in the tmp folder
      const basePath = join(
        config.options.outDir,
        relative(process.cwd(), id),
      ).replace(extRe, "");

      // id will be the passed input file
      // config.options.outDir will be tsconfig.json in the mainPath that is /src folder.
      // basePath + .js will be <projectDirPath>/.ts-tmp/src/index.js

      const srcP = fsp.readFile(basePath + ".js", { encoding: "utf8" });

      // Also copy maps and definitions
      const assetExtensions = [".d.ts", ".js.map", ".d.ts.map"];

      await Promise.all(
        assetExtensions.map(async (extension) => {
          const fileName = basePath + extension;
          const source = await fsp.readFile(fileName);
          this.emitFile({
            type: "asset",
            source,
            fileName: parse(fileName).base,
          });
        }),
      );

      return srcP;
    },
  };
}
