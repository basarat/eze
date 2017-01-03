import * as fse from 'fs-extra';
import { Data, Config } from './types';
import { bundle } from './internal/bundler';
import { Collector } from './internal/collector';

export async function run(config: Config, cb: (eze: Collector) => Promise<void>) {
  const eze = new Collector(config);
  await cb(eze);

  /**
    * DESIGN Notes:
    * We write out an 
    * - a data.js that contains our data object
    * - index.html file 
    * - an application `app.js` that loads uses data.js to render the application
    */

  /** Write out the data */
  const data = JSON.stringify(eze.data);
  fse.outputFileSync(config.outputDir + '/data.js', `var data = ${data}`);

  /** Write the html + js */
  fse.outputFileSync(
    config.outputDir + '/index.html',
    fse.readFileSync(__dirname + '/app/index.html').toString().replace('TitleHere', config.title || "Docs")
  );
  await bundle({ entryPointName: __dirname + '/app/app.tsx', outputFileName: config.outputDir + '/app.js' });
}

