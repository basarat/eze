import { story } from '../story';
import * as React from 'react';
import { Anchor } from '../app/components/anchor';

story()
  .md(`
    ## Anchors
    Anchors styled to match our styleguide.
  `)
  .md(`
    ### Link for Twitter
  `)
  .demo(<Anchor href="https://twitter.com/basarat" target="_blank">
    As an example click here to open google.
  </Anchor>)
  .md(`
    ### Link for Github
  `)
  .demo(<Anchor href="https://github.com/basarat/eze" target="_blank">
    Or click here to open github
  </Anchor>)
  .render();
