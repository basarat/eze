import { Data, RenderConfig } from './types';
import { Collector } from './internal/collector';
import { toHtml } from './internal/markdown';
import { Server } from './internal/serve/serve';
import { WatchManager } from './internal/serve/watcher';
import { makeStack } from './internal/utils';
import { mkdirp, existsSync } from 'fs-extra';
import { resolve } from 'path';

const isServeMode = process.argv.indexOf('--serve') !== -1;

export async function render(config: RenderConfig, cb: (eze: Collector) => void) {
  /** Kill all wierdness */
  config.outputDir = resolve(config.outputDir);

  if (isServeMode) {
    
    try {
      /** Setup server */
      let server = new Server();
      if (!existsSync(config.outputDir)) await mkdirp(config.outputDir);
      await server.serve(config.outputDir);

      const redo = async () => {
        watcher.dispose();

        /** trinity */
        const eze = new Collector(config);
        cb(eze);
        await eze._done();

        /** TODO: For each file that is entry point for bundling, we watch and re-render  */

        server.triggerReload();
      };

      const watcher = new WatchManager();
      redo();
    }
    catch (err) {
      console.error("BUILD FAILED:", config);
      console.error(err);
    }
  }
  else {
    try {
      /** Create */
      const eze = new Collector(config);

      /** Collect */
      cb(eze);

      /** Render */
      await eze._done();
    }
    catch (err) {
      console.error("BUILD FAILED:", config);
      console.error(err);
      process.exit(1);
    }
  }
}
