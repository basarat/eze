import { render } from "../index";
import * as fs from 'fs';

/** Run to create a document */
render({
  outputDir: __dirname + '/../../docs'
}, async eze => {

  /** Write some markdown */
  await eze.md(`
  # Demo
  Lets start with some inception showing the code for this demo in this demo:
  `);

  /** Show this file */
  await eze.code({ mode: 'js', code: fs.readFileSync(__filename).toString() })

  await eze.md(`
  # Embed applications
  You can easily show complete applications:
  `);

  /** Show some complete application demos */
  await eze.app({ entryPointPath: __dirname + '/app-1.tsx' });
})

