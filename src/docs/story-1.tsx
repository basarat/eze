import { story } from '../story';
import * as React from 'react';

story()
  .md(`
    # Stories
    Just as easy to show as complete application demos
  `)
  .demo(<button>Hello world</button>)
  .render();