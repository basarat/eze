/**
 * @module Runs the bundler
 */
import * as webpack from 'webpack';
import * as fse from 'fs-extra';
import * as cp from 'child_process';
import * as ts from 'typescript';

let compiledOnceInThisRun = false;

/** Main utility function to execute a command */
let bundleCmd = (args): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cwd = __dirname;

    /** Create child.js for dev */
    if (fse.existsSync(`${__dirname}/child.ts`) && !compiledOnceInThisRun) {
      fse.writeFileSync(`${__dirname}/child.js`, ts.transpile(fse.readFileSync(`${__dirname}/child.ts`).toString()));
      compiledOnceInThisRun = true;
    }

    cp.execFile(process.execPath, [`${__dirname}/child.js`, JSON.stringify(args)], { cwd: cwd }, (err, stdout, stderr) => {
      if (stderr.toString().trim().length) {
        return reject(stderr.toString());
      }
      return resolve(stdout);
    });
  });
}

/**
 * Creates a webpack bundle
 */
export function bundle(args: {
  entryPointName: string,
  outputFileName: string,
  prod: boolean
}) {
  return bundleCmd(args);
}