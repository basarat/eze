import { RenderConfig, Data, SupportedMode, TableOfContentEntry, Watch, PageConfig } from '../types';
import { toHtml, dedent, highlightCodeWithMode, MarkDownStyles } from './markdown';
import { Page } from './page';
import { bundle } from './bundler/bundler';
import * as fse from 'fs-extra';
import { getDemoCodes, getMds } from './tsMagic/argumentCollector';
import * as types from '../types';

export const appIndexTemplate = (
  { firstPageDir }
    : { firstPageDir: string }
) => `
<!DOCTYPE html>
<html>
<head>
    <!-- Standard Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">
</head>
<body>
  <div id="root"></div>
  <script type="text/javascript">window.location.href = window.location.href[window.location.href.length - 1] === '/' ? (window.location.href + '${firstPageDir}/') : (window.location.href + '/${firstPageDir}/') </script>
</body>
</html>
`;

/**
 * Collects a document
 */
export class Collector {
  private pages: Page[] = [];
  private firstPageDir: string;

  constructor(private config: RenderConfig & Watch) {
  }

  page(config: PageConfig) {
    if (!this.pages.length) {
      this.firstPageDir = config.subDirName;
    }

    const page = new Page({ ...this.config, ...config });
    this.pages.push(page);
    return page;
  }

  public async _done() {
    /** If dev also write out the app to our local copy */
    if (!__dirname.includes('node_modules')) {
      console.log('DEV [START] BUNDLING frontend for eze');
      await bundle({
        entryMap: {
          'app': __dirname + '/../app/app.tsx'
        },
        outputDirName: __dirname + '/../../lib',
        ...(this.config.watch ? { watch: this.config.watch } : {})
      });
      console.log('DEV [END] BUNDLING frontend for eze');
    }

    /** Write the root application html */
    fse.outputFileSync(
      this.config.outputDir + `/index.html`,
      appIndexTemplate({ firstPageDir: this.firstPageDir })
    );

    /** Write out the data */
    const dataRaw: Data = {
      contents: [],
      tableOfContents: [],
    }
    this.pages.forEach(p => {
      p._data.contents.forEach(c => dataRaw.contents.push(c));
      p._data.tableOfContents.forEach(c => dataRaw.tableOfContents.push(c));
    })

    const data = JSON.stringify(dataRaw);
    fse.outputFileSync(`${this.config.outputDir}/data.js`, `var data = ${data}`);

    /** Bundle all the rest */
    console.log("EZE [START] webpack builds.");
    for (const page of this.pages) {
      await page._done();
    }
    console.log("EZE [END] webpack builds.");
  }
}
