/// <reference types="react" />
import * as types from '../../types';
import { TypedEvent } from "../../internal/utils";
export declare const iframeRenderComplete: TypedEvent<{
    iframeId: string;
}>;
export declare const Toc: ({ toc, pageSubDirName }: {
    toc: types.TableOfContentEntry[];
    pageSubDirName: string;
}) => JSX.Element;
