import { Game, GamesResponse, PaginatedResponse } from "@shared/types";
import { IGameService } from "@web/interfaces/IGameService";

export class GameService implements IGameService {
    public async getGames(
        page?: number,
        limit?: number,
        sort?: "asc" | "desc",
        sortBy?: string,
        tags?: number[],
        minPrice?: number,
        maxPrice?: number
    ): Promise<PaginatedResponse<Game>> {
        let url: string = `${VITE_API_URL}games?page=${page}&limit=${limit}`;

        if (sort) {
            url += `&sort=${sort}`;
        }

        if (sortBy) {
            url += `&sortBy=${sortBy}`;
        }

        if (tags && tags.length > 0) {
            url += `&tags=${tags.join(",")}`;
        }

        if (minPrice) {
            url += `&minPrice=${minPrice}`;
        }

        if (maxPrice) {
            url += `&maxPrice=${maxPrice}`;
        }

        const response: Response = await fetch(url);

        const gamesResponse: PaginatedResponse<Game> = await response.json() as unknown as PaginatedResponse<Game>;

        return gamesResponse;
    }

    public async getGameById(id: number): Promise<Game[]> {
        const url: string = `${VITE_API_URL}game-info?id=${encodeURIComponent(id)}`;
        const response: Response = await fetch(url);

        const gamesResponse: GamesResponse = await response.json() as unknown as GamesResponse;

        return gamesResponse.games;
    }

    public async getFiveRandomGames(): Promise<Game[]> {
        const url: string = `${VITE_API_URL}five-random-games`;
        const response: Response = await fetch(url);

        const gamesResponse: GamesResponse = await response.json() as unknown as GamesResponse;

        return gamesResponse.games;
    }

    public async getOwnedGames(id?: number): Promise<Game[]> {
        try {
            const response: Response = await fetch(`${VITE_API_URL}owned-games?id=${id}`, {
                credentials: "include",
            });

            const gamesResponse: GamesResponse = await response.json() as unknown as GamesResponse;

            return gamesResponse.games;
        }
        catch (error) {
            console.error("Error fetching owned games:", error);
            return [];
        }
    }

    public async searchGames(query: string): Promise<Game[]> {
        const url: string = `${VITE_API_URL}games/search?q=${encodeURIComponent(query)}`;
        const response: Response = await fetch(url);

        const gamesResponse: GamesResponse = await response.json() as unknown as GamesResponse;

        return gamesResponse.games;
    }
}
