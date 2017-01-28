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
  entryMap: { [key: string]: string },
  outputDirName: string,
}) {
  if (Object.keys(args.entryMap).map(key => args.entryMap[key]).some(e => !fse.existsSync(e))) {
    /** Webpack ignores this siliently sadly so we need to catch it ourselves */
    const error = `At least one entry point does not exist`;
    console.error(error, args.entryMap);
    return Promise.reject(new Error(error));
  }
  return bundleCmd(args);
}