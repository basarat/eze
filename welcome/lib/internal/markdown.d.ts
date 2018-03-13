/// <reference types="react" />
import * as React from "react";
import { SupportedMode, Heading } from '../types';
export declare function highlightCodeWithMode(args: {
    code: string;
    mode: SupportedMode;
}): string;
/**
 * CSS customizations
 */
export declare namespace MarkDownStyles {
    const rootClass = "eze-markdown";
}
/** Converts an html string to markdown */
export declare function toHtml(markdown: string, iframeId?: string): {
    html: string;
    headings: Heading[];
};
/**
 * Dedent template strings. Great for markdown authoring
 * https://github.com/dmnd/dedent/blob/master/dedent.js
 */
export declare function dedent(strings: any, ...values: any[]): string;
export interface MarkdownProps {
    markdown: string;
    iframeId?: string;
}
/**
 * Renders markdown
 */
export declare class MarkDown extends React.PureComponent<MarkdownProps, {}> {
    render(): JSX.Element;
}
