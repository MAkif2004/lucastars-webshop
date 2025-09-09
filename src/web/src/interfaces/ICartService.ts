import { CartItem, ICartResponse } from "@shared/types";

export abstract class ICartService {
    public abstract createCart(data: CartItem): Promise<ICartResponse>;
}
