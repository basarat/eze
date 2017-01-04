import * as React from 'react';
import * as types from '../types';
import { style, classes } from 'typestyle';

export class HtmlRenderer extends React.PureComponent<types.HTMLContent, {}> {
  render() {
    const { props } = this;
    return <div dangerouslySetInnerHTML={{ __html: props.html }} />;
  }
}

namespace AppRendererStyles {
  const borderColor = '#bbb'
  export const iframe = style({
    borderTop: `10px solid ${borderColor}`,
    borderBottom: `10px solid ${borderColor}`,
    borderLeft: `2px solid ${borderColor}`,
    borderRight: `2px solid ${borderColor}`,
  });

  export const auto = style({
    width: '100%',
  });

  export const desktop = style({
    width: '100%',
  });

  export const tablet = style({
    width: '100%',
  });

  export const mobile = style({
    width: '100%',
  });
}

export class AppRenderer extends React.PureComponent<types.AppContent, { mode: 'auto' | 'desktop' | 'tablet' | 'mobile' }> {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'auto'
    }
  }
  render() {
    const { props } = this;
    return <iframe className={classes(AppRendererStyles.iframe, AppRendererStyles[this.state.mode])} src={`./${props.htmlFileName}`} />;
  }
}