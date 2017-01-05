/**
 * @module used by applications to add stories to the documentation
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MarkDown, dedent } from '../internal/markdown';
import * as gls from '../app/components/gls';
import * as typestyle from 'typestyle';
import * as csstips from 'csstips';

/** Normalize and page setup */
csstips.normalize();
csstips.setupPage('#root');

export type StoryEntry =
  | {
    type: 'md';
    md?: string;
  }
  | {
    type: 'demo';
    demo?: JSX.Element;
  };

export class Story {
  constructor() { }

  private stories: StoryEntry[] = [];

  md(md: string) {
    this.stories.push({ type: 'md', md });
    return this;
  }

  demo(demo: JSX.Element) {
    this.stories.push({ type: 'demo', demo });
    return this;
  }

  /** Client side rendering of a story */
  render() {
    ReactDOM.render(
      <gls.VerticalMargined>
        {
          this.stories.map((s, i) => {
            return s.type === 'md'
              ? <MarkDown key={i} markdown={dedent(s.md)} />
              : s.type === 'demo'
                ? <div key={i}>
                  {s.demo}
                </div>
                : undefined
          })
        }
      </gls.VerticalMargined>,
      document.getElementById('root'),
    );
    typestyle.forceRenderStyles();
  }
}
export const story = () => new Story();