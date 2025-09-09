@Interface
export abstract class IWelcomeService {
    public abstract getWelcomeText(userId?: number): string;
}
