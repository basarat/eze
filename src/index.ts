import * as fse from 'fs-extra';
import { toHtml } from './core/markdown';
import { Data } from './types';
import { bundle } from './bundler/bundler';

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
    this.data.contents.push({ type: 'html', html: toHtml(markdown) });
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

/**
 * Dedent template strings. Great for markdown authoring
 * https://github.com/dmnd/dedent/blob/master/dedent.js
 */
export function dedent(strings, ...values) {

  let raw;
  if (typeof strings === "string") {
    // dedent can be used as a plain function
    raw = [strings];
  } else {
    raw = strings.raw;
  }

  // first, perform interpolation
  let result = "";
  for (let i = 0; i < raw.length; i++) {
    result += raw[i].
      // join lines when there is a suppressed newline
      replace(/\\\n[ \t]*/g, "").

      // handle escaped backticks
      replace(/\\`/g, "`");

    if (i < values.length) {
      result += values[i];
    }
  }

  // dedent eats leading and trailing whitespace too
  result = result.trim();

  // now strip indentation
  const lines = result.split("\n");
  let mindent = null;
  lines.forEach(l => {
    let m = l.match(/^ +/);
    if (m) {
      let indent = m[0].length;
      if (!mindent) {
        // this is the first indented line
        mindent = indent;
      } else {
        mindent = Math.min(mindent, indent);
      }
    }
  });

  if (mindent !== null) {
    result = lines.map(l => l[0] === " " ? l.slice(mindent) : l).join("\n");
  }

  // handle escaped newlines at the end to ensure they don't get stripped too
  return result.replace(/\\n/g, "\n");
}