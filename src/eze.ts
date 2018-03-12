// DJ - spin that s***
require('ts-node/dist/bin.js');

if (process.argv.indexOf('--serve') !== -1) {
  const fse = require('fs-extra');
  const argv = process.argv.slice();
  const chokidar = require('chokidar');
  const reload = () => {
    Object.keys(require.cache).forEach(function(id) {
      delete require.cache[id];
    });

    // DJ - spin that s***
    process.argv = argv.slice();
    require('ts-node/dist/bin.js');
  };
  process.argv.filter(a => fse.existsSync(a)).forEach(arg => {
    const watcher = chokidar.watch(arg, { ignoreInitial: true });
    watcher.on('change', reload);
  });
}
