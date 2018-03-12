import * as chokidar from 'chokidar';
import { debounce } from '../utils';

const watchers: { [pattern: string]: chokidar.FSWatcher } = Object.create(null);
function getWatcher(pattern: string): chokidar.FSWatcher {
  if (!watchers[pattern]) {
    watchers[pattern] = chokidar.watch(pattern, { ignoreInitial: true });
  }
  return watchers[pattern];
}

export class WatchManager {
  private disposers: { (): void }[] = [];

  addWatcher = (pattern: string, cb: () => void) => {
    const watcher = getWatcher(pattern);
    const debounced = debounce(() => cb(), 100);

    // Just for changes
    watcher.on('change', debounced);

    this.disposers.push(() => {
      watcher.removeListener('change', debounced);
    })
  }

  dispose = () => {
    this.disposers.forEach(d => d());
  }
}
