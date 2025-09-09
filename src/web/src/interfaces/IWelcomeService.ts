export abstract class IWelcomeService {
    public abstract getSession(): Promise<string>;
    public abstract deleteSession(): Promise<void>;
    public abstract getWelcome(): Promise<string>;
    public abstract getSecret(): Promise<string>;
}
