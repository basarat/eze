import { RenderConfig, Data, SupportedMode, TableOfContentEntry, Watch, PageConfig } from '../types';
import { toHtml, dedent, highlightCodeWithMode, MarkDownStyles } from './markdown';
import { Page } from './page';
import { bundle } from './bundler/master';
import * as fse from 'fs-extra';
import { getDemoCodes, getMds } from './tsMagic/argumentCollector';
import * as types from '../types';
import { mainIndex } from "../app/mainIndex";

export const appIndexTemplate = (
  { index, jsFileName }
    : { index: number, jsFileName: string }
) => `
<!DOCTYPE html>
<html>
<head>
    <!-- Standard Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">

    <title>Demo: ${index}</title>
    <script src="./data-${index}.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/javascript" src="./${jsFileName}"></script>
</body>
</html>
`;

/**
 * Collects a document
 */
export class Collector {
  private pages: Page[] = [];

  constructor(private config: RenderConfig & Watch) {
  }

  page(config: PageConfig) {
    const page = new Page({ ...this.config, ...config });
    this.pages.push(page);
    return page;
  }

  public async _done() {
    /** If dev also write out the app */
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
    return Promise.all(this.pages.map(x => x._done()));
  }
}
