import { ITagService } from "@api/interfaces/ITagService";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { Tag } from "@shared/types";

/**
 * Service to retrieve games from the database.
 */
export class TagService implements ITagService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async getTags(): Promise<Tag[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: Tag[] = await this._databaseService.query<Tag[]>(
                connection,
                `
                SELECT
                    t.id,
                    t.value
                FROM tags t
                ORDER BY t.value
                `
            );

            return result;
        }
        catch (error) {
            throw new Error(`Failed to get tags from the database: ${error}`);
        }
        finally {
            connection.release();
        }
    }
}
