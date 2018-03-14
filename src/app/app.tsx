/**
 * This is the application that renders our main docs on the clients
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as csstips from 'csstips';
import * as typestyle from 'typestyle';
import { Data } from '../types';

/** Ensure loading the markdown styles */
import { toHtml } from '../internal/markdown';
const ensureUsage = toHtml;

/** Renderers */
import * as renderers from './renderers';

/** Components */
import { Anchor } from "./components/anchor";
import { Toc } from "./components/toc";

/** Normalize and page setup */
csstips.normalize();
csstips.setupPage('#eze-application-root');

/** Data has been loaded for us using index.html */
declare const data: Data;

/** Detect our pageSubDirName from the url */
const pageSubDirName = (() => {
  const portions = window.location.href
    /** The section after the hash is the current entry user is on */
    .split('#')[0]
    .split('/')
    // for trailing /
    .filter(x => !!x);
  const last = portions[portions.length - 1];
  return last;
})();

ReactDOM.render(
  <div>
    <div className={typestyle.style(
      csstips.horizontallyCenterSelf,
      csstips.maxWidth(900),
      csstips.padding(20, 10),
      csstips.verticallySpaced(10)
    )}>
      {/** TOC */}
      <Toc toc={data.tableOfContents} pageSubDirName={pageSubDirName} />
      {/** Docs */}
      {data.contents
        .filter(c => c.pageSubDirName === pageSubDirName)
        .map((c, i) => {
          if (c.type === 'html') {
            return <renderers.HtmlRenderer key={i} {...c} />
          }
          else if (c.type === 'app') {
            return <renderers.AppRenderer key={i} {...c} />
          }
          else if (c.type === 'story') {
            return <renderers.StoryRenderer key={i} {...c} />
          }
          else if (c.type === 'code') {
            return <renderers.CodeRenderer key={i} {...c} />
          }
          else {
            const _exhaustiveCheck: never = c;
          }
        })}
      {/** Footer */}
      <div style={{ textAlign: 'center' }}>
        <Anchor href={'https://npmjs.org/package/eze'} className={typestyle.style({ fontSize: '15px' })} target="_blank">Built with eze ❤️</Anchor>
      </div>
    </div>
  </div>,
  document.getElementById('eze-application-root')
);

typestyle.forceRenderStyles();
