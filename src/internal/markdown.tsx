import * as React from "react";
import * as marked from "marked";
import { style, cssRaw, classes } from 'typestyle';
import * as csstips from 'csstips';
import { colors, spacing, fontSizes } from './styles';
import * as escape from 'escape-html';
import * as hljs from 'highlight.js';


/** Highlight code */
cssRaw(`
/**
 * Copied from "node_modules/hightlight.js/styles/default.css" 
 */
/*

Original highlight.js style (c) Ivan Sagalaev <maniac@softwaremaniacs.org>

*/

.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #F0F0F0;
}


/* Base color: saturation 0; */

.hljs,
.hljs-subst {
  color: #444;
}

.hljs-comment {
  color: #888888;
}

.hljs-keyword,
.hljs-attribute,
.hljs-selector-tag,
.hljs-meta-keyword,
.hljs-doctag,
.hljs-name {
  font-weight: bold;
}


/* User color: hue: 0 */

.hljs-type,
.hljs-string,
.hljs-number,
.hljs-selector-id,
.hljs-selector-class,
.hljs-quote,
.hljs-template-tag,
.hljs-deletion {
  color: #880000;
}

.hljs-title,
.hljs-section {
  color: #880000;
  font-weight: bold;
}

.hljs-regexp,
.hljs-symbol,
.hljs-variable,
.hljs-template-variable,
.hljs-link,
.hljs-selector-attr,
.hljs-selector-pseudo {
  color: #BC6060;
}


/* Language color: hue: 90; */

.hljs-literal {
  color: #78A960;
}

.hljs-built_in,
.hljs-bullet,
.hljs-code,
.hljs-addition {
  color: #397300;
}


/* Meta color: hue: 200 */

.hljs-meta {
  color: #1f7199;
}

.hljs-meta-string {
  color: #4d99bf;
}


/* Misc effects */

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}
`);
export function highlightCodeWithMode(args: { code: string, mode: string }) {
  // console.log({ code }); // DEBUG
  const res = hljs.highlight(args.mode, args.code);
  return `<div style="display: inline-block">${res.value}</div>`
}

/**
 * CSS customizations
 */
export namespace MarkDownStyles {
  export const rootClass = 'eze-markdown';

  cssRaw(`
.${rootClass} {
  color: ${colors.text}
}

.${rootClass}>* {
  margin-bottom: 10px !important;
}
.${rootClass}>*:last-child {
  margin-bottom: 0px !important;
}

.${rootClass} p {
  margin: 0px;
  line-height: 24px;
}
.${rootClass} h1 {
  margin: 0px;
}
.${rootClass} h2 {
  margin: 0px;
}
.${rootClass} h3 {
  margin: 0px;
}

/** List styling */
.${rootClass} ul {
    margin: 0px;
    margin-bottom: 20px !important;
    line-height: ${spacing.lineHeight};
    padding-left: 27px;
}
.${rootClass} ul>* {
  margin-bottom: 5px !important;
}
.${rootClass} ul>*:last-child {
  margin-bottom: 0px !important;
}
.${rootClass} li>* {
  margin-top: 5px !important;
  margin-bottom: 5px !important;
}
.${rootClass} li>*:last-child {
  margin-bottom: 0px !important;
}

.${rootClass} ol {
    margin: 0px;
    margin-bottom: 20px !important;
    line-height: ${spacing.lineHeight};
    padding-left: 27px;
}
.${rootClass} ol>* {
  margin-bottom: 5px !important;
}
.${rootClass} ol>*:last-child {
  margin-bottom: 0px !important;
}

.${rootClass} a {
  color: grey;
}

.${rootClass} a:hover {
  color: black;
}

/** Inline code */
.${rootClass} code {
  padding-left: 5px;
  padding-right: 5px;
  background: #eee;
  font-family: consolas, menlo, monospace; 
}

/** Block code */
.${rootClass} pre>code {
  display: block;
  padding: 10px;
  background: #f4f4f4;
  overflow: auto;
  font-family: consolas, menlo, monospace; 
  border-left: 2px solid #ddd;
  line-height: 24px;
}

/** Blockquote */
.${rootClass} blockquote {
  margin: 0;
  padding: 5px 20px;
  color: #6b6b6b;
  background-color: #f6f6f6;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  border-left: 4px solid #e5e5e5;
}

/** Images */
.${rootClass} img {
  /** Ensures a nice display on mobile devices */
  max-width: 100%;
}
  `);
}

/** Converts an html string to markdown */
export function toHtml(markdown: string): string {
  /** Custom rendering */
  const renderer = new marked.Renderer();

  /** 
   * Target blank external links
   * https://github.com/chjj/marked/pull/451
   **/
  renderer.link = function(href, title, text) {
    var external, newWindow, out;
    external = /^https?:\/\/.+$/.test(href);
    newWindow = external || title === 'newWindow';
    out = "<a href=\"" + href + "\"";
    if (newWindow) {
      out += ' target="_blank"';
    }
    if (title && title !== 'newWindow') {
      out += " title=\"" + title + "\"";
    }
    const output = out += ">" + text + "</a>";
    return output;
  };

  return (
    `<div class=${MarkDownStyles.rootClass}>` + marked(markdown, {
      gfm: true,
      renderer: renderer,
      highlight: (code, lang) => {
        if (lang === 'ts'
          || lang === 'js'
          || lang === 'tsx'
          || lang === 'jsx'
          || lang === 'typescript'
          || lang === 'javascript') {
          return highlightCodeWithMode({ code, mode: 'js' })
        }
        if (lang === 'html') {
          return highlightCodeWithMode({ code, mode: 'html' })
        }
        if (lang === 'css') {
          return highlightCodeWithMode({ code, mode: 'css' })
        }
        return code;
      }
    })
      // don't want a trailing newline
      .trim()
  ) + '</div>';
}

/**
 * Dedent template strings. Great for markdown authoring
 * https://github.com/dmnd/dedent/blob/master/dedent.js
 */
export function dedent(strings, ...values) {

  let raw;
  if (typeof strings === "string") {
    // dedent can be used as a plain function
    raw = [strings];
  } else {
    raw = strings.raw;
  }

  // first, perform interpolation
  let result = "";
  for (let i = 0; i < raw.length; i++) {
    result += raw[i].
      // join lines when there is a suppressed newline
      replace(/\\\n[ \t]*/g, "").

      // handle escaped backticks
      replace(/\\`/g, "`");

    if (i < values.length) {
      result += values[i];
    }
  }

  // dedent eats leading and trailing whitespace too
  result = result.trim();

  // now strip indentation
  const lines = result.split("\n");
  let mindent = null;
  lines.forEach(l => {
    let m = l.match(/^ +/);
    if (m) {
      let indent = m[0].length;
      if (!mindent) {
        // this is the first indented line
        mindent = indent;
      } else {
        mindent = Math.min(mindent, indent);
      }
    }
  });

  if (mindent !== null) {
    result = lines.map(l => l[0] === " " ? l.slice(mindent) : l).join("\n");
  }

  // handle escaped newlines at the end to ensure they don't get stripped too
  return result.replace(/\\n/g, "\n");
}