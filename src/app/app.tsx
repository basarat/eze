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

/** Normalize and page setup */
csstips.normalize();
csstips.setupPage('#root');

/** Data has been loaded for us using index.html */
declare const data: Data;

ReactDOM.render(<div>
  {/** Docs */}
  <div className={typestyle.style(
    csstips.horizontallyCenterSelf,
    csstips.maxWidth(900),
    csstips.padding(20, 10),
    csstips.verticallySpaced(10)
  )
  }>
    {data.contents.map((c,i) => {
      if (c.type === 'html') {
        return <renderers.HtmlRenderer key={i} {...c}/>
      }
      if (c.type === 'app') {
        return <renderers.AppRenderer key={i} {...c}/>
      }
    })}
  </div>
</div>,
  document.getElementById('root'));

typestyle.forceRenderStyles();
