import { CartItem, ICartResponse } from "@shared/types";

export class CartService {
    public async getCart(): Promise<CartItem[]> {
        const res: Response = await fetch(`${VITE_API_URL}cart`, { credentials: "include" });
        return await res.json() as unknown as CartItem[];
    }

    public async updateCart(items: CartItem[]): Promise<void> {
        await fetch(`${VITE_API_URL}cart`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(items),
        });
    }

    public async deleteCartItem(gameId: number): Promise<void> {
        await fetch(`${VITE_API_URL}cart/${gameId}`, {
            method: "DELETE",
            credentials: "include",
        });
    }

    public async createCart(data: CartItem): Promise<ICartResponse> {
        const url: string = `${VITE_API_URL}create-cart`;
        const response: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include", // Include cookies for session
        });

        if (!response.ok) {
            return {
                success: false,
            };
        }

        return {
            success: true,
        };
    }
}
