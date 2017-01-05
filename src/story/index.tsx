/**
 * @module used by applications to add stories to the documentation
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MarkDown } from '../internal/markdown';
import * as gls from '../app/components/gls';

export type StoryEntry = {
  md: string;
  demo: JSX.Element;
}
export class Story {
  constructor(public title: string) { }

  private stories: StoryEntry[] = [];

  add(entry: StoryEntry) {
    this.stories.push(entry);
  }

  render() {
    ReactDOM.render(
      <gls.VerticalMargined>
        {this.stories.map((s, i) => <MarkDown key={i} markdown={s.md} />)}
      </gls.VerticalMargined>,
      document.getElementById('root'),
    );
  }
}
export const story = (title: string) => new Story(title);