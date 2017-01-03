import { Config, Data } from '../types';
import { toHtml, dedent } from './markdown';

/**
 * Collects a document
 */
export class Collector {

  constructor(private config: Config) {}

  /**
   * We collect the rendered contents here
   */
  private data: Data = {
    contents: []
  }

  async md(markdown: string) {
    /** render the markdown */
    this.data.contents.push({ type: 'html', html: toHtml(dedent(markdown)) });
    /** TODO: Collect headings in table of contents */
  }
}