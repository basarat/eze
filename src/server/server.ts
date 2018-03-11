/**
 * - Runs TypeScript on the fly (using ts-node)
 * - Serves a folder for live demo development
 */

const serveIndex = process.argv.indexOf('--serve');

// Serve mode 
if (serveIndex !== -1) {
  const serveFolder = process.argv[serveIndex + 1];

  // cleanup argv
  const origArgv = process.argv.slice();
  process.argv = origArgv
    .map((x, i) => ((i === serveIndex) || (i === serveIndex + 1)) ? null : x)
    .filter(x => x != null);
}
// Non serve mode
else {

}

// DJ - spin that s***
require('ts-node/dist/bin.js');