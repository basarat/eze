export interface FilePathPosition {
  filePath: string;
  line: number;
  ch: number;
}

export interface Listener<T> {
  (event: T): any;
}

export interface Disposable {
  dispose();
}

/** passes through events as they happen. You will not get events from before you start listening */
export class TypedEvent<T> {
  private listeners: Listener<T>[] = [];
  private listenersOncer: Listener<T>[] = [];

  on = (listener: Listener<T>): Disposable => {
    this.listeners.push(listener);
    return {
      dispose: () => this.off(listener)
    };
  }

  once = (listener: Listener<T>): void => {
    this.listenersOncer.push(listener);
  }

  off = (listener: Listener<T>) => {
    var callbackIndex = this.listeners.indexOf(listener);
    if (callbackIndex > -1) this.listeners.splice(callbackIndex, 1);
  }

  emit = (event: T) => {
    /** Update any general listeners */
    this.listeners.forEach((listener) => listener(event));

    /** Clear the `once` queue */
    this.listenersOncer.forEach((listener) => listener(event));
    this.listenersOncer = [];
  }

  pipe = (te: TypedEvent<T>): Disposable => {
    return this.on((e) => te.emit(e));
  }
}

/**
 * Debounce
 */
var now = () => new Date().getTime();
export function debounce<T extends Function>(func: T, milliseconds: number, immediate = false): T {
  var timeout, args, context, timestamp, result;

  var wait = milliseconds;

  var later = function() {
    var last = now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return <any>function() {
    context = this;
    args = arguments;
    timestamp = now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

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
export const makeStack = (raw: string): FilePathPosition[] => {
  let lines = raw.split(/\r\n?|\n/);
  /** First line is just the error message. Don't need it */
  lines = lines.slice(1);

  /** Remove each leading `at ` */
  lines = lines.map(l => l.trim().substr(3));

  /** For lines that have function name, they end with `)`. So detect and remove leading `(` for them */
  lines = lines.map(l => {
    if (l.endsWith(')')) {
      const withStartRemoved = l.substr(l.indexOf('(') + 1);
      const withEndRemoved = withStartRemoved.substr(0, withStartRemoved.length - 1);
      return withEndRemoved;
    }
    else {
      return l;
    }
  });

  const stack = lines.map(l => {
    let parts = l.split(':');

    const chStr = parts[parts.length - 1];
    const lineStr = parts[parts.length - 2];
    /** NOTE: file path on windows will contain `:` in the beginning as well. Hence the join */
    const filePath = parts.slice(0, parts.length - 2).join(':');

    /**
     * The chrome ones are 1 based. We want 0 based
     */
    const line = parseInt(lineStr) - 1;
    const ch = parseInt(chStr) - 1;

    return { filePath, line, ch };
  })

  return stack;
}
