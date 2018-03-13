/// <reference types="react" />
import * as React from "react";
/**
 * Defaults used in layout
 */
export declare let defaultValues: {
    spacing: number;
    breakpoints: {
        phone: number;
    };
};
export declare function setDefaults(defaults: typeof defaultValues): void;
declare global  {
    interface Function {
        displayName?: string;
    }
}
/********
 *
 * Primitives
 *
 ********/
/**
* For that time you just need a visual vertical seperation
*/
export declare const SmallVerticalSpace: (props: {
    space?: number;
}) => JSX.Element;
/**
 * For that time you just need a visual horizontal seperation
 */
export declare const SmallHorizontalSpace: (props: {
    space?: number;
}) => JSX.Element;
export interface PrimitiveProps extends React.HTMLProps<HTMLDivElement> {
}
/**
 * Generally prefer an inline block (as that will wrap).
 * Use this for critical `content` driven *vertical* height
 *
 * Takes as much space as it needs, no more, no less
 */
export declare const Content: (props: PrimitiveProps) => JSX.Element;
/**
 * Takes as much space as it needs, no more, no less
 */
export declare const InlineBlock: (props: PrimitiveProps) => JSX.Element;
/**
 * Takes up all the parent space, no more, no less
 */
export declare const Flex: (props: PrimitiveProps) => JSX.Element;
/**
 * Takes up all the parent space, no more, no less and scrolls the children in Y if needed
 */
export declare const FlexScrollY: (props: PrimitiveProps) => JSX.Element;
/**
 * When you need a general purpose container. Use this instead of a `div`
 */
export declare const Pass: (props: PrimitiveProps) => JSX.Element;
/**
 * Provides a Vertical Container. For the parent it behaves like content.
 */
export declare const ContentVertical: (props: PrimitiveProps) => JSX.Element;
/**
 * Quite commonly need horizontally centered text
 */
export declare const ContentVerticalCentered: (props: PrimitiveProps) => JSX.Element;
/**
 * Quite commonly need horizontally centered text
 */
export declare const FlexVerticalCentered: (props: PrimitiveProps) => JSX.Element;
/**
 * Provides a Horizontal Container. For the parent it behaves like content.
 */
export declare const ContentHorizontal: (props: PrimitiveProps) => JSX.Element;
/**
 * Provides a Horizontal Container and centers its children in the cross dimension
 */
export declare const ContentHorizontalCentered: (props: PrimitiveProps) => JSX.Element;
/**
 * Provides a Vertical Container. For the parent it behaves like flex.
 */
export declare const FlexVertical: (props: PrimitiveProps) => JSX.Element;
/**
 * Provides a Horizontal Container. For the parent it behaves like flex.
 */
export declare const FlexHorizontal: (props: PrimitiveProps) => JSX.Element;
/**
 * Provides a Horizontal Container and centers its children in the cross dimension
 */
export declare const FlexHorizontalCentered: (props: PrimitiveProps) => JSX.Element;
/********
 *
 * Grid System
 *
 ********/
export interface MarginedProps extends PrimitiveProps {
    margin?: number;
}
/**
 * Lays out the children horizontally with
 * - ThisComponent: gets the overall Height (by max) of the children
 * - Children: get the Width : equally distributed from the parent Width
 * - Children: get the Height : sized by content
 * - ThisComponent: Puts a horizontal margin between each item
 */
export declare const ContentHorizontalMargined: (props: MarginedProps & {
    horizontalAlign?: "left" | "right";
}) => JSX.Element;
export declare const ContentHorizontalMarginedCentered: (props: MarginedProps) => JSX.Element;
/**
 * Lays out the children horizontally with
 * - Parent: gets to chose the Width
 * - ThisComponent: gets the overall Height (by max) of the children
 * - Children: get the Width : equally distributed from the parent Width
 * - Children: get the Height : sized by content
 * - ThisComponent: Puts a horizontal margin between each item
 */
export declare const FlexHorizontalMargined: (props: MarginedProps) => JSX.Element;
export declare const FlexVerticalMargined: (props: MarginedProps) => JSX.Element;
/**
 * Could be ContentVerticalMargined but also wraps each child in Content to auto fix IE vertical layout issues
 */
export declare const ContentVerticalContentMargined: (props: MarginedProps) => JSX.Element;
/**
 * Lays out the children vertically with
 * - Parent: gets to chose the overall Width
 * - ThisComponent: gets the Height : (by sum) of the children
 * - Children: get the Width : sized by content
 * - Children: get the Height : sized by content
 * - ThisComponent: Puts a margin between each item.
 * - ThisComponent: Puts a negative margin on itself to offset the margins of the children (prevents them from leaking out)
 */
export declare const GridMargined: (props: MarginedProps) => JSX.Element;
export interface ResponsiveGridParentProps extends PrimitiveProps {
    margin?: number;
    breakpoint?: number;
    /** Alignment in horizontal mode */
    horizontalAlign?: 'top' | 'center';
}
export declare const ResponsiveGridParent: (props: ResponsiveGridParentProps) => JSX.Element;
/**
 * Just a display:block with vertical spacing between each child
 */
export declare const VerticalMargined: (props: MarginedProps) => JSX.Element;
