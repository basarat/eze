import { Data, RenderConfig } from './types';
import { Collector } from './internal/collector';
import { toHtml } from './internal/markdown';

const serveIndex = process.argv.indexOf('--serve');
const isServeMode = serveIndex !== -1;
let reloadServer = () => undefined;
let addServeFolderIfNotAlreadyServed = (folderPath: string) => undefined;
if (isServeMode) {
  // TODO: Start server
  
  addServeFolderIfNotAlreadyServed = (folderPath: string) => {
    // TODO
    console.log(`TODO: serve folder ${folderPath}`);
  }

  reloadServer = () => {
    // TODO
    console.log('TODO: reload server');
  }
}


export async function render(config: RenderConfig, cb: (eze: Collector) => void) {
  try {
    const eze = new Collector(config);
    if (isServeMode) {
      addServeFolderIfNotAlreadyServed(config.outputDir);
    }
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

