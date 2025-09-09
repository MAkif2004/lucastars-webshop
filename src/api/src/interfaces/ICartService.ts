import { Cart, CartItem } from "@shared/types";

@Interface
export abstract class ICartService {
    public abstract createCart(userId: number | undefined, gameId: number, quantity: number): Promise<Cart[] | undefined>;
    public abstract getCart(userId: number): Promise<CartItem[]>;
    public abstract updateCart(userId: number, items: CartItem[]): void;
    public abstract deleteCartItem(userId: number, gameId: number): Promise<void>;
}
