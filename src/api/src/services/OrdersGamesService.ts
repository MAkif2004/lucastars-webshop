import { PoolConnection } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { OrdersGames } from "@shared/types";
import { IOrdersGamesService } from "@api/interfaces/IOrdersGamesService";

/**
 * Service to retrieve games from the database.
 */
export class OrdersGamesService implements IOrdersGamesService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async getOrdersGames(): Promise<OrdersGames[]> {
        return this.executeOrdersGamesQuery();
    }

    /**
     * Execute the games query.
     */
    private async executeOrdersGamesQuery(): Promise<OrdersGames[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const query: string = `
            SELECT 
                g.id as 'gameId',
                g.name,
                g.thumbnail,
                g.price
            FROM games g
            LEFT JOIN orders_games og ON og.gameId = g.id
            GROUP BY g.id
            ORDER BY COUNT(og.gameId) DESC, g.name
            LIMIT 10
        `;

            const result: OrdersGames[] = await this._databaseService.query<OrdersGames[]>(connection, query);
            return result;
        }
        finally {
            connection.release();
        }
    }
}
