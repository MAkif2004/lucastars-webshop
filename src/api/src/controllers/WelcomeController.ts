import { ISessionService } from "@api/interfaces/ISessionService";
import { IWelcomeService } from "@api/interfaces/IWelcomeService";
import { SessionService } from "@api/services/SessionService";
import { WelcomeService } from "@api/services/WelcomeService";
import { Request, Response } from "express";

/**
 * This controller demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class WelcomeController {
    private readonly _welcomeService: IWelcomeService = new WelcomeService();
    private readonly _sessionService: ISessionService = new SessionService();

    public async getSession(_req: Request, res: Response): Promise<void> {
        // Generate a fake userId for demo purposes
        const sessionId: string | undefined = await this._sessionService.createSession(
            parseInt((Math.random() * 1000).toFixed(0))
        );

        res
            .cookie("session", sessionId)
            .json({
                sessionId: sessionId,
            });
    }

    public async deleteSession(req: Request, res: Response): Promise<void> {
        const result: boolean | undefined = await this._sessionService.deleteSession(
            req.sessionId!
        );

        if (!result) {
            res.status(400).end();

            return;
        }

        res.status(204).end();
    }

    public async deleteExpiredSessions(_req: Request, res: Response): Promise<void> {
        await this._sessionService.deleteExpiredSessions();

        res.status(204).end();
    }

    public getWelcome(req: Request, res: Response): void {
        const result: string = this._welcomeService.getWelcomeText(req.userId);

        res.json({
            message: result,
        });
    }

    public getSecret(req: Request, res: Response): void {
        res.json({
            sessionId: req.sessionId,
            userId: req.userId,
        });
    }
}
