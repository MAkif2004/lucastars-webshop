import { beforeEach, describe, expect, test, vi } from "vitest";

import { IGameService } from "@api/interfaces/IGameService";
import { GameService } from "@api/services/GameService";
import { Game, GetGamesOptions, PaginatedResponse } from "@shared/types";
import { createMockDatabaseService, MockDatabaseService } from "../__helpers__/databaseService.helpers";

beforeEach(() => {
    // Clear and reset all mocks
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("GameService", () => {
    test("getGames should return properly structured game objects", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query
            .mockResolvedValueOnce([{
                id: 1,
                sku: "game-sku-1",
                name: "Game 1",
                thumbnail: "https://example.com/thumbnail1.jpg",
                description: "Description 1",
                images: [
                    "https://example.com/image1.jpg",
                ],
            }])
            .mockResolvedValueOnce([{ totalCount: 1 }]);

        // Act
        const options: GetGamesOptions = {
            page: 1,
            limit: 10,
        };
        const paginatedGames: PaginatedResponse<Game> = await gameService.getGames(options);

        // Assert
        expect(paginatedGames.items[0]).toHaveProperty("id");
        expect(paginatedGames.items[0]).toHaveProperty("name");
        expect(paginatedGames.items[0]).toHaveProperty("thumbnail");
        expect(paginatedGames.items[0]).toHaveProperty("description");
        expect(paginatedGames.items[0]).toHaveProperty("images");
        expect(Array.isArray(paginatedGames.items[0].images)).toBe(true);
        expect(paginatedGames.items[0].images.length).toBe(1);

        expect(paginatedGames.pagination.totalItems).toBe(1);
        expect(paginatedGames.pagination.totalPages).toBe(1);
        expect(paginatedGames.pagination.currentPage).toBe(options.page);
        expect(paginatedGames.pagination.itemsPerPage).toBe(options.limit);
    });

    test("getGames should return a list of paginated games", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query
            .mockResolvedValueOnce([
                {
                    id: 1,
                    sku: "game-sku-1",
                    name: "Game 1",
                    thumbnail: "https://example.com/thumbnail1.jpg",
                    description: "Description 1",
                    images: [
                        "https://example.com/image1.jpg",
                        "https://example.com/image2.jpg",
                    ],
                },
                {
                    id: 2,
                    sku: "game-sku-2",
                    name: "Game 2",
                    thumbnail: "https://example.com/thumbnail2.jpg",
                    description: "Description 2",
                    images: [
                        "https://example.com/image3.jpg",
                    ],
                },
            ])
            .mockResolvedValueOnce([{ totalCount: 2 }]);

        // Act
        const options: GetGamesOptions = {
            page: 1,
            limit: 10,
        };
        const paginatedGames: PaginatedResponse<Game> = await gameService.getGames(options);

        // Assert
        expect(paginatedGames.items).toBeInstanceOf(Array);
        expect(paginatedGames.items.length).toBe(2);

        expect(paginatedGames.pagination.totalItems).toBe(2);
        expect(paginatedGames.pagination.totalPages).toBe(1);
        expect(paginatedGames.pagination.currentPage).toBe(options.page);
        expect(paginatedGames.pagination.itemsPerPage).toBe(options.limit);
    });

    test("getGames should return an empty array if no games are found", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([{ totalCount: 0 }]);

        // Act
        const options: GetGamesOptions = {
            page: 1,
            limit: 10,
        };
        const paginatedGames: PaginatedResponse<Game> = await gameService.getGames(options);

        // Assert
        expect(paginatedGames.items).toBeInstanceOf(Array);
        expect(paginatedGames.items.length).toBe(0);

        expect(paginatedGames.pagination.totalItems).toBe(0);
        expect(paginatedGames.pagination.totalPages).toBe(0);
        expect(paginatedGames.pagination.currentPage).toBe(options.page);
        expect(paginatedGames.pagination.itemsPerPage).toBe(options.limit);
    });

    test("getGames should handle database errors gracefully", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockRejectedValueOnce(new Error("Database connection failed"));

        // Act & Assert
        const options: GetGamesOptions = {
            page: 1,
            limit: 10,
        };
        await expect(gameService.getGames(options)).rejects.toThrow();
    });

    test("getOwnedGames should return a list of games owned by a user", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([
            {
                id: 1,
                sku: "game-sku-1",
                name: "Game 1",
                thumbnail: "https://example.com/thumbnail1.jpg",
                description: "Description 1",
                price: 19.99,
                url: "https://example.com/play/game1",
            },
            {
                id: 2,
                sku: "game-sku-2",
                name: "Game 2",
                thumbnail: "https://example.com/thumbnail2.jpg",
                description: "Description 2",
                price: 29.99,
                url: "https://example.com/play/game2",
            },
        ]);

        // Act
        const games: Game[] = await gameService.getOwnedGames(1);

        // Assert
        expect(games).toBeInstanceOf(Array);
        expect(games.length).toBe(2);
        expect(mockDatabaseService.query).toHaveBeenCalledWith(
            expect.anything(),
            expect.stringContaining("WHERE o.userId = ?"),
            1
        );
    });

    test("getOwnedGames should return empty array when user doesn't own any games", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([]);

        // Act
        const games: Game[] = await gameService.getOwnedGames(1337);

        // Assert
        expect(games).toBeInstanceOf(Array);
        expect(games.length).toBe(0);
    });

    test("getOwnedGames should return properly structured game objects", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([
            {
                id: 1,
                sku: "game-sku-1",
                name: "Game 1",
                thumbnail: "https://example.com/thumbnail1.jpg",
                description: "Description 1",
                price: 19.99,
                url: "https://example.com/play/game1",
            },
        ]);

        // Act
        const games: Game[] = await gameService.getOwnedGames(1);

        // Assert
        expect(games[0]).toHaveProperty("id");
        expect(games[0]).toHaveProperty("name");
        expect(games[0]).toHaveProperty("thumbnail");
        expect(games[0]).toHaveProperty("description");
        expect(games[0]).toHaveProperty("price");
        expect(games[0]).toHaveProperty("url");
    });

    test("getOwnedGames should handle invalid user ID gracefully", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([]);

        // Act
        const games: Game[] = await gameService.getOwnedGames(1337);

        // Assert
        expect(games).toBeInstanceOf(Array);
        expect(games.length).toBe(0);
    });

    test("getOwnedGames should handle database errors gracefully", async () => {
        // Arrange
        const gameService: IGameService = new GameService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockRejectedValueOnce(new Error("Database connection failed"));

        // Act & Assert
        await expect(gameService.getOwnedGames(1)).rejects.toThrow();
    });
});
