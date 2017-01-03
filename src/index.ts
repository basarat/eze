import * as fse from 'fs-extra';
import { toHtml, dedent } from './internal/markdown';
import { Data } from './types';
import { bundle } from './internal/bundler';

export interface EzeConfig {
  outputDir: string,
  title?: string
}

export class Eze {

  constructor(private config: EzeConfig) {
    this.config = { ...config };
    this.config.title = config.title || 'Docs'
  }

  /**
   * We collect the rendered contents here
   */
  private data: Data = {
    contents: []
  }

  async md(markdown: string) {
    /** render the markdown */
    this.data.contents.push({ type: 'html', html: toHtml(dedent(markdown)) });
    /** TODO: Collect headings in table of contents */
  }

  /** Writes out the contents  */
  async done() {
    /**
     * DESIGN Notes:
     * We write out an 
     * - a data.js that contains our data object
     * - index.html file 
     * - an application `app.js` that loads uses data.js to render the application
     */

    /** Write out the data */
    const data = JSON.stringify(this.data);
    fse.outputFileSync(this.config.outputDir + '/data.js', `var data = ${data}`);

    /** Write the html + js */
    fse.outputFileSync(this.config.outputDir + '/index.html', fse.readFileSync(__dirname + '/app/index.html'));
    await bundle({ entryPointName: __dirname + '/app/app.tsx', outputFileName: this.config.outputDir + '/app.js' });
  }
}

export async function run(config: EzeConfig, cb: (eze: Eze) => Promise<void>) {
  const eze = new Eze(config);
  await cb(eze);
  eze.done();
}

