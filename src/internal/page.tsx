import { RenderConfig, Data, SupportedMode, TableOfContentEntry, PageConfig, Watch, PageTalkingToCollector } from '../types';
import { toHtml, dedent, highlightCodeWithMode, MarkDownStyles } from './markdown';
import { bundle } from './bundler/master';
import * as fse from 'fs-extra';
import { getDemoCodes, getMds } from './tsMagic/argumentCollector';
import * as types from '../types';
import { mainIndex } from "../app/mainIndex";

export const storyAndAppIndexTemplate = (
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
export class Page {
  constructor(private config: RenderConfig & PageConfig & Watch & PageTalkingToCollector) {
    if (config.repoUrl) {
      /** http://tholman.com/github-corners/ */
      this.html(`<a href="${config.repoUrl}" class="github-corner" aria-label="Visit Project"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>`)
    }

    /** Add to TOC */
    this._data.tableOfContents.push({
      type: 'pageRoot',
      heading: config.heading,
      pageSubDirName: config.subDirName
    });

    /** Add to contents */
    this._data.contents.push({
      type: 'html',
      pageSubDirName: config.subDirName,
      html: `<div class="eze-markdown">
      <h1>
      ${config.heading}
      <a name="sample-subheading" class="heading-anchor" href="#${config.subDirName}" aria-hidden="true">
        <svg aria-hidden="true" version="1.1" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>
      </a>
    </h2></div>`
    });
  }

  /**
   * We collect the rendered contents here
   */
  _data: Data = {
    tableOfContents: [],
    contents: [],
  }

  /** We collect all bundle things in here */
  _bundleCollector: {
    [jsFileNameNoExt: string]: /** Entry path */ string
  } = {};

  html(html: string) {
    this._data.contents.push({ pageSubDirName: this.config.subDirName, type: 'html', html });
  }

  githubStars({ user, repo }: { user: string, repo: string }) {
    this._data.contents.push({
      type: 'html',
      pageSubDirName: this.config.subDirName,
      html: `<iframe src="https://ghbtns.com/github-btn.html?user=${user}&repo=${repo}&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>`
    });
  }

  md(markdown: string) {
    /** render the markdown */
    const { html, headings } = toHtml(dedent(markdown));

    /** Store the html */
    this._data.contents.push({
      type: 'html',
      pageSubDirName: this.config.subDirName,
      html
    });

    /** Ammend TOC */
    this.ammendTocWithHeadings(headings);

    return this;
  }

  private ammendTocWithHeadings = (headings: types.Heading[], iframeId?: string) => {
    /** 
    * Collect headings in table of contents
    **/
    const tableOfContents = this._data.tableOfContents;
    headings.forEach(heading => {
      tableOfContents.push({
        type: 'pageSub',
        id: heading.id,
        iframeId: iframeId,
        level: heading.level,
        pageSubDirName: this.config.subDirName,
        text: heading.text
      })
    });
  }

  code({ mode, code, collapsed }: { mode: SupportedMode, code: string, collapsed?: boolean }) {
    this._data.contents.push({
      type: 'code',
      html: `<div class=${MarkDownStyles.rootClass}><pre><code>${highlightCodeWithMode({ mode, code: code.trim() })}</code></pre></div>`,
      collapsed: !!collapsed,
      pageSubDirName: this.config.subDirName
    });

    return this;
  }

  /** Each demo and story gets its index. This drives the JS / HTML files names */
  private entryPointIndex = 0;

  story({
    entryPointPath,
  }: {
      entryPointPath: string,
    }) {
    this.entryPointIndex++;

    const index = this.entryPointIndex;
    const jsFileName = `story-${this.entryPointIndex}.js`;
    const jsFileNameNoExt = `story-${this.entryPointIndex}`;
    const htmlFileName = `story-${this.entryPointIndex}.html`;

    /** Collect */
    const code = fse.readFileSync(entryPointPath).toString();
    const content: types.StoryContent = {
      type: 'story',
      index: this.entryPointIndex,
      htmlFileName,
      code: code,
      demoCodes: getDemoCodes(code).map(
        /** 
         * Don't remove this lambda.
         * Otherwise `dedent` uses the `index` argument adding the number to output
         */
        (c) => dedent(c)
      ),
      pageSubDirName: this.config.subDirName
    };
    this._data.contents.push(content);

    /** Ammend TOC */
    const { headings } = toHtml(getMds(code).map(md => dedent(md)).join('\n'), types.makeIframeId(this.entryPointIndex));
    this.ammendTocWithHeadings(headings, types.makeIframeId(this.entryPointIndex));

    /** Write out the data */
    const data = JSON.stringify(content);
    fse.outputFileSync(`${this.config.outputDir}/${this.config.subDirName}/data-${this.entryPointIndex}.js`, `var data = ${JSON.stringify(content)}`);

    /** Write the html */
    fse.outputFileSync(
      `${this.config.outputDir}/${this.config.subDirName}/${htmlFileName}`,
      storyAndAppIndexTemplate({ index, jsFileName })
    );

    /** Bundle */
    this._bundleCollector[jsFileNameNoExt] = entryPointPath;
    return this;
  }

  /** Adds a raw application demo */
  app({
    entryPointPath,
    sourceUrl,
    height,
  }: {
      entryPointPath: string,
      sourceUrl?: string,

      /** 
       * Use this as the height for the demo embedding
       * If not specified we default to the iframe content scroll height
       **/
      height?: string
    }) {
    this.entryPointIndex++;

    const index = this.entryPointIndex;
    const jsFileName = `app-${this.entryPointIndex}.js`;
    const jsFileNameNoExt = `app-${this.entryPointIndex}`;
    const htmlFileName = `app-${this.entryPointIndex}.html`;

    const content: types.AppContent = {
      type: 'app',
      index: this.entryPointIndex,
      htmlFileName,
      sources: [
        {
          mode: 'js',
          code: fse.readFileSync(entryPointPath).toString()
        }
      ],
      sourceUrl,
      height: height,
      pageSubDirName: this.config.subDirName
    };

    /** Write out the data */
    const data = JSON.stringify(content);
    fse.outputFileSync(`${this.config.outputDir}/${this.config.subDirName}/data-${this.entryPointIndex}.js`, `var data = ${JSON.stringify(content)}`);

    /** Collect */
    this._data.contents.push(content);

    /** Write the html */
    fse.outputFileSync(
      `${this.config.outputDir}/${this.config.subDirName}/${htmlFileName}`,
      storyAndAppIndexTemplate({ index, jsFileName })
    );

    /** Bundle */
    this._bundleCollector[jsFileNameNoExt] = entryPointPath;

    return this;
  }

  /** The end */
  async _done() {
    /**
     * DESIGN Notes:
     * We write out an 
     * - a data.js that contains our data object
     * - index.html file 
     * - an application `app.js` that loads uses data.js to render the application
     */

    /** Write the app html + js */
    fse.outputFileSync(
      `${this.config.outputDir}/${this.config.subDirName}/index.html`,
      mainIndex({ title: this.config.title || "Docs" })
    );
    fse.writeFileSync(
      `${this.config.outputDir}/${this.config.subDirName}/app.js`,
      fse.readFileSync(__dirname + '/../../lib/app.js')
    );

    /** 
     * Await all builds only if there are any builds
     * e.g. the user might not have made any calls to `.app` | `.story`
     **/
    if (Object.keys(this._bundleCollector).length) {
      await bundle({
        entryMap: this._bundleCollector,
        outputDirName: this.config.outputDir + '/' + this.config.subDirName,
        ...(this.config.watch ? { watch: this.config.watch } : {})
      });
    }
  }
}
