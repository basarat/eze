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

/** Normalize and page setup */
csstips.normalize();
csstips.setupPage('#root');

/** Data has been loaded for us using index.html */
declare const data: Data;

ReactDOM.render(<div>
  {/** Docs */}
  <div className={typestyle.style(
    csstips.horizontallyCenterSelf,
    csstips.maxWidth(900))
  }>
    {data.contents.map((c,i) => {
      if (c.type === 'html') {
        return <div key={i} dangerouslySetInnerHTML={{__html: c.html}}/>
      }
    })}
  </div>
</div>,
  document.getElementById('root'));