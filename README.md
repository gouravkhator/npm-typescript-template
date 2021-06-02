# Alacritty Auto Config

This is a template for developing, building, testing with Mocha, bundling with Rollup, and publishing to NPM and Github with an automatic workflow.

## NPM Package

### Install the npm package

Install the package globally:

```sh
npm install -g packagename
```

**Note: Run the above command with sudo if you are on mac or linux**

Install the package locally:

```sh
npm install packagename
```

### Run the package in CLI

For global install:

```sh
packagename [options]=[values]
```

For local install, just run the above commands on terminal with npx prefix.

Ex-

```sh
npx packagename [options]=[values]
```

- Show Help:

```sh
packagename -h
```

Or,

```sh
packagename --help
```

- Options:

```sh

```

## Project Scripts

### Install and Build the project

```sh
npm install
npm run build
```

### Generate executables

```sh
npm run bin
```

**The bin script will generate the binary files for each major OS platforms.**

### Run the development watch mode

```sh
npm run dev
```

## Project CLI Version

### All bundles

- `build/cjs/index.js` CommonJS module.
- `build/esm/index.js` EcmaScript module.
- `build/iife/index-min.js` Minified EcmaScript module.
  <!-- - `build/cjs-compat/index.js` CommonJS module, transpiled for older browsers. -->
  <!-- - `build/bundle.esm-compact.mjs` EcmaScript module, transpiled for older browsers. -->
  <!-- - `build/bundle.iife.min.js` Minified plain JS. -->
  <!-- - `build/bundle.iife-compact.js` As above, but transpiled for older browsers. -->