export type SupportedMode = 'ts' | 'js' | 'tsx' | 'jsx' | 'javascript' | 'typescript' | 'html' | 'css';

export type HTMLContent = { type: 'html', html: string }
export type AppContent = {
  type: 'app',
  htmlFileName: string,
  sources: { mode: SupportedMode, code: string }[],

  sourceUrl?: string,
  height?: string,
}

export type ContentItem =
  /** e.g. markdown */
  | HTMLContent
  /** app */
  | AppContent

export type TableOfContentEntry = {
  title: string, 
  subItems: TableOfContentEntry[]
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