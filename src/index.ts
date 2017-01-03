import * as fse from 'fs-extra';
import { toHtml } from './core/markdown';
import * as typestyle from 'typestyle';
import * as csstips from 'csstips';
import * as ReactDOMServer from 'react-dom/server';
import * as React from 'react';

/** Normalize and page setup */
csstips.normalize();
csstips.setupPage('#root');

/**
 * DESIGN Notes:
 * We write out an 
 * - index.html file 
 * - a data.js that contains our data object
 * - an application `app.js` that loads uses data.js to render the application
 */

/**
 * Our main index.html
 */
const indexTemplate = ({ title, body, css }: { title: string, body: string, css: string }) => `
<!DOCTYPE html>
<html>
<head>
    <!-- Standard Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <!-- Site Properties -->
    <title>${title}</title>

    <script src="./data.js"></script>
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

interface Data { 
  contents: string[];
}

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
  done() {
    /** Write out the data */
    const data = JSON.stringify(this.data);
    fse.outputFileSync(this.config.outputDir + '/data.js', `var data = ${data}`);

    /** TODO: write the html + js */

    fse.outputFileSync(this.config.outputDir + '/index.html', indexTemplate({
      title: this.config.title,
      body: '',
      css: typestyle.getStyles()
    }));
  }
}