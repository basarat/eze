import { Data, RenderConfig } from './types';
import { Collector } from './internal/collector';
import { toHtml } from './internal/markdown';
import { Server } from './internal/serve/serve';
import { WatchManager } from './internal/serve/watcher';

const isServeMode = process.argv.indexOf('--serve') !== -1;

export async function render(config: RenderConfig, cb: (eze: Collector) => void) {
  if (isServeMode) {
    try {
      const eze = new Collector(config);

      /** Setup server */
      let server = new Server();
      await server.serve(config.outputDir);

      /** Collect */
      cb(eze);

      /** TODO: For each file that is entry point for bundling, we watch and re-render  */

      /** Final render */
      await eze._done();

      /** Reload server */
      server.triggerReload();
    }
    catch (err) {
      console.error("BUILD FAILED:", config);
      console.error(err);
    }
  }
  else {
    try {
      const eze = new Collector(config);

      /** Collect */
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
}

