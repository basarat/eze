import { render } from "../index";
import { colors } from '../internal/styles';
import { storyAndAppIndexTemplate } from '../internal/page';

/** Render */
render({
  outputDir: __dirname + '/../../docs',
  repoUrl: "http://github.com/basarat/eze",
  title: 'eze 🌹'
}, eze => {
  eze.page({ heading: 'Welcome', subDirName: 'welcome' })

    /** Write some markdown */
    .md(`
  Designed to make creating component styleguides / demos eze.

  > [Don't forget to ⭐ on github](https://github.com/basarat/eze/stargazers)
  
  The following code shows how the demo you are looking at was created.
  `)

    /** Show this file */
    .code({
      mode: 'ts',
      code: require('fs').readFileSync(__filename).toString(),
    })

    .md(`
  > Yup, we just loaded the code for the demo in the demo ... with the power of *node* ✨🐢🚀✨
  `)

    .md(`
  # Why?
  Opinions (why chose eze over others): 
  * Documenating components is more than just showing running components. Eze supports markdown. 
  * TypeScript first. No need to install 10 npm packages to get a basic example working. Single npm install.
  * You write demos in TypeScript with full TypeScript support (autocomplete / error checking etc).
  * Eze is just a node application. You are free to use introspective code e.g. the color of this text is ${colors.text} 🌹
  * Docs in JS/TS have so many of the same advantages as JSX and CSSinJS.
  `)

    .md(`
  # Installation
  Checkout the [README](https://github.com/basarat/eze#install) ⚡
  `);

  /** Show stories */
  eze.page({ heading: 'Stories', subDirName: 'stories' })
    .md(`
  Stories are lightweight applications designed to showcase simple components.
  
  You write them using \`import {story} from 'eze/lib/client'\`

  As an example the following code:
  `)
    .code({
      mode: 'ts',
      code: require('fs').readFileSync(__dirname + '/story-1.tsx').toString()
    })
    .md(`
  Produces the following story:
  `)
    .story({
      entryPointPath: __dirname + '/story-1.tsx',
    });

  /** Show some complete application demos */
  eze.page({ heading: 'Applications', subDirName: 'apps' })
    .md(`
  You can easily show complete applications. This allows you to showcase application level layouts.
  `)
    .app({
      entryPointPath: __dirname + '/app-1.tsx',
      sourceUrl: 'https://github.com/basarat/eze/blob/master/src/docs/app-1.tsx',
      height: '100px',
    })
    .md(`
  Embedded applications can use \`import {resize} from 'eze/lib/client'\` to 
  request the containing iframe to be automatically resized.
  `)
    .app({
      entryPointPath: __dirname + '/app-2.tsx',
      sourceUrl: 'https://github.com/basarat/eze/blob/master/src/docs/app-2.tsx',
    })
    .md(`
  All applications can target the \`root\` element. The following is the HTML that is used:
  `)
    .code({
      mode: 'html',
      code: storyAndAppIndexTemplate({ index: 0, jsFileName: 'app-0.js' }),
    });

  /** Table of contents */
  eze.page({ heading: 'Table on contents generation', subDirName: 'toc' })
    .md(`
  TOC is generated automatically based on the headings parsed from markdown.
  ## Sample subheading
  Yup. You guessed it. ^ It should be visible in the TOC.
  `);
});
