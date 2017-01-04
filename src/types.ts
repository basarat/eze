export type HTMLContent = { type: "html", html: string }
export type AppContent = { type: "app", htmlFileName: string }

export type ContentItem =
  /** e.g. markdown */
  | HTMLContent
  /** app */
  | AppContent

export interface Data {
  contents: ContentItem[];
}

export interface Config {
  outputDir: string,
  title?: string
}