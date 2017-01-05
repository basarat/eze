import * as React from "react";
import * as marked from "marked";
import { style, cssRaw, classes } from 'typestyle';
import * as csstips from 'csstips';
import { colors, spacing, fontSizes } from './styles';
import * as escape from 'escape-html';
import * as hljs from 'highlight.js';
import { SupportedMode } from '../types';

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
export function highlightCodeWithMode(args: { code: string, mode: SupportedMode }) {
  // console.log({ code }); // DEBUG
  let { mode } = args;
  if (mode === 'ts'
    || mode === 'js'
    || mode === 'tsx'
    || mode === 'jsx'
    || mode === 'typescript'
    || mode === 'javascript') {
    mode = 'js';
  }

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
  line-height: 1.5;
}
.${rootClass} h2 {
  margin: 0px;
}
.${rootClass} h3 {
  margin: 0px;
}
.${rootClass} h4 {
  margin: 0px;
}
.${rootClass} h5 {
  margin: 0px;
}
.${rootClass} h6 {
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

/** Heading anchors */
.${rootClass} .heading-anchor {
  line-height: 1.2;

  /** Default display */
  opacity: .5;
  transition: opacity .1s;
}
.${rootClass} .heading-anchor:focus {
  outline: none;
  opacity: 1;
}
h1:hover .heading-anchor, 
h2:hover .heading-anchor, 
h3:hover .heading-anchor, 
h4:hover .heading-anchor {
  opacity: 1;
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

export type Heading = { level: 1 | 2 | 3 | 4 | 5 | 6, text: string, id: string };

/** Converts an html string to markdown */
export function toHtml(markdown: string): {
  html: string,
  headings: Heading[]
} {
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

  const headings: Heading[] = [];

  /** Collect headings */
  renderer.heading = function(text: string, level: Heading['level']) {
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    headings.push({
      level,
      id,
      text
    });
    return `<h${level}>
      ${text}
      <a name="${id}" class="heading-anchor" href="#${id}" aria-hidden="true">
        <svg aria-hidden="true" version="1.1" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>
      </a>
    </h${level}>`;
  }

  const html = (
    `<div class=${MarkDownStyles.rootClass}>` + marked(markdown, {
      gfm: true,
      renderer: renderer,
      highlight: (code, lang) => {
        return highlightCodeWithMode({ code, mode: lang });
      }
    })
      // don't want a trailing newline
      .trim()
  ) + '</div>';

  return { html, headings };
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


export interface MarkdownProps { markdown: string };

/**
 * Renders markdown
 */
export class MarkDown extends React.PureComponent<MarkdownProps, {}> {
  render() {
    const html = toHtml(this.props.markdown).html;
    return (
      <div className={classes(MarkDownStyles.rootClass, style(csstips.verticallySpaced(10)))}
        dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
}