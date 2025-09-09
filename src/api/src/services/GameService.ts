import { IGameService } from "@api/interfaces/IGameService";
import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { Game, GetGamesOptions, PaginatedResponse } from "@shared/types";

/**
 * Service to retrieve games from the database.
 */
export class GameService implements IGameService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    private getGameBaseQuery(): string {
        return `
            SELECT 
                g.id,
                g.sku,
                g.name,
                g.thumbnail,
                g.description,
                g.price,
                COALESCE(
                    (SELECT JSON_ARRAYAGG(gi.imageUrl)
                     FROM game_images gi
                     WHERE gi.gameId = g.id),
                    JSON_ARRAY()
                ) AS images,
                COALESCE(
                    (SELECT JSON_ARRAYAGG(t.value)
                     FROM games_tags gt
                     JOIN tags t ON gt.tagId = t.id
                     WHERE gt.gameId = g.id),
                    JSON_ARRAY()
                ) AS tags
            FROM games g
        `;
    }

    /**
     * Retrieves a paginated list of games.
     */
    public async getGames(options: GetGamesOptions): Promise<PaginatedResponse<Game>> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        const offset: number = (options.page - 1) * options.limit;

        const sortByQuery: string = options.sortBy
            ? `ORDER BY g.${options.sortBy} ${options.sort === "desc" ? "DESC" : "ASC"}`
            : `ORDER BY g.name ${options.sort === "desc" ? "DESC" : "ASC"}`;

        let whereClause: string = "";
        const whereClauseValues: number[] = [];
        let tagJoin: string = "";

        if (options.tags && options.tags.length > 0) {
            tagJoin = "JOIN games_tags gt ON g.id = gt.gameId";
            whereClause += whereClause ? " AND " : "WHERE ";
            whereClause += `gt.tagId IN (${options.tags.map(() => "?").join(",")})`;
            whereClauseValues.push(...options.tags);
        }

        if (options.minPrice) {
            whereClause += whereClause ? " AND " : "WHERE ";
            whereClause += "g.price >= ?";
            whereClauseValues.push(options.minPrice);
        }

        if (options.maxPrice) {
            whereClause += whereClause ? " AND " : "WHERE ";
            whereClause += "g.price <= ?";
            whereClauseValues.push(options.maxPrice);
        }

        try {
            const query: string = `
                ${this.getGameBaseQuery()}
                ${tagJoin}
                ${whereClause}
                GROUP BY g.id
                ${sortByQuery}
                LIMIT ?
                OFFSET ?
            `;

            const games: Game[] = await this._databaseService.query<Game[]>(
                connection,
                query,
                ...whereClauseValues,
                options.limit,
                offset
            );

            const countQuery: string = `
                SELECT COUNT(DISTINCT g.id) AS totalCount
                FROM games g
                ${tagJoin}
                ${whereClause}
            `;

            const countResult: { totalCount: number }[] = await this._databaseService.query<{ totalCount: number }[]>(
                connection,
                countQuery,
                ...whereClauseValues
            );

            const paginatedResponse: PaginatedResponse<Game> = {
                items: games,
                pagination: {
                    totalItems: countResult[0].totalCount,
                    totalPages: Math.ceil(countResult[0].totalCount / options.limit),
                    currentPage: options.page,
                    itemsPerPage: options.limit,
                },
            };

            return paginatedResponse;
        }
        finally {
            connection.release();
        }
    }

    public async getGameById(id: number): Promise<Game[]> {
        return this.executeGameByIdQuery(id);
    }

    public async getFiveRandomGames(): Promise<Game[]> {
        return this.executeFiveRandomGamesQuery();
    }

    /**
     * Retrieves all games owned by a specific user.
     */
    public async getOwnedGames(userId: number, gameId?: number): Promise<Game[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const gameIdCondition: string = gameId ? "AND g.id = ?" : "";

            const query: string = `
                ${this.getGameBaseQuery()}
                JOIN orders_games og ON g.id = og.gameId
                JOIN orders o ON og.orderId = o.id
                WHERE o.userId = ? AND o.status = "paid" ${gameIdCondition}
                GROUP BY g.id
            `;

            const params: unknown[] = [userId];

            if (gameId) {
                params.push(gameId);
            }

            const ownedGames: Game[] = await this._databaseService.query<Game[]>(connection, query, ...params);

            return ownedGames;
        }
        finally {
            connection.release();
        }
    }

    /**
     * Searches for games based on a query string.
     */
    public async searchGames(query: string): Promise<Game[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const sqlQuery: string = `
                ${this.getGameBaseQuery()}
                WHERE g.name LIKE ?
                GROUP BY g.id
                ORDER BY g.name
            `;

            const games: Game[] = await this._databaseService.query<Game[]>(connection, sqlQuery, `%${query}%`);

            return games;
        }
        finally {
            connection.release();
        }
    }

    private async executeGameByIdQuery(id: number): Promise<Game[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const query: string = `
            SELECT 
                name,
                thumbnail,
                description,
                price
            FROM GAMES
            WHERE
                id = "${id}"
        `;

            return await this._databaseService.query<Game[]>(connection, query);
        }
        finally {
            connection.release();
        }
    }

    private async executeFiveRandomGamesQuery(): Promise<Game[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const query: string = `
                ${this.getGameBaseQuery()}
                JOIN games_tags gt ON g.id = gt.gameId
                WHERE gt.tagId IN (3, 5)
                GROUP BY g.id
                ORDER BY RAND()
                LIMIT 5;
        `;

            return await this._databaseService.query<Game[]>(connection, query);
        }
        finally {
            connection.release();
        }
    }
}
