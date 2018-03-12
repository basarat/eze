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
    /** Find out who is calling us so we can reload for changes if required */
    const callStack = makeStack((new Error() as any).stack);
    const usIndex = callStack.map(s => s.filePath).lastIndexOf(__filename);
    const callerIndex = usIndex + 1;
    const callers = callStack.slice(callerIndex).map(x => x.filePath);

    try {
      /** Setup server */
      let server = new Server();
      if (!existsSync(config.outputDir)) await mkdirp(config.outputDir);
      await server.serve(config.outputDir);

      const redo = async () => {
        watcher.dispose();
        callers.forEach(fp => watcher.addWatcher(fp, redo));

        /** trinity */
        const eze = new Collector(config);
        cb(eze);
        await eze._done();

        server.triggerReload();
      };

      const watcher = new WatchManager();
      callers.forEach(fp => watcher.addWatcher(fp, redo));

      /** trinity */
      const eze = new Collector(config);
      cb(eze);
      await eze._done();

      /** TODO: For each file that is entry point for bundling, we watch and re-render  */


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
