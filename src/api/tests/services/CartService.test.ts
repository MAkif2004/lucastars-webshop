import { beforeEach, describe, expect, test, vi } from "vitest";
import { CartService } from "@api/services/CartService";
import { Cart, CartItem } from "@shared/types";
import { createMockDatabaseService, MockDatabaseService } from "../__helpers__/databaseService.helpers";

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("CartService", () => {
    test("getCart returns array of cart items", async () => {
        const cartService: CartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        const mockCartItems: CartItem[] = [
            { userId: 1, gameId: 2, name: "Game 2", thumbnail: "thumb.jpg", price: 10, quantity: 1, description: "" },
        ];
        mockDatabaseService.query.mockResolvedValue(mockCartItems);

        const result: CartItem[] = await cartService.getCart(1);

        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toHaveProperty("userId");
        expect(result[0]).toHaveProperty("gameId");
    });

    test("getCart returns empty array if no items", async () => {
        const cartService: CartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([]);

        const result: CartItem[] = await cartService.getCart(99);

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    test("getCart throws error on db error", async () => {
        const cartService: CartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockRejectedValue(new Error("DB error"));

        await expect(cartService.getCart(1)).rejects.toThrow();
    });

    test("createCart inserts item and returns undefined", async () => {
        const cartService: CartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([]);

        const result: Cart[] | undefined = await cartService.createCart(1, 2, 3);

        expect(result).toBeUndefined();
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
            expect.anything(),
            expect.stringContaining("INSERT INTO cart_items"),
            1, 2, 3
        );
    });

    test("createCart throws error on db error", async () => {
        const cartService: CartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockRejectedValue(new Error("DB error"));

        await expect(cartService.createCart(1, 2, 3)).rejects.toThrow();
    });

    test("updateCart deletes and inserts items", async () => {
        const cartService: CartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue(undefined);
        const items: CartItem[] = [
            { userId: 1, gameId: 2, name: "Game 2", thumbnail: "thumb.jpg", price: 10, quantity: 1, description: "" },
        ];

        await cartService.updateCart(1, items);

        expect(mockDatabaseService.query).toHaveBeenCalledWith(
            expect.anything(),
            expect.stringContaining("DELETE FROM cart_items"),
            1
        );
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
            expect.anything(),
            expect.stringContaining("INSERT INTO cart_items"),
            1, 2, 1
        );
    });

    test("updateCart rolls back on error", async () => {
        const cartService: CartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockImplementationOnce(() => Promise.resolve(undefined));
        mockDatabaseService.query.mockImplementationOnce(() => {
            throw new Error("fail");
        });

        await expect(cartService.updateCart(1, [
            { userId: 1, gameId: 2, name: "Game 2", thumbnail: "thumb.jpg", price: 10, quantity: 1, description: "" },
        ])).rejects.toThrow();
    });

    test("deleteCartItem deletes item", async () => {
        const cartService: CartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue(undefined);

        await cartService.deleteCartItem(1, 2);

        expect(mockDatabaseService.query).toHaveBeenCalledWith(
            expect.anything(),
            expect.stringContaining("DELETE FROM cart_items WHERE userId = ? AND gameId = ?"),
            1, 2
        );
    });

    test("deleteCartItem throws error on db error", async () => {
        const cartService: CartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockRejectedValue(new Error("fail"));

        await expect(cartService.deleteCartItem(1, 2)).rejects.toThrow();
    });

    test("clearCart deletes all items for user", async () => {
        const cartService: CartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue(undefined);

        await cartService.clearCart(1);

        expect(mockDatabaseService.query).toHaveBeenCalledWith(
            expect.anything(),
            expect.stringContaining("DELETE FROM cart_items WHERE userId = ?"),
            1
        );
    });

    test("clearCart throws error on db error", async () => {
        const cartService: CartService = new CartService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockRejectedValue(new Error("fail"));

        await expect(cartService.clearCart(1)).rejects.toThrow();
    });
});
