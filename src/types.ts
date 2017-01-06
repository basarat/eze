export type SupportedMode = 'ts' | 'js' | 'tsx' | 'jsx' | 'javascript' | 'typescript' | 'html' | 'css';

export type HTMLContent = { type: 'html', html: string }
export type AppContent = {
  type: 'app',
  htmlFileName: string,
  sources: { mode: SupportedMode, code: string }[],

  sourceUrl?: string,
  height?: string,
}
export type StoryContent = {
  type: 'story',
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
  | StoryContent;

export type TableOfContentEntry = {
  text: string, 
  id: string,
  level: 1 | 2 | 3 | 4 | 5 | 6,
  subItems: TableOfContentEntry[],

  /** If the heading is in an iframe */
  iframeId: string,
}

export interface Data {
  contents: ContentItem[];
  tableOfContents: TableOfContentEntry[]
}

export interface RenderConfig {
  outputDir: string,
  title?: string,
  repoUrl?: string,
}

export type Heading = { level: 1 | 2 | 3 | 4 | 5 | 6, text: string, id: string };

export function makeIframeId(index: number) { 
  return 'iframe' + index;
}