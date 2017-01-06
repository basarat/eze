import * as fse from 'fs-extra';
import { Data, RenderConfig } from './types';
import { Collector } from './internal/collector';
import { toHtml } from './internal/markdown';

export async function render(config: RenderConfig, cb: (eze: Collector) => void) {
  try {
    const eze = new Collector(config);
    cb(eze);

    /** Final render */
    await eze._done();
  }
  catch (err) {
    console.error("BUILD FAILED:", config);
    console.error(err);
    process.exit(1);
  }
}

