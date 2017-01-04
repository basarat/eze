import { Config, Data } from '../types';
import { toHtml, dedent } from './markdown';
import { bundle } from './bundler';
import * as fse from 'fs-extra';

const appIndexTemplate = ({ index, jsFileName }: { index: number, jsFileName: string }) => `
<!DOCTYPE html>
<html>
<head>
    <!-- Standard Meta -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

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

  constructor(private config: Config) { }

  /**
   * We collect the rendered contents here
   */
  data: Data = {
    contents: []
  }

  /** Each demo gets its index */
  private entryPointIndex = 0;

  async md(markdown: string) {
    /** render the markdown */
    this.data.contents.push({ type: 'html', html: toHtml(dedent(markdown)) });
    /** TODO: Collect headings in table of contents */
  }

  async app({ entryPointPath }: { entryPointPath: string}) {
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
      ]
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