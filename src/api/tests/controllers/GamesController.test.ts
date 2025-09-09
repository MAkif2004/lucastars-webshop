import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import {
    createMockRequest,
    createMockResponse,
    MockRequest,
    MockResponse
} from "../__helpers__/express.helpers";

import { GamesController } from "@api/controllers/GamesController";
import { Game, GamesResponse, PaginatedResponse } from "@shared/types";
import { GameService } from "@api/services/GameService";

vi.mock("@api/services/GameService", () => {
    return {
        GameService: vi.fn().mockImplementation(() => ({
            getGames: vi.fn(),
            getOwnedGames: vi.fn(),
            getGameById: vi.fn(),
        })),
    };
});

beforeEach(() => {
    // Clear and reset all mocks
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("GamesController", () => {
    describe("getGames", () => {
        test("should return paginated games with status 200", async () => {
            // Arrange
            const mockedGames: PaginatedResponse<Game> = {
                items: [
                    {
                        id: "1",
                        sku: "game-sku-1",
                        name: "Game 1",
                        thumbnail: "https://example.com/thumbnail1.jpg",
                        description: "Description 1",
                        price: 19.99,
                        images: ["https://example.com/image1.jpg"],
                        tags: [],
                    },
                    {
                        id: "2",
                        sku: "game-sku-2",
                        name: "Game 2",
                        thumbnail: "https://example.com/thumbnail2.jpg",
                        description: "Description 2",
                        price: 29.99,
                        images: ["https://example.com/image2.jpg"],
                        tags: [],
                    },
                ],
                pagination: {
                    totalItems: 2,
                    totalPages: 1,
                    currentPage: 1,
                    itemsPerPage: 10,
                },
            };

            (GameService as unknown as Mock).mockImplementation(() => ({
                getGames: vi.fn().mockResolvedValue(mockedGames),
            }));

            const gamesController: GamesController = new GamesController();

            const request: MockRequest = createMockRequest();
            const response: MockResponse = createMockResponse();

            // Act
            await gamesController.getGames(request, response);

            // Assert
            expect(response.statusCode).toBe(200);

            const responseJson: PaginatedResponse<Game> = response._getJSONData() as PaginatedResponse<Game>;
            console.log(responseJson);

            expect(responseJson).toHaveProperty("items");
            expect(Array.isArray(responseJson.items)).toBe(true);
            expect(responseJson.items.length).toBe(mockedGames.items.length);
            expect(responseJson.pagination.totalItems).toBe(mockedGames.pagination.totalItems);
        });
    });

    describe("getOwnedGames", () => {
        test("should return 401 if userId is not present", async () => {
            // Arrange
            const gamesController: GamesController = new GamesController();

            const request: MockRequest = createMockRequest();
            const response: MockResponse = createMockResponse();

            // Act
            await gamesController.getOwnedGames(request, response);

            // Assert
            expect(response.statusCode).toBe(401);
        });

        test("should return owned games with status 200 when userId is present", async () => {
            // Arrange
            const mockedGames: Game[] = [
                {
                    id: "1",
                    sku: "game-sku-1",
                    name: "Game 1",
                    thumbnail: "https://example.com/thumbnail1.jpg",
                    description: "Description 1",
                    price: 19.99,
                    images: ["https://example.com/image1.jpg"],
                    tags: [],
                },
            ];

            (GameService as unknown as Mock).mockImplementation(() => ({
                getOwnedGames: vi.fn().mockResolvedValue(mockedGames),
            }));

            const gamesController: GamesController = new GamesController();

            const userId: number = 10;
            const request: MockRequest = createMockRequest({ userId });
            const response: MockResponse = createMockResponse();

            // Act
            await gamesController.getOwnedGames(request, response);

            // Assert
            expect(response.statusCode).toBe(200);

            const responseJson: GamesResponse = response._getJSONData() as GamesResponse;
            expect(responseJson).toHaveProperty("games");
            expect(Array.isArray(responseJson.games)).toBe(true);
            expect(responseJson.games.length).toBe(mockedGames.length);
        });
    });

    describe("getGameById", () => {
        test("should return a game with status 200 when gameId is present", async () => {
            // Arrange
            const mockedGames: Game[] = [
                {
                    id: "16",
                    sku: "game-sku-1",
                    name: "Game 1",
                    thumbnail: "https://example.com/thumbnail1.jpg",
                    description: "Description 1",
                    price: 19.99,
                    images: ["https://example.com/image1.jpg"],
                    tags: ["GOTY", "Runner-up"],
                },
            ];

            (GameService as unknown as Mock).mockImplementation(() => ({
                getGameById: vi.fn().mockResolvedValue([mockedGames[0]]),
            }));

            const gamesController: GamesController = new GamesController();

            const request: MockRequest = createMockRequest({ query: { id: "1" } });
            const response: MockResponse = createMockResponse();

            // Act
            await gamesController.getGameById(request, response);

            // Assert
            expect(response.statusCode).toBe(200);

            const responseJson: GamesResponse = response._getJSONData() as GamesResponse;
            expect(responseJson).toHaveProperty("games");
            expect(Array.isArray(responseJson.games)).toBe(true);
            expect(responseJson.games.length).toBe(mockedGames.length);
        });
    });
});
