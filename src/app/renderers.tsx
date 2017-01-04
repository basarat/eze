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

  /** Keep centered with fixed widths */
  const centerWidth = {
    position: 'absolute' as 'absolute',
    left: '50%',
    transform: 'translateX(-50%)'
  }

  export const iframe = style({
    borderTop: `10px solid ${borderColor}`,
    borderBottom: `10px solid ${borderColor}`,
    borderLeft: `2px solid ${borderColor}`,
    borderRight: `2px solid ${borderColor}`,

    transition: 'width .2s',
  });

  export const auto = style({
    width: '100%',
  });

  export const desktop = style(centerWidth, {
    width: '1200px',
  });

  export const tablet = style(centerWidth, {
    width: '800px',
  });

  export const mobile = style(centerWidth, {
    width: '320px',
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
    return <div>
      <div style={{ textAlign: 'right' }}>
        <button onClick={() => this.setState({mode:'auto'})}>Auto</button>
        <button onClick={() => this.setState({mode:'desktop'})}>Desktop</button>
        <button onClick={() => this.setState({mode:'tablet'})}>Tablet</button>
        <button onClick={() => this.setState({mode:'mobile'})}>Mobile</button>
      </div>
      <div style={{height: '10px'}}/>
      <iframe className={classes(AppRendererStyles.iframe, AppRendererStyles[this.state.mode])} src={`./${props.htmlFileName}`} />
    </div>;
  }
}