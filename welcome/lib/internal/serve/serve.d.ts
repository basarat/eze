export declare class Server {
    private app;
    private client;
    private server;
    serve(dir: string): Promise<void>;
    triggerReload: () => void;
    triggerReloadCss: () => void;
}
