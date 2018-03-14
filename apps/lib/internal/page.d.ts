import { RenderConfig, Data, SupportedMode, PageConfig, Watch, PageTalkingToCollector } from '../types';
export declare const storyAndAppIndexTemplate: ({ index, jsFileName }: {
    index: number;
    jsFileName: string;
}) => string;
/**
 * Collects a document
 */
export declare class Page {
    private config;
    constructor(config: RenderConfig & PageConfig & Watch & PageTalkingToCollector);
    /**
     * We collect the rendered contents here
     */
    _data: Data;
    /** We collect all bundle things in here */
    _bundleCollector: {
        [jsFileNameNoExt: string]: string;
    };
    html(html: string): void;
    githubStars({user, repo}: {
        user: string;
        repo: string;
    }): void;
    md(markdown: string): this;
    private ammendTocWithHeadings;
    code({mode, code, collapsed}: {
        mode: SupportedMode;
        code: string;
        collapsed?: boolean;
    }): this;
    /** Each demo and story gets its index. This drives the JS / HTML files names */
    private entryPointIndex;
    /**
     * If only is set on only `story | demo` only that `story | demo` gets rendered
     **/
    private onlyJsFileNameNoExt;
    story({entryPointPath, only}: {
        entryPointPath: string;
        only?: boolean;
    }): this;
    /** Adds a raw application demo */
    app({entryPointPath, sourceUrl, height, only}: {
        entryPointPath: string;
        sourceUrl?: string;
        /**
         * Use this as the height for the demo embedding
         * If not specified we default to the iframe content scroll height
         **/
        height?: string;
        only?: boolean;
    }): this;
    /** The end */
    _done(): Promise<void>;
}
