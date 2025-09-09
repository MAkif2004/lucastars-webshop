import { beforeEach, describe, expect, test, vi } from "vitest";
import { createMockDatabaseService, MockDatabaseService } from "../__helpers__/databaseService.helpers";
import { UserService } from "@api/services/UserService";
import { IUser } from "@shared/types";

// Mock bcrypt-ts
vi.mock("bcrypt-ts", () => ({
    compare: vi.fn(),
    hash: vi.fn(),
}));

beforeEach(() => {
    // Clear and reset all mocks
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("UserService", () => {
    test("getUserByUsername should return a User", async () => {
    // Arrange
        const userService: UserService = new UserService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([{
            id: 1,
            username: "Zoiye",
            email: "Zoiyevanleeuwen@icloud.com",
            firstName: "Zoiye",
            prefix: "van",
            lastName: "Leeuwen",
            street: "Ganzendiep",
            houseNumber: "4",
            postalCode: "1423DA",
            city: "Uithoorn",
            country: "Nederland",
            created: Date.now(),
            updated: Date.now(),
        }]);

        // Act
        const user: IUser | undefined = await userService.getUserByUsername("Zoiye");

        // Assert
        expect(user).toBeDefined();
        expect(user?.id).toBe(1);
        expect(user?.username).toBe("Zoiye");
    });

    test("getUserByUsername should return undefined if no User is to be found", async () => {
    // Arrange
        const userService: UserService = new UserService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([]);

        // Act
        const user: IUser | undefined = await userService.getUserByUsername("Zoiye");

        // Assert
        expect(user).toBeUndefined();
    });

    test("getUserByEmail should return a User", async () => {
    // Arrange
        const userService: UserService = new UserService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([{
            id: 1,
            username: "Zoiye",
            email: "Zoiyevanleeuwen@icloud.com",
            firstName: "Zoiye",
            prefix: "van",
            lastName: "Leeuwen",
            street: "Ganzendiep",
            houseNumber: "4",
            postalCode: "1423DA",
            city: "Uithoorn",
            country: "Nederland",
            created: Date.now(),
            updated: Date.now(),
        }]);

        // Act
        const user: IUser | undefined = await userService.getUserByEmail("Zoiyevanleeuwen@icloud.com");

        // Assert
        expect(user).toBeDefined();
        expect(user?.id).toBe(1);
        expect(user?.email).toBe("Zoiyevanleeuwen@icloud.com");
    });

    test("getUserByEmail should return undefined if no User is found", async () => {
    // Arrange
        const userService: UserService = new UserService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([]);

        // Act
        const user: IUser | undefined = await userService.getUserByEmail("nonexistent@example.com");

        // Assert
        expect(user).toBeUndefined();
    });

    test("getUserById should return a User", async () => {
    // Arrange
        const userService: UserService = new UserService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([{
            id: 1,
            username: "Zoiye",
            email: "Zoiyevanleeuwen@icloud.com",
            firstName: "Zoiye",
            prefix: "van",
            lastName: "Leeuwen",
            street: "Ganzendiep",
            houseNumber: "4",
            postalCode: "1423DA",
            city: "Uithoorn",
            country: "Nederland",
            created: Date.now(),
            updated: Date.now(),
        }]);

        // Act
        const user: IUser | undefined = await userService.getUserById(1);

        // Assert
        expect(user).toBeDefined();
        expect(user?.id).toBe(1);
    });

    test("getUserById should return undefined if no User is found", async () => {
    // Arrange
        const userService: UserService = new UserService();
        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockResolvedValue([]);

        // Act
        const user: IUser | undefined = await userService.getUserById(999);

        // Assert
        expect(user).toBeUndefined();
    });
});
