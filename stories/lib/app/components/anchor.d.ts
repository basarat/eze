/// <reference types="react" />
import * as React from 'react';
export declare namespace AnchorStyles {
    const rootClassName: string;
    const anchorLookingLikeButton: string;
}
export interface AnchorProps {
    id?: string;
    href?: string;
    target?: "_blank";
    children?: React.ReactNode;
    download?: boolean;
    onClick?: React.EventHandler<React.MouseEvent<any>>;
    className?: string;
}
export declare const Anchor: (props: AnchorProps) => JSX.Element;
export declare const AnchorButton: React.SFC<{
    href: string;
}>;
