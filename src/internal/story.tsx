/**
 * @module client side story rendering library
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MarkDown, dedent, MarkDownStyles, highlightCodeWithMode } from '../internal/markdown';
import * as gls from '../app/components/gls';
import * as typestyle from 'typestyle';
import * as csstips from 'csstips';
import * as styles from './styles';
import * as txt from '../app/components/txt';
import * as types from '../types';
import { style } from "typestyle";

/** Normalize and page setup */
csstips.normalize();
csstips.setupPage('#root');

/** Data has been loaded for us using index.html */
declare const data: types.StoryContent;

export type StoryEntry =
  | {
    type: 'md';
    md: string;
  }
  | {
    type: 'demo';
    demo: JSX.Element;
    code: string;
  };

let createdOnce = false
export class Story {
  constructor() {
    if (createdOnce) {
      const errorMessage = 'You just tried to create two stories in a single entry point. You can only create one story per entry point.';
      ReactDOM.render(
        <gls.VerticalMargined>
          <txt.Error>{errorMessage}</txt.Error>
        </gls.VerticalMargined>,
        document.getElementById('root'),
      );
      typestyle.forceRenderStyles();
      throw new Error(errorMessage);
    }
    createdOnce = true;
  }

  private stories: StoryEntry[] = [];

  md(md: string) {
    this.stories.push({ type: 'md', md });
    return this;
  }

  private demoIndex = 0;
  demo(demo: JSX.Element) {
    this.stories.push({ type: 'demo', demo, code: data.demoCodes[this.demoIndex++] });
    return this;
  }

  /** Client side rendering of a story */
  render() {
    ReactDOM.render(
      <div>
        <div className={typestyle.style(
          csstips.horizontallyCenterSelf,
          csstips.maxWidth(900),
          csstips.verticallySpaced(10)
        )}>
          {
            this.stories.map((s, i) => {
              return s.type === 'md'
                ? <MarkDown key={i} markdown={dedent(s.md)} iframeId={types.makeIframeId(data.index)} />
                : s.type === 'demo'
                  ? <div key={i} className={style(csstips.verticallySpaced(10))}>
                    <div>
                      {s.demo}
                    </div>
                    {/** Padded code extra to give visual association with what was on top */}
                    <div style={{ paddingLeft: '20px', paddingRight: '20px' }} dangerouslySetInnerHTML={{
                      __html: `<div class=${MarkDownStyles.rootClass}><pre><code>${highlightCodeWithMode({
                        mode: 'tsx',
                        code: `/** Code for above demo */\n${s.code}`
                      })}</code></pre></div>`
                    }} />
                  </div>
                  : undefined
            })
          }
        </div>
      </div>,
      document.getElementById('root'),
    );
    typestyle.forceRenderStyles();
  }
}