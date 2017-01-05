import { RenderConfig, Data, SupportedMode, TableOfContentEntry } from '../types';
import { toHtml, dedent, highlightCodeWithMode, MarkDownStyles } from './markdown';
import { bundle } from './bundler';
import * as fse from 'fs-extra';

export const appIndexTemplate = ({ index, jsFileName }: { index: number, jsFileName: string }) => `
<!DOCTYPE html>
<html>
<head>
    <!-- Standard Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">

    <title>Demo: ${index}</title>
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

  constructor(private config: RenderConfig) {
    if (config.repoUrl) {
      /** http://tholman.com/github-corners/ */
      this.html(`<a href="${config.repoUrl}" class="github-corner" aria-label="Visit Project"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>`)
    }
  }

  /**
   * We collect the rendered contents here
   */
  data: Data = {
    contents: [],
    tableOfContents: []
  }

  async html(html: string) {
    this.data.contents.push({ type: 'html', html });
  }

  async md(markdown: string) {
    /** render the markdown */
    const { html, headings } = toHtml(dedent(markdown));

    /** Store the html */
    this.data.contents.push({ type: 'html', html });

    /** 
     * Collect headings in table of contents
     **/
    const tableOfContents = this.data.tableOfContents;

    /** Keep track of the last heading */
    let _lastHeading: TableOfContentEntry | undefined = undefined;
    if (tableOfContents.length) {
      _lastHeading = tableOfContents[tableOfContents.length - 1];
      while (_lastHeading.subItems.length) {
        _lastHeading = _lastHeading.subItems[_lastHeading.subItems.length - 1];
      }
    }

    /** 
     * Utility to get parent of heading
     * Note: we don't store parent references otherwise we need a special JSON serializer.
     * Not worried about this graph search hit for now
     */
    const getParentHeadingIfAny = (tocEntry: TableOfContentEntry) => {
      if (!tocEntry) return undefined;
      let foundParent: typeof tocEntry = undefined;

      const subItemMatches = (subItem: typeof tocEntry) => {
        if (subItem.text === tocEntry.text
          && subItem.level === tocEntry.level) {
          return true;
        }
      }

      const visitAllChildren = (item: typeof tocEntry) => {
        if (foundParent) return;

        if (item.subItems.some(subItem => subItemMatches(subItem))) {
          foundParent = item;
          return;
        }

        item.subItems.forEach(visitAllChildren);
      }

      tableOfContents.forEach(visitAllChildren);

      return foundParent;
    }

    /** Loop them headings and add to TOC */
    headings.forEach(heading => {
      const newHeading = {
        level: heading.level,
        text: heading.text,
        id: heading.id,
        subItems: [],
      };

      /** No current heading */
      if (!_lastHeading) {
        tableOfContents.push(newHeading);
      }
      /** new heading is peer or new level */
      else if (heading.level <= _lastHeading.level) {
        /** Travel up till we find something that will accept it ... or we arrive at root */
        let parent = getParentHeadingIfAny(_lastHeading);
        /** No parent */
        if (!parent) {
          tableOfContents.push(newHeading);
        }
        else {
          /** Parent found. Keep going up to check viability */
          while (parent) {
            if (parent.level < heading.level) { // viable parent
              parent.subItems.push(newHeading);
              break;
            }
            else {
              parent = getParentHeadingIfAny(parent);
              /** No viable parent found */
              if (!parent) {
                tableOfContents.push(newHeading);
                break;
              }
            }
          }
        }
      }
      /** a sub of last */
      else {
        _lastHeading.subItems.push(newHeading);
      }
      _lastHeading = newHeading;
    });
  }

  async code({ mode, code }: { mode: SupportedMode, code: string }) {
    this.data.contents.push({
      type: 'html',
      html: `<div class=${MarkDownStyles.rootClass}><pre><code>${highlightCodeWithMode({ mode, code: code.trim() })}</code></pre></div>`
    });
  }

  /** Each demo gets its index. This drives the JS / HTML files names */
  private entryPointIndex = 0;

  async story({
    entryPointPath,
  }: { entryPointPath: string }) {
    this.entryPointIndex++;

    const index = this.entryPointIndex;
    const jsFileName = `story-${this.entryPointIndex}.js`;
    const htmlFileName = `story-${this.entryPointIndex}.html`;

    /** Collect */
    this.data.contents.push({
      type: 'story',
      htmlFileName,
      code: fse.readFileSync(entryPointPath).toString()
    });

    /** Write the html */
    fse.outputFileSync(
      this.config.outputDir + `/${htmlFileName}`,
      appIndexTemplate({ index, jsFileName })
    );

    /** Bundle */
    const outputFileName = `${this.config.outputDir}/${jsFileName}`;
    await bundle({ entryPointName: entryPointPath, outputFileName: outputFileName, prod: true });
  }

  /** Adds a raw application demo */
  async app({
    entryPointPath,
    sourceUrl,
    height
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
    const htmlFileName = `app-${this.entryPointIndex}.html`;

    /** Collect */
    this.data.contents.push({
      type: 'app',
      htmlFileName,
      sources: [
        {
          mode: 'js',
          code: fse.readFileSync(entryPointPath).toString()
        }
      ],
      sourceUrl,
      height: height
    });

    /** Write the html */
    fse.outputFileSync(
      this.config.outputDir + `/${htmlFileName}`,
      appIndexTemplate({ index, jsFileName })
    );

    /** Bundle */
    const outputFileName = `${this.config.outputDir}/${jsFileName}`;
    await bundle({ entryPointName: entryPointPath, outputFileName: outputFileName, prod: false });
  }
}