import { render } from "../index";
import { colors } from '../internal/styles';
import { pageIndexTemplate } from '../internal/page';

/** Render */
render({
  outputDir: __dirname + '/../../docs',
  repoUrl: "http://github.com/basarat/eze",
  title: 'eze 🌹'
}, eze => {
  eze
    .page({
      heading: 'Welcome',
      subDirName: 'welcome'
    })

    /** Write some markdown */
    .md(`
  # Demo
  Designed to make creating component styleguides / demos eze.

  > [Don't forget to ⭐ on github](https://github.com/basarat/eze/stargazers)
  
  Click on the below button to see how this demo was created
  `)

    /** Show this file */
    .code({
      mode: 'ts',
      code: require('fs').readFileSync(__filename).toString(),
      collapsed: true,
    })

    .md(`
  > Yup, we just loaded the code for the demo in the demo ... with the power of *node* ✨🐢🚀✨
  `)

    .md(`
  # Why?
  Because its code. 

  Reuse code variables + do fancy **code** stuff like a 👔 . 

  e.g. the color of this text is ${colors.text} 🌹

  Docs in JS/TS have so many of the same advantages as [TypeStyle / CSS in JS](http://typestyle.io/#/why).
  `)

    .md(`
  # Installation
  Checkout the [README](https://github.com/basarat/eze#install) ⚡
  `)

    /** Show stories */
    .md(`
  # Stories
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
    })

    /** Show some complete application demos */
    .md(`
  # Embed applications
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
      code: pageIndexTemplate({ index: 0, jsFileName: 'app-0.js' }),
    })

    /** Table of contents */
    .md(`
  # Table of contents generation
  Generated automatically based on the headings parsed from markdown.
  ## Sample subheading
  Yup. You guessed it. ^ It should be visible in the TOC.
  `)

    /** Development time */
    .md(`
  # Devtime
  When working on a styleguide you normally only work on one \`story\` or \`app\` at the time. So both of these take an optional \`only\` argument. E.g.
  `)
    .code({
      mode: 'js',
      code: `
page.story({
  entryPointPath: __dirname + '/story-1.tsx',
  only: true
})      
    `
    })
    .md(`
  * Ofcourse you shouldn't commit with 'only' set to true. Use it only locally to speed up demo/story development.
  * You can even open the app / story in a new window using the "open in a new window" link so you can work on it without distraction. 
  `)
});
