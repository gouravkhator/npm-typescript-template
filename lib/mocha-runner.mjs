import { spawn } from "child_process";
import { relative, join } from "path";
import { promises as fsp } from "fs";

export default async function mochaRunner() {
  let done = Promise.resolve();

  let extRe = /\.js$/;

  done = new Promise((resolve) => {
    const proc = spawn("mocha --reporter=list build/test/ > build/test/test-reports.md", [], {
      stdio: "inherit",
    });

    proc.on('error', (code)=>{
      console.log(code);
    });

    proc.on("exit", (code) => {
      if (code !== 0) {
        throw Error("Mocha run failed");
      }
      resolve();
    });
  });

  return {
    name: "mocha-runner",
    async load(id) {
      // id will be test/index.spec.js
      if (!extRe.test(id)) return null;
      const basePath = join(
        ".ts-tmp",
        relative(process.cwd(), id),
      ).replace(extRe, "");

      // id will be the passed input file
      // basePath + .js will be <projectDirPath>/.ts-tmp/test/index.spec.js

      const testP = fsp.readFile(basePath + ".js", { encoding: "utf8" });

      const assetExtensions = [".d.ts", ".js.map", ".d.ts.map"];

      await Promise.all(
        // for mocha reporting
        done,

        // for copying maps and declarations
        ...assetExtensions.map(async (extension) => {
          const fileName = basePath + extension;
          const source = await fsp.readFile(fileName);
          this.emitFile({
            type: "asset",
            source,
            fileName: parse(fileName).base,
          });
        }),
      );

      return testP;
    },
  };
}
