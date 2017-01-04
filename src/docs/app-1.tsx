import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { colors } from '../internal/styles';

ReactDOM.render(
  <h2 style={{color: colors.text}}>Hello World</h2>,
  document.getElementById('root')
);