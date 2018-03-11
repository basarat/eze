import { render } from "../index";
import { colors } from '../internal/styles';
import { appIndexTemplate } from '../internal/collector';

/** Render */
render({
  outputDir: __dirname + '/../../docs',
  repoUrl: "http://github.com/basarat/eze",
  title: 'eze 🌹'
}, eze => {
  /** Write some markdown */
  eze.md(`
  # Demo
  Designed to make creating component styleguides / demos eze.

  > [Don't forget to ⭐ on github](https://github.com/basarat/eze/stargazers)
  
  Click on the below button to see how this demo was created
  `);

  /** Show this file */
  eze.code({
    mode: 'ts',
    code: require('fs').readFileSync(__filename).toString(),
    collapsed: true,
  });

  eze.md(`
  > Yup, we just loaded the code for the demo in the demo ... with the power of *node* ✨🐢🚀✨
  `);

  eze.md(`
  # Why?
  Because its code. 

  Reuse code variables + do fancy **code** stuff like a 👔 . 

  e.g. the color of this text is ${colors.text} 🌹

  Docs in JS/TS have so many of the same advantages as [TypeStyle / CSS in JS](http://typestyle.io/#/why).
  `);

  eze.md(`
  # Installation
  Checkout the [README](https://github.com/basarat/eze#install) ⚡
  `);

  /** Show stories */
  eze.md(`
  # Stories
  Stories are lightweight applications designed to showcase simple components.
  
  You write them using \`import {story} from 'eze/lib/client';\`

  As an example the following code:
  `);
  eze.code({
    mode: 'ts',
    code: require('fs').readFileSync(__dirname + '/story-1.tsx').toString()
  });
  eze.md(`
  Produces the following story:
  `);
  eze.story({
    entryPointPath: __dirname + '/story-1.tsx',
  });

  /** Show some complete application demos */
  eze.md(`
  # Embed applications
  You can easily show complete applications. This allows you to showcase application level layouts.
  `);
  eze.app({
    entryPointPath: __dirname + '/app-1.tsx',
    sourceUrl: 'https://github.com/basarat/eze/blob/master/src/docs/app-1.tsx',
    height: '100px',
  });
  eze.md(`
  Embedded applications can use \`import {resize} from 'eze/lib/client';\` to 
  request the containing iframe to be automatically resized.
  `);
  eze.app({
    entryPointPath: __dirname + '/app-2.tsx',
    sourceUrl: 'https://github.com/basarat/eze/blob/master/src/docs/app-2.tsx',
  });
  eze.md(`
  All applications can target the \`root\` element. The following is the HTML that is used:
  `);
  eze.code({
    mode: 'html',
    code: appIndexTemplate({ index: 0, jsFileName: 'app-0.js' }),
  })

  /** Table of contents */
  eze.md(`
  # Table of contents generation
  Generated automatically based on the headings parsed from markdown.
  ## Sample subheading
  Yup. You guessed it. ^ It should be visible in the TOC.
  `);

  /** Development time */
  eze.md(`
  # Devtime
  When working on a styleguide you normally only work on one \`story\` or \`app\` at the time. So both of these take an optional \`only\` argument. E.g.
  `);
  eze.code({
    mode: 'js',
    code: `
eze.story({
  entryPointPath: __dirname + '/story-1.tsx',
  only: true
});      
    `
  });
  eze.md(`
  * Ofcourse you shouldn't commit with 'only' set to true. Use it only locally to speed up demo/story development.
  * You can even open the app / story in a new window using the "open in a new window" link so you can work on it without distraction. 
  `);
})

