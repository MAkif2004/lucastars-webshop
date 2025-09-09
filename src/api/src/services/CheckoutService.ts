import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { CheckoutItem, Game, PaymentReturnResponse } from "@shared/types";
import { ICheckoutService } from "@api/interfaces/ICheckoutService";
import { PaymentResponse } from "@shared/types";

type CartItemsResult = {
    gameId: number;
    quantity: number;
    price: number;
};

type TotalPriceResults = {
    totalPrice: number;
};

type AddressIdResult = {
    id: number;
};

export class CheckoutService implements ICheckoutService {
    private gameName: string = "";
    private readonly _databaseService: DatabaseService = new DatabaseService();

    public async getCheckout(userId: number): Promise<CheckoutItem | null> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: CheckoutItem[] = (await this._databaseService.query<CheckoutItem[]>(
                connection,
                `
                SELECT 
                    cart_items.userId,
                    addresses.street,
                    addresses.houseNumber,
                    addresses.postalCode,
                    addresses.city,
                    SUM(games.price * cart_items.quantity) as 'totalPrice'
                FROM cart_items
                JOIN games ON games.id = cart_items.gameId
                LEFT JOIN addresses ON addresses.userId = cart_items.userId
                WHERE cart_items.userId = ?
                GROUP BY cart_items.userId
                `,
                userId
            ));

            result[0].totalPrice = Number(result[0].totalPrice);

            return result[0];
        }
        catch (e: unknown) {
            throw new Error(`Failed to get checkout info: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async createPayment(orderId: number, value: number): Promise<string | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            const result: Game[] = (await this._databaseService.query<Game[]>(
                connection,
                `
                SELECT 
                    games.*
                FROM orders_games
                JOIN games ON games.id = orders_games.gameId
                WHERE orders_games.orderId = ?
                `,
                orderId
            ));
            this.gameName = result[0].name;
        }
        catch (e: unknown) {
            throw new Error(`Failed to get checkout info: ${e}`);
        }
        const res: Response = await fetch("https://psp.api.lucastars.hbo-ict.cloud/payments", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.LS_PSP_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                currency: "EUR",
                value: value,
                description: `Bestelling ${this.gameName}`,
                redirectUrl: `${process.env.WEB_URL}/payment-return?orderId=${orderId}`,
            }),
        });

        if (!res.ok) {
            throw new Error(`PSP-aanvraag mislukt: ${res.status} ${res.statusText}`);
        }
        const data: unknown = (await res.json()) as unknown;
        if (data && typeof data === "object" && "transactionId" in data) {
            // 3. Insert order
            await this._databaseService.query(connection,
                `
                INSERT INTO payments (orderId, provider, amount, vat, paymentDate, status, transactionId)
                VALUES (?, "IDEAL", ?, 0,  NOW(), 'Open', ?)
                `,
                orderId,
                value,
                data.transactionId
            );
            connection.release();
            return data.transactionId as string;
        }
        else {
            return undefined;
        }
    }

    public async postCheckout(userId: number, item: CheckoutItem): Promise<CheckoutItem | null> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        try {
            // 1. Upsert address using INSERT ... ON DUPLICATE KEY UPDATE
            // Upsert address and get its id
            await this._databaseService.query(connection,
                `
                INSERT INTO addresses (userId, street, houseNumber, postalCode, city, country)
                VALUES (?, ?, ?, ?, ?, 'Netherlands')
                ON DUPLICATE KEY UPDATE
                    street = VALUES(street),
                    houseNumber = VALUES(houseNumber),
                    postalCode = VALUES(postalCode),
                    city = VALUES(city)
                `,
                userId,
                item.street,
                item.houseNumber,
                item.postalCode,
                item.city
            );

            // Retrieve the address id (assuming userId is unique in addresses)
            const addressRow: AddressIdResult[] = await this._databaseService.query(connection,
                `
                SELECT id FROM addresses WHERE userId = ?
                `,
                userId
            );

            const addressId: number = addressRow[0].id;
            if (!addressId) {
                throw new Error("Failed to retrieve address id.");
            }

            // 2. Get total price from cart
            const cartTotalRows: TotalPriceResults[] = await this._databaseService.query(connection,
                `
                SELECT SUM(games.price * cart_items.quantity) as totalPrice
                FROM cart_items
                JOIN games ON games.id = cart_items.gameId
                WHERE cart_items.userId = ?
                `,
                userId
            );
            const totalPrice: number = Number(cartTotalRows[0]?.totalPrice || 0);

            if (totalPrice === 0) {
                throw new Error("Cart is empty or total price is zero.");
            }

            // 3. Insert order
            const orderResult: ResultSetHeader = await this._databaseService.query(connection,
                `
                INSERT INTO orders (userId, addressId, orderDate, status, totalAmount)
                VALUES (?, ?, NOW(), 'Open', ?)
                `,
                userId,
                addressId,
                totalPrice
            );
            const orderId: number = orderResult.insertId;

            // 4. Insert into orders_games using cart_items directly
            const cartItems: CartItemsResult[] = await this._databaseService.query(connection,
                `
                SELECT cart_items.gameId, cart_items.quantity, games.price
                FROM cart_items
                JOIN games ON games.id = cart_items.gameId
                WHERE cart_items.userId = ?
                `,
                userId
            );

            for (const cartItem of cartItems) {
                await this._databaseService.query(connection,
                    `
                    INSERT INTO orders_games (orderId, gameId, price)
                    VALUES (?, ?, ?)
                    `,
                    orderId,
                    cartItem.gameId,
                    cartItem.price
                );
            }

            // 5. Clear user's cart
            await this._databaseService.query(connection,
                "DELETE FROM cart_items WHERE userId = ?",
                userId
            );

            // Return the checkout info
            return {
                orderId: orderId,
                street: item.street,
                houseNumber: item.houseNumber,
                postalCode: item.postalCode,
                city: item.city,
                totalPrice,
            };
        }
        catch (e: unknown) {
            throw new Error(`Failed to get checkout info: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async handlePaymentReturn(orderId: number): Promise<PaymentReturnResponse | undefined> {
        // Get transactionId for this order from DB
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const paymentRow: PaymentResponse[] = await this._databaseService.query<PaymentResponse[]>(
                connection,
                "SELECT transactionId FROM payments WHERE orderId = ?",
                orderId
            );

            const transactionId: string = paymentRow[0]?.transactionId;
            if (!transactionId) {
                return undefined;
            }

            // Call PSP
            const pspRes: Response = await fetch(`https://psp.api.lucastars.hbo-ict.cloud/payments/${transactionId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.LS_PSP_API_KEY}`,
                },
            });

            if (!pspRes.ok) {
                const errText: string = await pspRes.text();
                console.log(errText);
                return undefined;
            }

            const data: PaymentReturnResponse = await pspRes.json() as PaymentReturnResponse;
            const status: string = data.status;
            // Update database
            await this._databaseService.query(
                connection,
                "UPDATE payments SET status = ? WHERE orderId = ?",
                status,
                orderId
            );

            if (status === "Paid") {
                await this._databaseService.query(
                    connection,
                    "UPDATE orders SET status = 'Paid' WHERE id = ?",
                    orderId
                );
            }

            return {
                status: status,
                transactionId: transactionId,
            };
        }
        catch (error) {
            console.error("Error in payment return:", error);
            return;
        }
        finally {
            connection.release();
        }
    }
}
