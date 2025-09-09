import { SecretResponse, SessionResponse, WelcomeResponse } from "@shared/types";
import { IWelcomeService } from "@web/interfaces/IWelcomeService";

/**
 * This controller demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class WelcomeService implements IWelcomeService {
    public async getSession(): Promise<string> {
        const response: Response = await fetch(`${VITE_API_URL}session`, {
            credentials: "include",
        });

        const sessionResponse: SessionResponse = await response.json() as unknown as SessionResponse;

        return sessionResponse.sessionId;
    }

    public async deleteSession(): Promise<void> {
        await fetch(`${VITE_API_URL}session`, {
            method: "DELETE",
            credentials: "include",
        });
    }

    public async getWelcome(): Promise<string> {
        const response: Response = await fetch(`${VITE_API_URL}welcome`, {
            credentials: "include",
        });

        const welcomeResponse: WelcomeResponse = await response.json() as unknown as WelcomeResponse;

        return welcomeResponse.message;
    }

    public async getSecret(): Promise<string> {
        const response: Response = await fetch(`${VITE_API_URL}secret`, {
            credentials: "include",
        });

        const secretResponse: SecretResponse = await response.json() as unknown as SecretResponse;

        return `Je bent user ID ${secretResponse.userId} met sessie ID ${secretResponse.sessionId}!`;
    }
}
