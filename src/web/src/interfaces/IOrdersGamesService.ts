import { OrdersGames } from "@shared/types";

export abstract class IOrdersGamesService {
    public abstract getOrdersGames(): Promise<OrdersGames[]>;
}
