import { IWelcomeService } from "@api/interfaces/IWelcomeService";

/**
 * This class demonstrates to use of an interface for a Service.
 *
 * @remarks This class should be removed in the final product!
 */
export class WelcomeService implements IWelcomeService {
    public getWelcomeText(userId?: number): string {
        return `Hello ${userId ? userId : "world"}!`;
    }
}
