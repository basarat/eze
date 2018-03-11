/**
 * - Runs TypeScript on the fly (using ts-node)
 * - Serves a folder for live demo development
 */

const serveIndex = process.argv.indexOf('--serve');

// Serve mode 
if (serveIndex !== -1) {
  const serveFolder = process.argv[serveIndex + 1];

}
// Non serve mode
else {

}

// DJ - spin that s***
require('ts-node');