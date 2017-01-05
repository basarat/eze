/**
 * @module used by applications to add stories to the documentation
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MarkDown } from '../internal/markdown';
import * as gls from '../app/components/gls';

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
  }

  demo(demo: JSX.Element) {
    this.stories.push({ type: 'demo', demo });
  }

  /** Client side rendering of a story */
  render() {
    ReactDOM.render(
      <gls.VerticalMargined>
        {
          this.stories.map((s, i) => {
            s.type === 'md'
              ? <MarkDown key={i} markdown={s.md} />
              : s.type === 'demo'
                ? s.demo
                : undefined
          })
        }
      </gls.VerticalMargined>,
      document.getElementById('root'),
    );
  }
}
export const story = () => new Story();