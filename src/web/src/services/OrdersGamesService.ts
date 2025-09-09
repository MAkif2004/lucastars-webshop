import { OrdersGames, OrdersGamesResponse } from "@shared/types";
import { IOrdersGamesService } from "@web/interfaces/IOrdersGamesService";

export class OrdersGamesService implements IOrdersGamesService {
    public async getOrdersGames(): Promise<OrdersGames[]> {
        const response: Response = await fetch(`${VITE_API_URL}orders-games`);

        const ordersGamesResponse: OrdersGamesResponse = await response.json() as unknown as OrdersGamesResponse;

        return ordersGamesResponse.ordersGames;
    }
}
