# Dev

`npm install`
`npm start`

# Notes 

Some obscure portions are mentioned below: 

## Story
Each story is rendered in iframe `iframe0` etc. Headings inside the iframe are rendered with `ifrmae0-some-heading`. This allows the table of contents to work `headingId.split('-')[0]` gives the frame id. 