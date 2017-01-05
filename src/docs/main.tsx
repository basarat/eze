import { render } from "../index";
import { colors } from '../internal/styles';
import { appIndexTemplate } from '../internal/collector';

/** Render */
render({
  outputDir: __dirname + '/../../docs',
  repoUrl: "http://github.com/basarat/eze",
  title: 'eze 🌹'
}, async eze => {

  /** Write some markdown */
  await eze.md(`
  # Demo
  To create demos like this you write code like this:
  `);

  /** Show this file */
  await eze.code({ mode: 'ts', code: require('fs').readFileSync(__filename).toString() })

  await eze.md(`
  # Why?
  Because its code. 

  Reuse code variables + do fancy **code** stuff like a 👔 . 

  e.g. the color of this text is ${colors.text} 🌹

  And so many of the same advantages as [TypeStyle](http://typestyle.io/#/why).
  `);

  /** Show some complete application demos */
  await eze.md(`
  # Embed applications
  You can easily show complete applications:
  `);
  await eze.app({
    entryPointPath: __dirname + '/app-1.tsx',
    sourceUrl: 'https://github.com/basarat/eze/blob/master/src/docs/app-1.tsx',
    height: '100px'
  });
  await eze.md(`
  Embedded applications are automatically showcased in the best height
   to prevent a vertical scrollbar on initial load.
  `);
  await eze.app({
    entryPointPath: __dirname + '/app-2.tsx',
    sourceUrl: 'https://github.com/basarat/eze/blob/master/src/docs/app-2.tsx'
  });
  await eze.md(`
  All applications can target the \`root\` element. The following is the HTML that is used:
  `);
  await eze.code({
    mode: 'html',
    code: appIndexTemplate({ index: 0, jsFileName: 'app-0.js'})
  })

  /** Show stories */
  await eze.story({
    entryPointPath: __dirname + '/story-1.tsx',
  });

  /** Table of contents */
  await eze.md(`
  # Table of contents
  ## Generated
  ### Automatically
  #### Based on
  the headings parsed from markdown.
  `);
  
})

