import { Data, RenderConfig } from './types';
import { Collector } from './internal/collector';
import { toHtml } from './internal/markdown';

const serveIndex = process.argv.indexOf('--serve');
const isServeMode = serveIndex !== -1;
let reloadServer = () => undefined;
if (isServeMode) {
  const serveFolder = process.argv[serveIndex + 1];

  // TODO: serve folder 

  reloadServer = () => {
    // TODO
    console.log('TODO: reload server');
  }
}


export async function render(config: RenderConfig, cb: (eze: Collector) => void) {
  try {
    const eze = new Collector(config);
    cb(eze);

    /** Final render */
    await eze._done();

    if (isServeMode) {
      reloadServer();
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

