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
  eze.md(`
  # Demo
  To create demos like this you write code like this:
  `);

  /** Show this file */
  eze.code({
    mode: 'ts',
    code: require('fs').readFileSync(__filename).toString()
  })

  eze.md(`
  # Why?
  Because its code. 

  Reuse code variables + do fancy **code** stuff like a 👔 . 

  e.g. the color of this text is ${colors.text} 🌹

  And so many of the same advantages as [TypeStyle](http://typestyle.io/#/why).
  `);

  /** Show some complete application demos */
  eze.md(`
  # Embed applications
  You can easily show complete applications:
  `);
  eze.app({
    entryPointPath: __dirname + '/app-1.tsx',
    sourceUrl: 'https://github.com/basarat/eze/blob/master/src/docs/app-1.tsx',
    height: '100px'
  });
  eze.md(`
  Embedded applications are automatically showcased in the best height
   to prevent a vertical scrollbar on initial load.
  `);
  eze.app({
    entryPointPath: __dirname + '/app-2.tsx',
    sourceUrl: 'https://github.com/basarat/eze/blob/master/src/docs/app-2.tsx'
  });
  eze.md(`
  All applications can target the \`root\` element. The following is the HTML that is used:
  `);
  eze.code({
    mode: 'html',
    code: appIndexTemplate({ index: 0, jsFileName: 'app-0.js' })
  })

  /** Show stories */
  eze.md(`
  # Stories
  Stories are lightweight applications designed to showcase simple components.
  
  You write them using \`import {story} from 'eze/lib/story';\`

  As an example the following code:
  `);
  eze.code({
    mode: 'ts',
    code: require('fs').readFileSync(__dirname + '/story-1.tsx').toString()
  })
  eze.md(`
  Produces the following story:
  `);
  eze.story({
    entryPointPath: __dirname + '/story-1.tsx',
  });

  /** Table of contents */
  eze.md(`
  # Table of contents
  ## Generated
  ### Automatically
  #### Based on
  the headings parsed from markdown.
  `);
})

