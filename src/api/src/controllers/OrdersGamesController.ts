import { IOrdersGamesService } from "@api/interfaces/IOrdersGamesService";
import { OrdersGamesService } from "@api/services/OrdersGamesService";
import { OrdersGames } from "@shared/types";
import { Request, Response } from "express";

/**
 * This controller is responsible for handling requests related to games.
 */
export class OrdersGamesController {
    private readonly _ordersGamesService: IOrdersGamesService = new OrdersGamesService();

    /**
     * Handles the request to get all games.
     *
     * @remarks This will later be paginated and will handle filtering and/or sorting.
     */
    public async getOrdersGames(_req: Request, res: Response): Promise<void> {
        const ordersGames: OrdersGames[] = await this._ordersGamesService.getOrdersGames();

        res.json({
            ordersGames: ordersGames,
        });
    }
}
