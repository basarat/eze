import * as fse from 'fs-extra';
import { toHtml } from './core/markdown';
import * as typestyle from 'typestyle';
import * as csstips from 'csstips';

/** Normalize and page setup */
csstips.normalize();
csstips.setupPage('#root');

/**
 * Our main index.html
 */
const indexTemplate = ({title, body, css }: {title: string, body: string, css: string }) => `
<!DOCTYPE html>
<html>
<head>
    <!-- Standard Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <!-- Site Properties -->
    <title>${title}</title>

    <style>
      ${css}
    </style>
</head>

<body>
  <div id="root">
    <!-- TODO: Table on contents -->

    <!-- The remaining html -->
    ${body}
  </div>
</body>
</html>
`;

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

    fse.outputFileSync(this.config.outputDir + '/index.html', indexTemplate({
      title: this.config.title,
      body: contents,
      css: typestyle.getStyles()
    }));
  }
}