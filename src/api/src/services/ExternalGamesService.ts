export type GamesApiResponse = {
    SKU: string;
    Title: string;
    Thumbnail: string;
    Images: string[] | null;
    DescriptionHtml: string;
    Url: string;
    Authors: string[];
    Tags: string[];
    Reviews: string[] | null;
};

let games: GamesApiResponse[] | null = null;

/**
 * This class fetches game data from the LucasStars API.
 *
 * @remarks This should only be used in seeders and not in the application itself!
 *          The data is cached after the first fetch to avoid unnecessary network requests.
 */
export class ExternalGamesService {
    /**
     * Fetches a list of games provided by LucasStars
     */
    public async getGames(): Promise<GamesApiResponse[]> {
        // If we didn't fetch yet we fetch the data and cache it
        if (!games) {
            games = await this.fetchGames();
        }

        return games;
    }

    /**
     * Fetches the game data from the LucasStars API.
     */
    private async fetchGames(): Promise<GamesApiResponse[]> {
        const response: Response = await fetch("https://lucastars.hbo-ict.cloud/api/games/json");
        const data: GamesApiResponse[] = await response.json() as GamesApiResponse[];

        return data;
    }
}
