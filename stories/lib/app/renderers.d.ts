/// <reference types="react" />
import * as React from 'react';
import * as types from '../types';
export declare class HtmlRenderer extends React.PureComponent<types.HTMLContent, {}> {
    render(): JSX.Element;
}
export declare class CodeRenderer extends React.PureComponent<types.CodeContent, {
    viewCode: boolean;
}> {
    constructor(props: any);
    render(): JSX.Element;
}
export declare type AppRensponsiveMode = 'auto' | 'desktop' | 'tablet' | 'mobile';
export declare class AppRenderer extends React.PureComponent<types.AppContent, {
    mode?: AppRensponsiveMode;
    viewDemo?: boolean;
    loading?: boolean;
}> {
    constructor(props: any);
    componentDidMount(): void;
    ctrls: {
        frame?: HTMLIFrameElement;
    };
    render(): JSX.Element;
}
export declare namespace StoryRendererStyles {
    const iframe: string;
    /** Autosize the iframe to remove scroll bars http://stackoverflow.com/a/9976309/390330 */
    function resizeIframe(frame: HTMLIFrameElement): void;
}
export declare class StoryRenderer extends React.PureComponent<types.StoryContent, {
    loading: boolean;
    viewStory;
}> {
    constructor(props: any);
    componentDidMount(): void;
    ctrls: {
        frame?: HTMLIFrameElement;
    };
    render(): JSX.Element;
}
