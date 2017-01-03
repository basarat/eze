import * as fse from 'fs-extra';
import { toHtml } from './core/markdown';

export class Eze {

  constructor(private config: {
    outputDir: string
  }) {

  }

  /**
   * We collect the rendered contents here
   */
  private contents = [];

  md(markdown: string) {
    /** render the markdown */
    this.contents.push(toHtml(markdown));
    /** TODO: Collect heading in table of contents */
  }

  /** Writes out the contents  */
  done() {
    const contents = this.contents.join('\n');
    /** TODO: write the html + js */
    fse.outputFileSync(this.config.outputDir + '/index.html', contents);
  }
}