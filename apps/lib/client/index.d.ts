/**
 * @module used by applications to add stories to the documentation
 */
import { Story, sendResizeRequest } from "../internal/story";
/** Create a story */
export declare const story: () => Story;
/** Request a frame resize */
export declare const resize: typeof sendResizeRequest;
