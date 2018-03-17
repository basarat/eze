# Dev
* git clone
* `npm install`
* `npm start`

# Basic design overview 
There is a nodejs `collector.ts`. Each call to `eze` (e.g. md, html) results in a `data.js` (and possibly html) files being put into the output dir. 

Then the UI (`app.js`) uses this `data` (loaded automatically by frontend index.html) to render the whole thing into a react UI.  Different content sections are rendered using `renderers.tsx`.

`story.tsx` is used to render a story sections in a story ui app.

## Story
Each story is rendered in iframe `iframe0` etc. Headings inside the iframe are rendered with `ifrmae0-some-heading`. This allows the table of contents to work `headingId.split('-')[0]` gives the frame id. 

Hash handling code is in `toc.tsx` in parent and `story.tsx` in child. Types are in `types.ts` so you can find references using that.

# Dependencies
The following dependencies are used by the live reload workflow: 

* `parseurl` (and types) 
* `ws` (and types)
* `connect` (and types) 
* `serve-static` (and types) 
* `connect-injector` (no types)
* `onchange`

# Webpack 

* webpack (and type)
* `@types/tapable` (needed for webpack types to work)
