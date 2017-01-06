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

ReactDOM.render(
  <div>
    <div className={typestyle.style(
      csstips.horizontallyCenterSelf,
      csstips.maxWidth(900),
      csstips.padding(20, 10),
      csstips.verticallySpaced(10)
    )}>
      {/** TOC */}
      <Toc toc={data.tableOfContents}/>
      {/** Docs */}
      {data.contents.map((c, i) => {
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
