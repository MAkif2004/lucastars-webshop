import { ExternalGamesService, GamesApiResponse } from "@api/services/ExternalGamesService";
import { Seeder, SeederRecord } from "./Seeder";
import { GameRecord } from "./GameSeeder";
import { TagRecord } from "./TagsSeeder";

type GameTagRecord = {
    id?: number;
    gameId: number;
    tagId: number;
};

/**
 * Seeder for generating data for the games table.
 */
export class GameTagsSeeder extends Seeder<GameTagRecord> {
    private readonly _externalGamesService: ExternalGamesService = new ExternalGamesService();

    /**
     * @inheritdoc
     */
    protected _table: string = "games_tags";

    /**
     * @inheritdoc
     */
    protected async getRecords(_count: number, seederRecords: SeederRecord[][]): Promise<GameTagRecord[]> {
        const games: GamesApiResponse[] = await this._externalGamesService.getGames();

        const gameRecords: GameRecord[] = seederRecords[0] as GameRecord[];
        const tagRecords: TagRecord[] = seederRecords[1] as TagRecord[];

        // Create a map of game IDs to tag IDs
        const gameTagMap: Map<number, number[]> = new Map<number, number[]>();
        for (const game of games) {
            const gameRecord: GameRecord | undefined = gameRecords.find(record => record.sku === game.SKU);
            if (!gameRecord) {
                continue;
            }

            const tagIds: number[] = [];
            for (const tag of game.Tags) {
                const tagRecord: TagRecord | undefined = tagRecords.find(record => record.value === tag);
                if (tagRecord) {
                    tagIds.push(tagRecord.id!);
                }
            }

            gameTagMap.set(gameRecord.id!, tagIds);
        }

        const records: GameTagRecord[] = [];
        for (const [gameId, tagIds] of gameTagMap.entries()) {
            for (const tagId of tagIds) {
                records.push({
                    gameId: gameId,
                    tagId: tagId,
                });
            }
        }

        return records;
    }
}
