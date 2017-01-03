import { render } from "../index";

/** Run to create a document */
render({
  outputDir: __dirname + '/../../docs'
}, async eze => {

  /** Write some markdown */
  await eze.md(`
  # Demo
  This is the demo for eze
  `);

  /** Show some complete application demos */
  console.log(('here 1'))  
  const res = await eze.app({ entryPointPath: __dirname + '/app-1.tsx' });
  console.log('here 2', res);
})

