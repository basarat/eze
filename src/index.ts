import * as fse from 'fs-extra';
import { toHtml } from './core/markdown';
import { Data } from './types';
import { bundle } from './bundler/bundler';


export class Eze {

  constructor(private config: {
    outputDir: string,
    title?: string
  }) {
    this.config = { ...config };
    this.config.title = config.title || 'Docs'
  }

  /**
   * We collect the rendered contents here
   */
  private data: Data = {
    contents: []
  }

  md(markdown: string) {
    /** render the markdown */
    this.data.contents.push(toHtml(markdown));
    /** TODO: Collect heading in table of contents */
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