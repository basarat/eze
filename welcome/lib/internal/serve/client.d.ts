/// <reference types="ws" />
/// <reference types="node" />
import { Server as WebSocketServer } from 'ws';
import * as WebSocket from 'ws';
import * as http from 'http';
export declare const clientJsPath: string;
export declare class Livereload {
    /** Register this as a connect middleware */
    middleware: (req: any, res: any, next: any) => void;
    /**
     * Websocket management
     */
    wss?: WebSocketServer;
    wsArray: WebSocket[];
    /**
     * Starts a websocket server
     */
    startWS: (server: http.Server) => void;
    triggerReload: () => void;
    triggerReloadCss: () => void;
}
