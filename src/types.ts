export type SupportedMode = 'ts' | 'js' | 'tsx' | 'jsx' | 'javascript' | 'typescript' | 'html' | 'css';

export type HTMLContent = {
  type: 'html',
  pageSubDirName: string,
  
  html: string,
}
export type CodeContent = {
  type: 'code',
  pageSubDirName: string,

  html: string,
  collapsed: boolean,
}
export type AppContent = {
  type: 'app',
  pageSubDirName: string,
  
  index: number,
  htmlFileName: string,
  sources: { mode: SupportedMode, code: string }[],

  sourceUrl?: string,
  height?: string,
}
export type StoryContent = {
  type: 'story',
  pageSubDirName: string,
  
  index: number,
  htmlFileName: string,
  code: string,

  /** Each demo call has its code collected here */
  demoCodes: string[];
}

export type ContentItem =
  /** e.g. markdown */
  | HTMLContent
  /** app */
  | AppContent
  /** story */
  | StoryContent
  /** special code content */
  | CodeContent

export type TableOfContentEntry = {
  pageSubDirName: string,
  text: string,
  id: string,
  level: 1 | 2 | 3 | 4 | 5 | 6,
  subItems: TableOfContentEntry[],

  /** If the heading is in an iframe */
  iframeId: string,
}

export interface Data {
  /** The data used to render the table on contents */
  tableOfContents: TableOfContentEntry[]

  /** The data used to render the stories */
  contents: ContentItem[];
}

export type Heading = { level: 1 | 2 | 3 | 4 | 5 | 6, text: string, id: string };

export const iframeIdBeginsWith = 'iframe';
export function makeIframeId(index: number) {
  return iframeIdBeginsWith + index;
}

/**
 * Iframe messages
 * http://stackoverflow.com/a/19503982/390330
 */
/** Parent to child messages */
export type IframeP2CGetScrollMore = {
  type: 'IframeP2CGetScrollMore',
  id: string,
}
export type IframeP2CMessage =
  | IframeP2CGetScrollMore

/** Child to parent messages */
export type IframeC2PScrollMore = {
  type: 'IframeC2PScrollMore',
  more: number
}
export type IframeC2PSetHash = {
  type: 'IframeC2PSetHash',
  hash: string,
}
export type IframeC2PRenderComplete = {
  type: 'IframeC2PRenderComplete',
  iframeId: string,
}
export type IframeC2PMessage =
  | IframeC2PScrollMore
  | IframeC2PSetHash
  | IframeC2PRenderComplete

/**
 * Watch mode configuration
 */
export type Watch = {
  watch?: () => void
}


/** 
 * Config for render
 */
export type RenderConfig = {
  /** Relative or absolute path to the folder where the documentation will be generated */
  outputDir: string,
  /** Page title */
  title?: string,
  repoUrl?: string,
}


/** 
 * Config for page 
 */
export type PageConfig = {
  /** Used in TOC */
  heading: string,
  /** Just the name of a sub folder e.g. 'foo' */
  subDirName: string,
}

/** 
 * Page talking to Collector
 */
export type PageTalkingToCollector = {
  
}
