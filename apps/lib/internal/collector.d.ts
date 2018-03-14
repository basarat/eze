import { RenderConfig, Watch, PageConfig } from '../types';
import { Page } from './page';
export declare const appIndexTemplate: ({ firstPageDir }: {
    firstPageDir: string;
}) => string;
/**
 * Collects a document
 */
export declare class Collector {
    private config;
    private pages;
    private firstPageDir;
    constructor(config: RenderConfig & Watch);
    page(config: PageConfig): Page;
    _done(): Promise<void>;
}
