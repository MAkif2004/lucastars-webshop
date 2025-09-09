import { Game, PaginatedResponse } from "@shared/types";

export abstract class IGameService {
    public abstract getGames(
        page?: number,
        limit?: number,
        sort?: "asc" | "desc",
        sortBy?: "name" | "price" | "created",
        tags?: number[],
        minPrice?: number,
        maxPrice?: number
    ): Promise<PaginatedResponse<Game>>;
    public abstract getGameById(id: number): Promise<Game[]>;
    public abstract getOwnedGames(): Promise<Game[]>;
    public abstract searchGames(query: string): Promise<Game[]>;
    public abstract getFiveRandomGames(): Promise<Game[]>;
}
