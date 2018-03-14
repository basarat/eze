/**
 * Creates a webpack bundle
 */
export declare function bundleWebpack(args: {
    entryMap: {
        [key: string]: string;
    };
    outputDirName: string;
    watch?: () => void;
}): Promise<{}>;
/**
 * Creates a webpack bundle
 */
export declare function bundle(args: {
    entryMap: {
        [key: string]: string;
    };
    outputDirName: string;
    watch?: () => void;
}): Promise<{}>;
