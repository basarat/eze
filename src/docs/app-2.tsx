import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { colors } from '../internal/styles';

ReactDOM.render(
  <div style={{ color: colors.text }}>
    <h1>Example with lots of content</h1>
    <h2>...</h2>
    <h2>...</h2>
    <h2>...</h2>
    <h2>...</h2>
  </div>,
  document.getElementById('root')
);