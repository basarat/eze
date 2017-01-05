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