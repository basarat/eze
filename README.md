# EZE

[![Greenkeeper badge](https://badges.greenkeeper.io/basarat/eze.svg)](https://greenkeeper.io/)

> Making creating meaninful demos / styleguides easy ❤️

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Donate][paypal-image]][paypal-url]

> [Powered by your github ⭐s](https://github.com/basarat/eze/stargazers)

## Install

```bash
npm install eze -D
```

Create a ts (tsx) file (e.g. `./src/docs/main.ts`)

```js
import { render } from "eze";

/** Render documentation */
render({
  outputDir: __dirname + '/../../docs'
}, eze => {

  /** Create a page */
  eze.page({heading: 'Welcome', subDirName: 'welcome'})

  /** Write some markdown */
  .md(`
  # Demo
  This is the demo for eze
  `)

  /** Show some complete application demos */
  .app({ entryPointPath: __dirname + '/app-1.tsx' });
  
});
```

Add a few npm scripts:

```json
{
  "scripts": {
    "docs": "eze ./src/docs/main.ts",
    "docs:live": "npm run docs -- --serve"
  }
}
```

* `npm run docs` builds the demos out to the specified folder. HTML + JavaScript. You can push the output `docs` folder to github, s3 or surge.sh or anywhere else you want  🌹.
* `npm run docs:live` will build out the demos, serve the output folder (on port `4000` or whatever is available in ascending order), and reload any connected browsers whenever the demo changes 🌹.

# Documentation

[Jump to the demo for eze built with eze 📝](http://basarat.com/eze)


[travis-image]:https://travis-ci.org/basarat/eze.svg?branch=master
[travis-url]:https://travis-ci.org/basarat/eze
[npm-image]:https://img.shields.io/npm/v/eze.svg?style=flat
[npm-url]:https://npmjs.org/package/eze
[paypal-image]:https://img.shields.io/badge/Donate-PayPal-green.svg
[paypal-url]:https://www.paypal.me/basaratali
