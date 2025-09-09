import { ExternalGamesService, GamesApiResponse } from "@api/services/ExternalGamesService";
import { Seeder, SeederRecord } from "./Seeder";

export type TagRecord = {
    id?: number;
    value: string;
};

/**
 * Seeder for generating data for the games table.
 */
export class TagSeeder extends Seeder<TagRecord> {
    private readonly _externalGamesService: ExternalGamesService = new ExternalGamesService();

    /**
     * @inheritdoc
     */
    protected _table: string = "tags";

    /**
     * @inheritdoc
     */
    protected async getRecords(_count: number, _seederRecords: SeederRecord[][]): Promise<TagRecord[]> {
        const games: GamesApiResponse[] = await this._externalGamesService.getGames();

        // Get all tags from the games
        const tags: Set<string> = new Set<string>();
        for (const game of games) {
            for (const tag of game.Tags) {
                tags.add(tag);
            }
        }

        // Convert the set to an array of TagRecord
        const records: TagRecord[] = [];
        for (const tag of tags) {
            records.push({
                value: tag,
            });
        }

        return records;
    }
}
