import { beforeEach, describe, expect, test, vi } from "vitest";
import { createMockDatabaseService, MockDatabaseService } from "../__helpers__/databaseService.helpers";

import { ISessionService } from "@api/interfaces/ISessionService";
import { SessionService } from "@api/services/SessionService";

beforeEach(() => {
    // Clear and reset all mocks
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("SessionService", () => {
    test("getUserBySessionId returns user", async () => {
        // Arrange
        const sessionService: ISessionService = new SessionService();

        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query
            .mockResolvedValue([
                {
                    userId: 1337,
                    created: new Date(),
                },
            ]);

        // Act
        const userId: number | undefined = await sessionService.getUserIdBySession("test-session");

        // Assert
        expect(mockDatabaseService.query).toBeCalledWith(expect.anything(), expect.anything(), "test-session");
        expect(userId).toBe(1337);
    });

    test("getUserBySessionId should release connection on exception", async () => {
        // Arrange
        const sessionService: ISessionService = new SessionService();

        const mockDatabaseService: MockDatabaseService = createMockDatabaseService();
        mockDatabaseService.query.mockImplementation(() => {
            throw new Error();
        });

        // Act
        let throwError: boolean = false;

        try {
            await sessionService.getUserIdBySession("test-session");
        }
        catch {
            throwError = true;
        }

        // Assert
        expect(throwError, "getUserIdBySession should throw exception").toBe(true);
        expect(mockDatabaseService.poolConnection["release"]).toBeCalled();
    });
});
