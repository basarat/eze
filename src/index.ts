import { Data, RenderConfig } from './types';
import { Collector } from './internal/collector';
import { toHtml } from './internal/markdown';
import { Server } from './internal/serve/serve';
import { WatchManager } from './internal/serve/watcher';
import { makeStack } from './internal/utils';

const isServeMode = process.argv.indexOf('--serve') !== -1;

export async function render(config: RenderConfig, cb: (eze: Collector) => void) {
  if (isServeMode) {
    try {
      const redo = async () => {
        watcher.dispose();
        watcher.addWatcher(callerFilePath, redo);

        const eze = new Collector(config);
        await server.serve(config.outputDir);
        cb(eze);
        await eze._done();
        server.triggerReload();
      };

      const watcher = new WatchManager();

      /** 0 is us, 1 is caller, 2 is callers caller, and so on */
      const callerFilePath = makeStack((new Error() as any).stack)[1].filePath;
      watcher.addWatcher(callerFilePath, redo);

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
