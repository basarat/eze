import { RenderConfig } from './types';
import { Collector } from './internal/collector';
export declare function render(config: RenderConfig, cb: (eze: Collector) => void): Promise<void>;
