
if (process.argv.indexOf('--serve') !== -1) {
  const nonServeArgs = process.argv.filter(x => x !== '--serve');
  /** Assume the last argument is the file you want to execute */
  const rootToExec = nonServeArgs[nonServeArgs.length - 1];
  require('nodemon')({
    script: rootToExec,
    ext: 'ts',
  });
  process.on('SIGINT', () => {
    process.exit(0);
  });
} else {
  // DJ - spin that s***
  require('ts-node/dist/bin.js');
}
