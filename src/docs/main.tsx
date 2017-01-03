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

  /** Show some complete application demos */
  await eze.app(__dirname + '/app-1.tsx');
});

