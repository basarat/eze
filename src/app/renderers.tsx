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
import { P } from "./components/txt";
import { iframeRenderComplete } from './components/toc';

export class HtmlRenderer extends React.PureComponent<types.HTMLContent, {}> {
  render() {
    const { props } = this;
    return <div dangerouslySetInnerHTML={{ __html: props.html }} />;
  }
}

export class CodeRenderer extends React.PureComponent<types.CodeContent, { viewCode: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      viewCode: !props.collapsed
    }
  }
  render() {
    const { props } = this;
    return <gls.VerticalMargined>
      {
        !!props.collapsed && <Toggle
          label="Show Code"
          value={this.state.viewCode}
          onChange={() => this.setState({ viewCode: !this.state.viewCode })} />
      }
      <Expandible open={this.state.viewCode}>
        <div dangerouslySetInnerHTML={{ __html: props.html }} />
      </Expandible>
    </gls.VerticalMargined>;
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
  export function resizeIframe(frame: HTMLIFrameElement) {
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

export type AppRensponsiveMode = 'auto' | 'desktop' | 'tablet' | 'mobile';
export class AppRenderer extends React.PureComponent<types.AppContent, { mode?: AppRensponsiveMode, viewDemo?: boolean, loading?: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'auto',
      viewDemo: false,
      loading: false,
    }
  }
  componentDidMount() {
    iframeRenderComplete.on(({ iframeId }) => {
      if (iframeId === types.makeIframeId(this.props.index)) {
        AppRendererStyles.resizeIframe(this.ctrls.frame);
      }
    });
  }
  ctrls: {
    frame?: HTMLIFrameElement
  } = {}
  render() {
    const { props } = this;
    return <gls.VerticalMargined>

      <gls.ContentHorizontalMargined>
        <Toggle
          label="Show Demo"
          value={this.state.viewDemo}
          onChange={() => this.setState({ viewDemo: !this.state.viewDemo, loading: !this.state.viewDemo })} />
        {this.state.loading && <Loader />}
        <gls.Flex />
        <a target="_blank" href={`./${props.htmlFileName}`} title="Open demo in a new window"><icons.OpenExternal /></a>
      </gls.ContentHorizontalMargined>

      {/** Demo + Code */}
      <Expandible open={this.state.viewDemo}>
        <gls.VerticalMargined>
          {/** iframe the html */}
          {this.state.viewDemo && <iframe
            ref={(frame) => this.ctrls.frame = frame as HTMLIFrameElement}
            className={classes(
              AppRendererStyles.iframe,
              AppRendererStyles[this.state.mode],
              !!props.height && style({ height: props.height }),
            )}
            src={`./${props.htmlFileName}`}
            onLoad={e => {
              if (!props.height) AppRendererStyles.resizeIframe(this.ctrls.frame);
              this.setState({ loading: false })
            }} />}

          { /** Controls */}
          <gls.ResponsiveGridParent breakpoint={650}>
            <BreakpointButtons mode={this.state.mode} onModeChange={mode => {
              this.setState({ mode });
              setTimeout(() => {
                if (!props.height) AppRendererStyles.resizeIframe(this.ctrls.frame);
              }, 500);
            }} />
            <gls.ContentHorizontalMargined className={style(media({ minWidth: 650 }, csstips.endJustified))}>
              {!!props.sourceUrl && <a target="_blank" href={props.sourceUrl} title="View Source"><icons.File /></a>}
            </gls.ContentHorizontalMargined>
          </gls.ResponsiveGridParent>
          {/** Render code in same dom structure as markdown would. To reuse styles */}
          <div className={MarkDownStyles.rootClass}>
            <pre className={style({ margin: '0px' })}>
              <code dangerouslySetInnerHTML={{ __html: highlightCodeWithMode(props.sources[0]) }} />
            </pre>
          </div>
        </gls.VerticalMargined>
      </Expandible>

    </gls.VerticalMargined>;
  }
}

export namespace StoryRendererStyles {
  export const iframe = style({
    display: 'block',
    border: 'none',

    /** 100% width on ios http://stackoverflow.com/a/20142280/390330 */
    width: 1,
    minWidth: '100%',

    transition: 'height .2s',
    height: '10px',
  });

  /** Autosize the iframe to remove scroll bars http://stackoverflow.com/a/9976309/390330 */
  export function resizeIframe(frame: HTMLIFrameElement) {
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
  componentDidMount() {
    iframeRenderComplete.on(({ iframeId }) => {
      if (iframeId === types.makeIframeId(this.props.index)) {
        this.setState({ loading: false });
        StoryRendererStyles.resizeIframe(this.ctrls.frame);
      }
    });
  }
  ctrls: {
    frame?: HTMLIFrameElement
  } = {}
  render() {
    const { props } = this;
    return <gls.VerticalMargined>

      <gls.ContentHorizontal>
        <gls.Flex />

        <a target="_blank"
          href={`./${props.htmlFileName}`}
          title="Open story in a new window">
          <icons.OpenExternal />
        </a>
      </gls.ContentHorizontal>

      {this.state.loading && <gls.ContentHorizontalMarginedCentered>
        <Loader />
        <P>
          Waiting for story render to complete
        </P>
      </gls.ContentHorizontalMarginedCentered>}

      {/** iframe the html */}
      <iframe
        id={types.makeIframeId(props.index)}
        /** 100% width on ios http://stackoverflow.com/a/20142280/390330 */
        scrolling="no"
        ref={(frame) => this.ctrls.frame = frame as HTMLIFrameElement}
        className={classes(
          StoryRendererStyles.iframe,
        )}
        src={`./${props.htmlFileName}`}
        onLoad={e => {
        }} />
    </gls.VerticalMargined>;
  }
}


class BreakpointButtons extends React.PureComponent<{ mode: AppRensponsiveMode, onModeChange: (mode: AppRensponsiveMode) => void }, {}>{
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
