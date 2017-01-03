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
  await eze.app({ entryPointPath: __dirname + '/app-1.tsx' });
  console.log(('here 2'))  
  await eze.app({ entryPointPath: __dirname + '/app-1.tsx' });
  console.log(('here 3'))  
  await eze.app({ entryPointPath: __dirname + '/app-1.tsx' });
  console.log(('here 4'))  
}).then(() => {
  console.log('here last')
});

