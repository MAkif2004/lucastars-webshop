import { ExternalGamesService, GamesApiResponse } from "@api/services/ExternalGamesService";
import { ExternalGamesPriceService } from "@api/services/ExternalGamesPriceService";
import { Seeder, SeederRecord } from "./Seeder";
import { faker } from "@faker-js/faker";

export type GameRecord = {
    id?: number;
    sku: string;
    name: string;
    thumbnail: string;
    description: string;
    price: number;
    playUrl: string;
};

/**
 * Seeder for generating data for the games table.
 */
export class GameSeeder extends Seeder<GameRecord> {
    private readonly _externalGamesService: ExternalGamesService = new ExternalGamesService();
    private readonly _externalGamesPriceService: ExternalGamesPriceService = new ExternalGamesPriceService();

    /**
     * @inheritdoc
     */
    protected _table: string = "games";

    /**
     * @inheritdoc
     */
    protected async getRecords(_count: number, _seederRecords: SeederRecord[][]): Promise<GameRecord[]> {
        const games: GamesApiResponse[] = await this._externalGamesService.getGames();

        // Fetch the price from the SPP API, hosted on Oege!
        const skus: string[] = games.map(game => game.SKU);
        const prices: Map<string, number> = await this._externalGamesPriceService.getPrices(skus);

        if (prices.size === 0) {
            console.warn("No prices found for games. Using random prices.");
        }

        const records: GameRecord[] = [];
        for (const game of games) {
            let price: number | undefined = prices.get(game.SKU);

            // Fallback to a random price if the SPP API does not return a price.
            if (price === undefined) {
                price = faker.number.float({ min: 0, max: 100, fractionDigits: 2 });
            }

            records.push({
                sku: game.SKU,
                name: game.Title,
                thumbnail: game.Thumbnail,
                description: game.DescriptionHtml,
                price: price,
                playUrl: game.Url,
            });
        }

        return records;
    }

    /**
     * @inheritdoc
     */
    protected getRecordsDev(count: number, _seederRecords: SeederRecord[][]): GameRecord[] {
        const records: GameRecord[] = [];

        for (let i: number = 0; i < count; i++) {
            records.push({
                sku: faker.string.uuid(),
                name: faker.commerce.productName(),
                thumbnail: faker.image.url(),
                description: faker.lorem.paragraph(),
                price: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
                playUrl: faker.internet.url(),
            });
        }

        return records;
    }
}
