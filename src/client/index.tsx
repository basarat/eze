/**
 * @module used by applications to add stories to the documentation
 */
import { Story, sendResizeRequest } from "../internal/story";

/** Create a story */
export const story = () => new Story();

/** Request a frame resize */
export const resize = sendResizeRequest;