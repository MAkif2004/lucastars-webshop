import { ExternalGamesService, GamesApiResponse } from "@api/services/ExternalGamesService";
import { Seeder, SeederRecord } from "./Seeder";
import { faker } from "@faker-js/faker";
import { GameRecord } from "./GameSeeder";

type GameImageRecord = {
    id?: number;
    gameId: number;
    imageUrl: string;
    sortOrder: number;
};

/**
 * Seeder for generating data for the games table.
 */
export class GameImagesSeeder extends Seeder<GameImageRecord> {
    private readonly _externalGamesService: ExternalGamesService = new ExternalGamesService();

    /**
     * @inheritdoc
     */
    protected _table: string = "game_images";

    /**
     * @inheritdoc
     */
    protected async getRecords(_count: number, _seederRecords: SeederRecord[][]): Promise<GameImageRecord[]> {
        const games: GamesApiResponse[] = await this._externalGamesService.getGames();

        const records: GameImageRecord[] = [];
        for (let i: number = 0; i < games.length; i++) {
            const game: GamesApiResponse = games[i];

            if (!game.Images) {
                continue;
            }

            for (let j: number = 0; j < game.Images.length; j++) {
                records.push({
                    gameId: i + 1,
                    imageUrl: game.Images[j],
                    sortOrder: j,
                });
            }
        }

        return records;
    }

    /**
     * @inheritdoc
     */
    protected getRecordsDev(count: number, seederRecords: SeederRecord[][]): GameImageRecord[] {
        const records: GameImageRecord[] = [];
        const gameRecords: GameRecord[] = seederRecords[0] as GameRecord[];

        for (const gameRecord of gameRecords) {
            for (let i: number = 0; i < count; i++) {
                records.push({
                    gameId: gameRecord.id!,
                    imageUrl: faker.image.url(),
                    sortOrder: i,
                });
            }
        }

        return records;
    }
}
