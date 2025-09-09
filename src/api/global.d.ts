declare global {
    namespace Express {
        export interface Request {
            sessionId?: string;
            userId?: number;
        }
    }

    /**
     * Allow a function to be awaited, even if its not explicitly asynchronous.
     *
     * @template T Return type of the function
     */
    type SyncOrAsync<T> = T | Promise<T>;
}

export { };
