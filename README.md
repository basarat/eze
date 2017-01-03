# EZE

> Making creating meaninful demos / styleguides easy ❤️

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

> [Powered by your github ⭐s](https://github.com/basarat/eze/stargazers)

<iframe src="https://ghbtns.com/github-btn.html?user=basarat&repo=eze&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>

## Install
Install

`npm install eze --save-dev`

Give a ts (tsx) file 

```ts
import {Eze} from "eze";

/** Export an eze instance */
export default eze = new Eze();

/** Write some markdown */
eze.md(`
# Demo
This is the demo for eze
`);
```

Run `eze`: 

```json
{
  "scripts": {
    "docs": "eze ./docs/ --out ./public"  
  }
}
```
This builds the demos out to the `./public` folder. HTML + JavaScript 🌹.

# Demo

[Jump to the demo for eze built with eze 📝](https://basarat.com/eze)


[travis-image]:https://travis-ci.org/basarat/eze.svg?branch=master
[travis-url]:https://travis-ci.org/basarat/eze
[npm-image]:https://img.shields.io/npm/v/eze.svg?style=flat
[npm-url]:https://npmjs.org/package/eze