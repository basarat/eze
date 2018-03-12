
if (process.argv.indexOf('--serve') !== -1) {
  const nonServeArgs = process.argv.filter(x => x !== '--serve');
  const rootToExec = nonServeArgs[nonServeArgs.length - 1];
  require('nodemon')(`-e "ts" -x "ts-node" ${rootToExec}`);
} else {
  // DJ - spin that s***
  require('ts-node/dist/bin.js');
}
