import { Eze } from "../index";

/** Create an eze instance */
const eze = new Eze({
  outputDir: '../docs'
});

/** Write some markdown */
eze.md(`
# Demo
This is the demo for eze
`);

/** Render it out */
eze.done();