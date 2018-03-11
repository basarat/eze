# EZE

> Making creating meaninful demos / styleguides easy ❤️

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

> [Powered by your github ⭐s](https://github.com/basarat/eze/stargazers)

## Install
Install

`npm install eze -D`

Create a ts (tsx) file (e.g. `./src/docs/main.ts`)

```ts
import { render } from "../index";

/** Render documentation */
render({
  outputDir: __dirname + '/../../docs'
}, async eze => {

  /** Write some markdown */
  await eze.md(`
  # Demo
  This is the demo for eze
  `);

  /** Show some complete application demos */
  await eze.app({ entryPointPath: __dirname + '/app-1.tsx' });
});
```

Run it: 

```json
{
  "scripts": {
    "docs": "eze ./src/docs/main.ts"  
  }
}
```

Now `npm run docs` builds the demos out to the specified folder. HTML + JavaScript. 

> You can push the output folder to github, s3 or surge.sh or anywhere else you want  🌹

## Live Preview

For live development just use `--serve` with a specfied folder:

```json
{
  "scripts": {
    "docs": "eze ./src/docs/main.ts",
    "start": "npm run docs -- --serve ./docs", 
  }
}
```

`npm start` 🌹

# Demo

[Jump to the demo for eze built with eze 📝](http://basarat.com/eze)


[travis-image]:https://travis-ci.org/basarat/eze.svg?branch=master
[travis-url]:https://travis-ci.org/basarat/eze
[npm-image]:https://img.shields.io/npm/v/eze.svg?style=flat
[npm-url]:https://npmjs.org/package/eze