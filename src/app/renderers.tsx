import * as React from 'react';
import * as types from '../types';
import { style, classes } from 'typestyle';
import * as styles from '../internal/styles';
import { highlightCodeWithMode, MarkDownStyles } from '../internal/markdown';

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
export class AppRenderer extends React.PureComponent<types.AppContent, { mode: AppMode }> {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'auto'
    }
  }
  render() {
    const { props } = this;
    return <div>

      { /** Breakpoint buttons */ }
      <div style={{ textAlign: 'right' }}>
        <Breakpoints mode={this.state.mode} onModeChange={mode => this.setState({ mode })} />
      </div>

      <div style={{ height: '10px' }} />

      {/** Iframe */}
      <iframe className={classes(AppRendererStyles.iframe, AppRendererStyles[this.state.mode])} src={`./${props.htmlFileName}`} />

      {/** Render code in same dom structure as markdown would. To reuse styles */}
      <Collapsible trigger="View Code">
        <div className={MarkDownStyles.rootClass}>
          <pre>
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

export type CollapsibleProps = {
  trigger: string | HTMLElement,

  transitionTime?: number,
  easing?: string,
  open?: boolean,
  classParentString?: string,
  handleTriggerClick?: (accordionPosition: number) => void,
  triggerWhenOpen?: string | HTMLElement,
  lazyRender?: boolean,
  overflowWhenOpen?: 'hidden' | 'visible' | 'auto' | 'scroll' | 'inherit' | 'initial' | 'unset'

  /** To work in an accordian */
  accordionPosition?: number,
}
/** Based on https://www.npmjs.com/package/react-collapsible */
export class Collapsible extends React.PureComponent<CollapsibleProps, {
  isClosed?: boolean,
  shouldSwitchAutoOnNextCycle?: boolean,
  height?: string | number,
  transition?: string,
  hasBeenOpened?: boolean,
  overflow?: CollapsibleProps['overflowWhenOpen'],
}>{

  //If no transition time or easing is passed then default to this
  static defaultProps = {
    transitionTime: 200,
    easing: 'linear',
    open: false,
    classParentString: 'Collapsible',
    lazyRender: false,
    overflowWhenOpen: 'hidden',

    accordionPosition: 0
  };

  constructor(props: CollapsibleProps) {
    super(props);

    this.state = this.props.open ? {
      isClosed: false,
      shouldSwitchAutoOnNextCycle: false,
      height: 'auto',
      transition: 'none',
      hasBeenOpened: true,
      overflow: this.props.overflowWhenOpen
    }
      : {
        isClosed: true,
        shouldSwitchAutoOnNextCycle: false,
        height: 0,
        transition: 'height ' + this.props.transitionTime + 'ms ' + this.props.easing,
        hasBeenOpened: false,
        overflow: 'hidden'
      }
  };

  // Taken from https://github.com/EvandroLG/transitionEnd/
  // Determines which prefixed event to listen for
  whichTransitionEnd = (element) => {
    var transitions = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd otransitionend',
      'transition': 'transitionend'
    };

    for (var t in transitions) {
      if (element.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }

  refs: {
    outer?: HTMLDivElement
    inner?: HTMLDivElement
  };

  componentDidMount = () => {
    // Set up event listener to listen to transitionend so we can switch the height from fixed pixel to auto for much responsiveness;
    this.refs.outer.addEventListener(this.whichTransitionEnd(this.refs.outer), (event) => {
      if (this.state.isClosed === false) {
        this.setState({
          shouldSwitchAutoOnNextCycle: true
        });
      }

    });
  }

  componentDidUpdate = (prevProps: CollapsibleProps) => {

    if (this.state.shouldSwitchAutoOnNextCycle === true && this.state.isClosed === false) {
      //Set the height to auto to make compoenent re-render with the height set to auto.
      //This way the dropdown will be responsive and also change height if there is another dropdown within it.
      this.makeResponsive();
    }

    if (this.state.shouldSwitchAutoOnNextCycle === true && this.state.isClosed === true) {
      this.prepareToOpen();
    }

    //If there has been a change in the open prop (controlled by accordion)
    if (prevProps.open != this.props.open) {
      console.log('Open state changed!', this.props.accordionPosition);

      if (this.props.open === true) {
        this.openCollapsible();
      }
      else {
        this.closeCollapsible();
      }
    }
  }


  handleTriggerClick = (event) => {

    event.preventDefault();

    if (this.props.handleTriggerClick) {
      this.props.handleTriggerClick(this.props.accordionPosition);
    }
    else {

      if (this.state.isClosed === true) {
        this.openCollapsible();
      }
      else {
        this.closeCollapsible();
      }
    }

  }

  closeCollapsible = () => {
    this.setState({
      isClosed: true,
      shouldSwitchAutoOnNextCycle: true,
      height: this.refs.inner.offsetHeight,
      overflow: 'hidden',
    });
  }

  openCollapsible = () => {
    this.setState({
      height: this.refs.inner.offsetHeight,
      transition: 'height ' + this.props.transitionTime + 'ms ' + this.props.easing,
      isClosed: false,
      hasBeenOpened: true
    });
  }

  makeResponsive = () => {
    this.setState({
      height: 'auto',
      transition: 'none',
      shouldSwitchAutoOnNextCycle: false,
      overflow: this.props.overflowWhenOpen
    });
  }

  prepareToOpen = () => {
    //The height has been changes back to fixed pixel, we set a small timeout to force the CSS transition back to 0 on the next tick.
    window.setTimeout(() => {
      this.setState({
        height: 0,
        shouldSwitchAutoOnNextCycle: false,
        transition: 'height ' + this.props.transitionTime + 'ms ' + this.props.easing
      });
    }, 50);
  }

  render() {

    var dropdownStyle = {
      height: this.state.height,
      WebkitTransition: this.state.transition,
      msTransition: this.state.transition,
      transition: this.state.transition,
      overflow: this.state.overflow
    }

    var openClass = this.state.isClosed ? 'is-closed' : 'is-open';

    //If user wants different text when tray is open
    var trigger = (this.state.isClosed === false) && (this.props.triggerWhenOpen !== undefined) ? this.props.triggerWhenOpen : this.props.trigger;

    // Don't render children until the first opening of the Collapsible if lazy rendering is enabled
    var children = this.props.children;
    if (this.props.lazyRender)
      if (!this.state.hasBeenOpened)
        children = null;

    return (
      <div className={this.props.classParentString}>
        <span className={this.props.classParentString + "__trigger" + ' ' + openClass} onClick={this.handleTriggerClick}>{trigger}</span>
        <div className={this.props.classParentString + "__contentOuter"} ref="outer" style={dropdownStyle}>
          <div className={this.props.classParentString + "__contentInner"} ref="inner">
            {children}
          </div>
        </div>
      </div>
    );
  }
}