import * as React from 'react';
import * as types from '../types';


export class HtmlRenderer extends React.PureComponent<types.HTMLContent, {}> {
  render() {
    const {props} = this;
    return <div dangerouslySetInnerHTML={{ __html: props.html }} />;
  }
}

export class AppRenderer extends React.PureComponent<types.AppContent, {}> {
  render() {
    const {props} = this;
    return <iframe src={`./${props.htmlFileName}`}/>;
  }
}