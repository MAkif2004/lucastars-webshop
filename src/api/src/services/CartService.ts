import { ICartService } from "@api/interfaces/ICartService";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { Cart, CartItem } from "@shared/types";

export class CartService implements ICartService {
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async createCart(
        userId: number | undefined,
        gameId: number,
        quantity: number
    ): Promise<Cart[] | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        if (!userId) {
            throw new Error("User ID is required to create a cart item.");
        }
        const cartItems: CartItem[] = await this.getCart(userId);

        for (let i: number = 0; i < cartItems.length; i++) {
            if (cartItems[i].gameId === gameId) {
                // If the item already exists, don't add it again
                return undefined;
            }
        }

        try {
            // const hashedPassword: string = password;
            await this._databaseService.query<Cart>(
                connection,
                `
                INSERT INTO cart_items (userId, gameId, quantity)
                VALUES (?, ?, ?)
                `,
                userId,
                gameId,
                quantity
            );
            return undefined;
        }
        catch (e: unknown) {
            throw new Error(`Failed to create user: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async getCart(userId: number): Promise<CartItem[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            // eslint-disable-next-line @typescript-eslint/typedef
            const result = await this._databaseService.query<CartItem[]>(
                connection,
                `
                SELECT 
                    ci.userId,
                    ci.gameId,
                    g.name,
                    g.thumbnail,
                    g.price,
                    ci.quantity
                FROM cart_items ci
                JOIN games g ON ci.gameId = g.id
                WHERE ci.userId = ?

                `,
                userId
            );

            return result;
        }
        catch (e: unknown) {
            throw new Error(`Failed to get cart: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async updateCart(userId: number, items: CartItem[]): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            await connection.beginTransaction();

            // Eerst alles verwijderen voor deze gebruiker
            await this._databaseService.query<ResultSetHeader>(
                connection,
                "DELETE FROM cart_items WHERE userId = ?",
                userId
            );

            // Voeg nieuwe items toe
            for (const item of items) {
                await this._databaseService.query<ResultSetHeader>(
                    connection,
                    `
                    INSERT INTO cart_items (userId, gameId, quantity)
                    VALUES (?, ?, ?)

                    `,

                    item.userId,
                    item.gameId,
                    item.quantity
                );
            }

            await connection.commit();
        }
        catch (e: unknown) {
            await connection.rollback();
            throw new Error(`Failed to update cart: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async clearCart(userId: number): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            await this._databaseService.query<ResultSetHeader>(
                connection,
                "DELETE FROM cart_items WHERE userId = ?",
                userId
            );
        }
        catch (e: unknown) {
            throw new Error(`Failed to clear cart: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async deleteCartItem(userId: number, gameId: number): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            await this._databaseService.query<ResultSetHeader>(
                connection,
                "DELETE FROM cart_items WHERE userId = ? AND gameId = ?",
                userId,
                gameId
            );
        }
        catch (e: unknown) {
            console.log(gameId, userId);
            throw new Error(`Failed to delete cart item: ${e}`);
        }
        finally {
            connection.release();
        }
    }
}
