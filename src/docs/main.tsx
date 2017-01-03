import { run } from "../index";

/** Run to create a document */
run({
  outputDir: __dirname + '/../../docs'
}, async eze => {

  /** Write some markdown */
  await eze.md(`
# Demo
This is the demo for eze
`);

});

