import { Request, Response } from "express";
import { ICartService } from "@api/interfaces/ICartService";
import { CartService } from "@api/services/CartService";
import { Cart, CartItem } from "@shared/types";

export class CartController {
    private readonly _cartService: ICartService = new CartService();

    /**
     * Cart
     */
    public async createCart(req: Request, res: Response): Promise<void> {
        const data: Cart = req.body as Cart;
        await this._cartService.createCart(
            req.userId,
            data.gameId,
            data.quantity
        );

        res.status(201).json({ success: true });
    };

    public async getCart(req: Request, res: Response): Promise<void> {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401);
            return;
        }

        const items: CartItem[] = await this._cartService.getCart(userId);
        res.json(items);
    }

    public updateCart(req: Request, res: Response): void {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401);
            return;
        }

        const items: CartItem[] = req.body as CartItem[];
        this._cartService.updateCart(userId, items);
        res.status(204).end();
    }

    public async deleteCartItem(req: Request, res: Response): Promise<void> {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401);
            return;
        }

        const gameId: number = Number(req.params.gameId);
        await this._cartService.deleteCartItem(userId, gameId);
        res.status(204).end();
    }
}
