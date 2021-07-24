# The Flow of Build and Dev Modes using rollup and tsc

## File Structures

First rollup has input file as `/src/index.ts` file.

A runner util is present:
* tscRunner:
  * 1st argument is a string, telling which folder's tsconfig.json to look for.
  * 2nd argument is an object, saying watch mode (or or off as per the rollup was run by user), and noBuild mode.

## Generic Mode: Initial Setup for all modes

### Plugins In `/lib/` folder

* tscRunner("src", { watch }) means the tscRunner will load `/src/tsconfig.json` file. This json file extends configs from `/generic-tsconfig.json` which contains outDir. The tscRunner will check outDir name which is `/.ts-tmp/` folder.

If watch mode is given, tscRunner appends --watch to tsc command. If noBuild is unset, means it should build. tscRunner will append -b to tsc command.

The rollup input, this plugin is working for, is `/src/index.ts` file. tscRunner will take the base name index from the filename and will compile it to .js file. tscRunner will also create declaration files for this index.ts file.

* Next plugin applied is nodeResolve which will look into node_modules folder recursively, as given in plugin's options. This locates modules in `/node_modules/` folder, which have been imported in the compiled js file in `/.ts-tmp/` folder and bundles them in that js file.

* Next plugin is commonjs which resolves node modules which have been imported in our javascript files, similar to nodeResolve plugin. It will look for legacy modules for commonjs files (if node es modules were not found for a package in node_modules folder).

### Outputs of Generic Mode

The built files with bundled imported modules, are copied to rollup output file path in rollup output formats.

_Hurray! The builds are done._

## Build Mode

User runs:

```sh
PRODUCTION=1 rollup -c
```

Here, PRODUCTION env variable is set, but watch flag is not set. All builds are performed in generic mode and no more builds required in production mode.

## Dev Mode

User runs :

```sh
rollup -c --watch
```

Here, PRODUCTION env variable is not set, but watch flag is set.

Rollup does all the generic mode parts. Rollup input files for dev mode is `/test/index.spec.ts` file. First tscRunnner plugin will convert this ts file to js file, and copy all declarations and maps for that to `/.ts-tmp/test/` folder. This is because, `/test/tsconfig.json` file will be loaded for tsc configurations. This plugin is run with watch mode, given as per user choice.

The nodeResolve and commonjs plugins are used for this test file also, to resolve any node_modules es module or commonjs files, and bundle them in the built file.

The built file is copied to rollup output which is `/build/test/` folder. After the built file is copied, the plugin `execute` runs the `npm run test` command. This command runs mocha tests on `/build/test/` folder and copies the test reports to a markdown file `/build/test/test-reports.md`

The dev mode always runs in watch mode. So it watches all typescript files in `/src/` and `/test/` folders. It also watches `/rollup.config.js` file which is the rollup configuration.

## Test Mode

This mode means to compile builds, and test files and run mocha test without watching test ts files. This mode means Dev mode without watch.

```sh
rollup -c
```

## Summary

In build mode, src ts files are compiled to js files and copied in the `/.ts-tmp/src/` folder. Then, src's index.js file, compiled from .ts file, is copied with declaration files to `/build/` folder to the given respective formats.

In dev mode, generic mode is applied (same as build mode). After that, the test files are compiled to `/.ts-tmp/test/` folder and then bundled into `/build/test/` folder, which contains test files and browser mocha test reports in markdown format.
