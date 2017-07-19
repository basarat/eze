import { story } from '../client';
import * as React from 'react';
import { Anchor } from '../app/components/anchor';

story()
  .demo(<Anchor href="https://twitter.com/basarat" target="_blank">
    As an example click here to open twitter
  </Anchor>)
  .demo(<Anchor href="https://github.com/basarat/eze" target="_blank">
    Or click here to open github
  </Anchor>)
  .render();
