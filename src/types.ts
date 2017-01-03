export type ContentItem =
  /** e.g. markdown */
  | { type: "html", html: string }
  /** app */
  | { type: "app", htmlFileName: string }

export interface Data {
  contents: ContentItem[];
}

export interface Config {
  outputDir: string,
  title?: string
}