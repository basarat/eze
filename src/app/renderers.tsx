import * as React from 'react';
import * as types from '../types';
import { style, classes } from 'typestyle';
import * as csstips from 'csstips';
import * as styles from '../internal/styles';
import { highlightCodeWithMode, MarkDownStyles } from '../internal/markdown';
import { Collapsible } from './collapsible';

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
    position: 'relative' as 'relative',
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
    width: '768px',
  });

  export const mobile = style(centerWidth, {
    width: '320px',
  });
}

export type AppMode = 'auto' | 'desktop' | 'tablet' | 'mobile';
export class AppRenderer extends React.PureComponent<types.AppContent, { mode?: AppMode, viewCode?: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'auto',
      viewCode: false
    }
  }
  render() {
    const { props } = this;
    return <div className={style(csstips.verticallySpaced(10))}>

      { /** Breakpoint buttons */}
      <div style={{ textAlign: 'right' }}>
        <Breakpoints mode={this.state.mode} onModeChange={mode => this.setState({ mode })} />
      </div>

      {/** Iframe */}
      <iframe className={classes(AppRendererStyles.iframe, AppRendererStyles[this.state.mode])} src={`./${props.htmlFileName}`} />


      {/** View code toggle */}
      <button onClick={(open) => this.setState({ viewCode: !this.state.viewCode })}>Toggle Code</button>

      {/** Code */}
      <Collapsible open={this.state.viewCode}>
        {/** Render code in same dom structure as markdown would. To reuse styles */}
        <div className={MarkDownStyles.rootClass}>
          <pre className={style({ margin: '0px' })}>
            <code dangerouslySetInnerHTML={{ __html: highlightCodeWithMode(props.sources[0]) }} />
          </pre>
        </div>
      </Collapsible>

    </div>;
  }
}


class Breakpoints extends React.PureComponent<{ mode: AppMode, onModeChange: (mode: AppMode) => void }, {}>{
  render() {

    const containerClass = style({
      display: 'inline-block',
      border: '2px solid #ccc',
      borderRadius: '13px',
      $nest: {
        '&>*': {
          border: 'none',
          borderRadius: '13px',
          backgroundColor: 'white',
          transition: 'background-color .2s, color .2s',
          color: styles.colors.text
        },
        '&>*:focus': {
          outline: 'none',
        },
        '&>*:hover': {
          color: '#999',
        },
        '&>*:first-child': {
          borderLeft: '2px solid #ccc !important'
        },
        '&>*:last-child': {
          borderRight: '2px solid #ccc !important'
        },
      }
    });

    const selectedClass = style({
      backgroundColor: '#ccc',
      $nest: {
        '&:hover': {
          color: 'white'
        }
      }
    })

    return <div className={containerClass}>
      <button className={classes(this.props.mode === 'auto' && selectedClass)} onClick={() => this.props.onModeChange('auto')}>Auto</button>
      <button className={classes(this.props.mode === 'desktop' && selectedClass)} onClick={() => this.props.onModeChange('desktop')}>1200</button>
      <button className={classes(this.props.mode === 'tablet' && selectedClass)} onClick={() => this.props.onModeChange('tablet')}>768</button>
      <button className={classes(this.props.mode === 'mobile' && selectedClass)} onClick={() => this.props.onModeChange('mobile')}>320</button>
    </div>;
  }
}
