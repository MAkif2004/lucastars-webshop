@Interface
export abstract class ISessionService {
    public abstract createSession(userId: number): Promise<string | undefined>;
    public abstract getUserIdBySession(sessionId: string): Promise<number | undefined>;
    public abstract deleteSession(sessionId: string): Promise<boolean>;
    public abstract deleteExpiredSessions(): Promise<void>;
}
