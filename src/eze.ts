if (process.argv.indexOf('--serve') !== -1) {
  const nonServeArgs = process.argv.filter(x => x !== '--serve');
  /** Assume the last argument is the file you want to execute */
  const rootToExec = nonServeArgs[nonServeArgs.length - 1];

  const onchange = require('onchange');
  onchange(
    [rootToExec],
    process.execPath,
    [require.resolve('ts-node/dist/bin.js'), rootToExec, '--serve'],
    {
      initial: true,
    }
  );
}
else {
  // DJ - spin that s***
  require('ts-node/dist/bin.js');
}
