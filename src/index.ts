import { Data, RenderConfig } from './types';
import { Collector } from './internal/collector';
import { toHtml } from './internal/markdown';
import { Server } from './internal/serve/serve';

const serveIndex = process.argv.indexOf('--serve');
const isServeMode = serveIndex !== -1;

export async function render(config: RenderConfig, cb: (eze: Collector) => void) {
  try {
    const eze = new Collector(config);

    /** Setup server */
    let server = new Server();
    if (isServeMode) {
      await server.serve(config.outputDir);
    }

    /** Collect */
    cb(eze);

    /** Final render */
    await eze._done();

    /** Reload server */
    if (isServeMode) {
      server.triggerReload();
    }
  }
  catch (err) {
    console.error("BUILD FAILED:", config);
    console.error(err);
    if (!isServeMode) {
      process.exit(1);
    }
  }
}

