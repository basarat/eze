export interface FilePathPosition {
    filePath: string;
    line: number;
    ch: number;
}
export interface Listener<T> {
    (event: T): any;
}
export interface Disposable {
    dispose(): any;
}
/** passes through events as they happen. You will not get events from before you start listening */
export declare class TypedEvent<T> {
    private listeners;
    private listenersOncer;
    on: (listener: Listener<T>) => Disposable;
    once: (listener: Listener<T>) => void;
    off: (listener: Listener<T>) => void;
    emit: (event: T) => void;
    pipe: (te: TypedEvent<T>) => Disposable;
}
export declare function debounce<T extends Function>(func: T, milliseconds: number, immediate?: boolean): T;
/**
 * Converts the following raw stack string to a FilePathPosition array:
Error: Fail
  at Context.<anonymous> (D:\REPOS\alm\src\tests\testedTest.ts:21:15)
  at callFn (D:\REPOS\alm\node_modules\mocha\lib\runnable.js:334:21)
  at Test.Runnable.run (D:\REPOS\alm\node_modules\mocha\lib\runnable.js:327:7)
  at Runner.runTest (D:\REPOS\alm\node_modules\mocha\lib\runner.js:429:10)
  at D:\REPOS\alm\node_modules\mocha\lib\runner.js:535:12
  at next (D:\REPOS\alm\node_modules\mocha\lib\runner.js:349:14)
  at D:\REPOS\alm\node_modules\mocha\lib\runner.js:359:7
  at next (D:\REPOS\alm\node_modules\mocha\lib\runner.js:285:14)
  at Immediate._onImmediate (D:\REPOS\alm\node_modules\mocha\lib\runner.js:327:5)
*/
export declare const makeStack: (raw: string) => FilePathPosition[];
