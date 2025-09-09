import { OrdersGames } from "@shared/types";

@Interface
export abstract class IOrdersGamesService {
    public abstract getOrdersGames(): Promise<OrdersGames[]>;
}
