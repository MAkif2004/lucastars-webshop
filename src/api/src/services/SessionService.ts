import { ISessionService } from "@api/interfaces/ISessionService";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { v4 as uuidv4 } from "uuid";

type SessionQueryResult = {
    id: string;
    userId: number;
    created: Date;
};

export class SessionService implements ISessionService {
    private static readonly OneMinuteInMilliseconds = 60_000;
    private static readonly ExpirationTimeInMinutes = 30;

    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async createSession(userId: number): Promise<string | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const sessionId: string = uuidv4();

            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection,
                `
                INSERT INTO sessions (id, userId)
                VALUES (?, ?)
                `,
                sessionId,
                userId
            );

            return result.affectedRows > 0 ? sessionId : undefined;
        }
        catch (e: unknown) {
            throw new Error(`Failed to create session: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async getUserIdBySession(sessionId: string): Promise<number | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: SessionQueryResult[] = await this._databaseService.query<SessionQueryResult[]>(
                connection,
                `
                SELECT id, userId, created
                FROM sessions
                WHERE id = ?
                `,
                sessionId
            );

            if (result.length !== 1) {
                return undefined;
            }

            const session: SessionQueryResult = result[0];

            // Check if the session expired
            if (Date.now() - session.created.getTime() > SessionService.ExpirationTimeInMinutes * SessionService.OneMinuteInMilliseconds) {
                // It is! So invalidate the session.
                await this.deleteSession(session.id);

                return undefined;
            }

            // Otherwise, return the userId.
            return result[0].userId;
        }
        catch (e: unknown) {
            throw new Error(`Failed to get user from session: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async deleteSession(sessionId: string): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection,
                `
                DELETE FROM sessions
                WHERE id = ?
                `,
                sessionId
            );

            return result.affectedRows > 0;
        }
        catch (e: unknown) {
            throw new Error(`Failed to delete session: ${e}`);
        }
        finally {
            connection.release();
        }
    };

    public async deleteExpiredSessions(): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            await this._databaseService.query<ResultSetHeader>(
                connection,
                `
                DELETE FROM sessions
                WHERE created < ?
                `,
                new Date(Date.now() - SessionService.ExpirationTimeInMinutes * SessionService.OneMinuteInMilliseconds)
            );
        }
        catch (e: unknown) {
            throw new Error(`Failed to delete sessions: ${e}`);
        }
        finally {
            connection.release();
        }
    };
}
