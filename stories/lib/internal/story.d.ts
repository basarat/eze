/// <reference types="react" />
/**
 * @module client side story rendering library
 */
import * as React from 'react';
export declare type StoryEntry = {
    type: 'demo';
    demo: JSX.Element;
    code: string;
};
export declare class Story {
    constructor();
    private stories;
    private demoIndex;
    demo(demo: JSX.Element | React.ComponentClass<any>): this;
    /** Client side rendering of a story */
    render(): void;
}
export declare function sendResizeRequest(): void;
