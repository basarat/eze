import * as React from 'react';
import * as types from '../types';
import { style, classes, cssRaw, media } from 'typestyle';
import * as csstips from 'csstips';
import * as styles from '../internal/styles';
import { highlightCodeWithMode, MarkDownStyles } from '../internal/markdown';
import { Expandible } from 'expandible';
import * as gls from './components/gls';
import { Toggle } from './components/toggle';
import * as icons from './components/icons';
import { Loader } from "./components/loader";

export class HtmlRenderer extends React.PureComponent<types.HTMLContent, {}> {
  render() {
    const { props } = this;
    return <div dangerouslySetInnerHTML={{ __html: props.html }} />;
  }
}

namespace AppRendererStyles {
  const borderColor = '#bbb'
  const topBorderHeight = 2;
  const bottomBorderHeight = 2;

  /** Keep centered with fixed widths */
  const centerWidth = {
    position: 'relative' as 'relative',
    left: '50%',
    transform: 'translateX(-50%)'
  }

  export const iframe = style({
    display: 'block',

    /** Bit big border needed as mobile browsers have rendering issues with 1px */
    borderTop: `${topBorderHeight}px solid ${borderColor}`,
    borderBottom: `${bottomBorderHeight}px solid ${borderColor}`,
    borderLeft: `4px solid ${borderColor}`,
    borderRight: `2px solid ${borderColor}`,

    transition: 'width .2s, height .2s',
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

  /** Autosize the iframe to remove scroll bars http://stackoverflow.com/a/9976309/390330 */
  export function resizeIframe(frame: HTMLFrameElement) {
    /** 
     * Without this we expand constantly slowly and slowly
     **/
    if (frame.style.height
      === frame.contentWindow.document.body.scrollHeight + topBorderHeight + bottomBorderHeight + 'px') {
      return;
    }
    /** Without the +borderHeight we still get scrollbars :-/ */
    frame.style.height = frame.contentWindow.document.body.scrollHeight + topBorderHeight + bottomBorderHeight + 'px';
  }
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
  ctrls: {
    frame?: HTMLFrameElement
  } = {}
  render() {
    const { props } = this;
    return <gls.VerticalMargined>
      {/** iframe the html */}
      <iframe
        ref={(frame) => this.ctrls.frame = frame as any}
        className={classes(
          AppRendererStyles.iframe,
          AppRendererStyles[this.state.mode],
          !!props.height && style({ height: props.height }),
        )}
        src={`./${props.htmlFileName}`}
        onLoad={e => {
          if (!props.height) AppRendererStyles.resizeIframe(this.ctrls.frame);
        }} />

      { /** Controls */}
      <gls.ResponsiveGridParent breakpoint={650}>
        <Toggle
          label="Show Code"
          value={this.state.viewCode}
          onChange={() => this.setState({ viewCode: !this.state.viewCode })} />
        <div className={style(media({ minWidth: 650 }, { textAlign: 'center' }))}>
          <BreakpointButtons mode={this.state.mode} onModeChange={mode => {
            this.setState({ mode });
            setTimeout(() => {
              if (!props.height) AppRendererStyles.resizeIframe(this.ctrls.frame);
            }, 500);
          }} />
        </div>
        <gls.ContentHorizontalMargined className={style(media({ minWidth: 650 }, csstips.endJustified))}>
          {!!props.sourceUrl && <a target="_blank" href={props.sourceUrl} title="View Source"><icons.File /></a>}
          <a target="_blank" href={`./${props.htmlFileName}`} title="Open demo in a new window"><icons.OpenExternal /></a>
        </gls.ContentHorizontalMargined>
      </gls.ResponsiveGridParent>

      {/** Code */}
      <Expandible open={this.state.viewCode}>
        {/** Render code in same dom structure as markdown would. To reuse styles */}
        <div className={MarkDownStyles.rootClass}>
          <pre className={style({ margin: '0px' })}>
            <code dangerouslySetInnerHTML={{ __html: highlightCodeWithMode(props.sources[0]) }} />
          </pre>
        </div>
      </Expandible>

    </gls.VerticalMargined>;
  }
}

namespace StoryRendererStyles {
  export const iframe = style({
    display: 'block',
    border: 'none',
    width: '100%',
    transition: 'height .2s',
    height: '10px',
  });

  /** Autosize the iframe to remove scroll bars http://stackoverflow.com/a/9976309/390330 */
  export function resizeIframe(frame: HTMLFrameElement) {
    frame.style.height = frame.contentWindow.document.body.scrollHeight + 'px';
  }
}

export class StoryRenderer extends React.PureComponent<types.StoryContent, { loading: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
  }
  ctrls: {
    frame?: HTMLFrameElement
  } = {}
  render() {
    const { props } = this;
    return <gls.VerticalMargined>
      {this.state.loading && <Loader />}

      {/** iframe the html */}
      <iframe
        ref={(frame) => this.ctrls.frame = frame as any}
        className={classes(
          StoryRendererStyles.iframe,
        )}
        src={`./${props.htmlFileName}`}
        onLoad={e => {
          this.setState({ loading: false });
          /** Resize to remove scrollbars */
          StoryRendererStyles.resizeIframe(this.ctrls.frame);
        }} />
    </gls.VerticalMargined>;
  }
}


class BreakpointButtons extends React.PureComponent<{ mode: AppMode, onModeChange: (mode: AppMode) => void }, {}>{
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
