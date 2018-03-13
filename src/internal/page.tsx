import { RenderConfig, Data, SupportedMode, TableOfContentEntry, PageConfig, Watch } from '../types';
import { toHtml, dedent, highlightCodeWithMode, MarkDownStyles } from './markdown';
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
export class Page {
  constructor(private config: RenderConfig & PageConfig & Watch) {

  }
}