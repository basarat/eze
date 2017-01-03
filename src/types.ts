export type ContentItem = { type: "html", html: string }
export interface Data {
  contents: ContentItem[];
}

export interface Config {
  outputDir: string,
  title?: string
}