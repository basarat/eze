import * as fse from 'fs-extra';
import { Data, RenderConfig } from './types';
import { bundle } from './internal/bundler/bundler';
import { Collector } from './internal/collector';
import { toHtml } from './internal/markdown';

export async function render(config: RenderConfig, cb: (eze: Collector) => Promise<void>) {
  try {
    const eze = new Collector(config);
    await cb(eze);

    /** Final render */
    await eze._done();
  }
  catch (err) {
    console.error("BUILD FAILED:", config);
    console.error(err);
    process.exit(1);
  }
}

