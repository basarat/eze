import { story } from '../story';
import * as React from 'react';
import { Anchor } from '../app/components/anchor';

story()
  .md(`
    # Stories
    Just as easy to show as complete application demos.
    e.g. Lets showcase our anchor:
  `)
  .demo(<Anchor href="http://www.google.com" target="_blank">
    As an example click here to open google.
  </Anchor>)
  .render();