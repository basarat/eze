export declare type SupportedMode = 'ts' | 'js' | 'tsx' | 'jsx' | 'javascript' | 'typescript' | 'html' | 'css';
export declare type HTMLContent = {
    type: 'html';
    html: string;
};
export declare type CodeContent = {
    type: 'code';
    html: string;
    collapsed: boolean;
};
export declare type AppContent = {
    type: 'app';
    index: number;
    htmlFileName: string;
    sources: {
        mode: SupportedMode;
        code: string;
    }[];
    sourceUrl?: string;
    height?: string;
};
export declare type StoryContent = {
    type: 'story';
    index: number;
    htmlFileName: string;
    code: string;
    /** Each demo call has its code collected here */
    demoCodes: string[];
};
export declare type ContentItem = HTMLContent | AppContent | StoryContent | CodeContent;
export declare type TableOfContentEntry = {
    text: string;
    id: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    subItems: TableOfContentEntry[];
    /** If the heading is in an iframe */
    iframeId: string;
};
export interface Data {
    contents: ContentItem[];
    tableOfContents: TableOfContentEntry[];
}
export declare type Heading = {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    text: string;
    id: string;
};
export declare const iframeIdBeginsWith = "iframe";
export declare function makeIframeId(index: number): string;
/**
 * Iframe messages
 * http://stackoverflow.com/a/19503982/390330
 */
/** Parent to child messages */
export declare type IframeP2CGetScrollMore = {
    type: 'IframeP2CGetScrollMore';
    id: string;
};
export declare type IframeP2CMessage = IframeP2CGetScrollMore;
/** Child to parent messages */
export declare type IframeC2PScrollMore = {
    type: 'IframeC2PScrollMore';
    more: number;
};
export declare type IframeC2PSetHash = {
    type: 'IframeC2PSetHash';
    hash: string;
};
export declare type IframeC2PRenderComplete = {
    type: 'IframeC2PRenderComplete';
    iframeId: string;
};
export declare type IframeC2PMessage = IframeC2PScrollMore | IframeC2PSetHash | IframeC2PRenderComplete;
/**
 * Watch mode configuration
 */
export declare type Watch = {
    watch?: () => void;
};
/**
 * Config for render
 */
export declare type RenderConfig = {
    /** Relative or absolute path to the folder where the documentation will be generated */
    outputDir: string;
    /** Page title */
    title?: string;
    repoUrl?: string;
};
/**
 * Config for page
 */
export declare type PageConfig = {
    /** Used in TOC */
    heading: string;
    /** Just the name of a sub folder e.g. 'foo' */
    subDirName: string;
};
/**
 * Page talking to Collector
 */
export declare type PageTalkingToCollector = {};
