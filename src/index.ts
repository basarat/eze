import * as fse from 'fs-extra';
export class Eze {

  constructor(private config: {
    outputDir: string
  }) {
    
  }

  /**
   * We collect the content here
   */
  private contents = [];

  md(markdown: string) {
    /** TODO: render the markdown */
    this.contents.push(markdown);
  }

  /** Writes out the contents  */
  done() {
    const contents = this.contents.join('\n');
    fse.outputFileSync(this.config.outputDir, contents);
  }
}