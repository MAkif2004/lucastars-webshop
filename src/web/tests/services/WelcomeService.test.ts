import { beforeEach, describe, expect, test, vi } from "vitest";

import { SessionResponse, WelcomeResponse } from "@shared/types";
import { WelcomeService } from "@web/services/WelcomeService";

beforeEach(() => {
    // Clear and reset all mocks
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("WelcomeService", () => {
    test("getSession should return sessionId", async () => {
        // Arrange
        const welcomeService: WelcomeService = new WelcomeService();

        fetchMock.mockResponse(request => {
            if (request.url.endsWith("/session")) {
                return {
                    status: 200,
                    body: JSON.stringify(<SessionResponse>{
                        sessionId: "test-123",
                    }),
                };
            }

            throw new Error();
        });

        // Act
        const sessionId: string = await welcomeService.getSession();

        // Assert
        expect(sessionId).toBe("test-123");
    });

    test("getWelcome should return text", async () => {
        // Arrange
        const welcomeService: WelcomeService = new WelcomeService();

        fetchMock.mockResponse(request => {
            if (request.url.endsWith("/welcome")) {
                return {
                    status: 200,
                    body: JSON.stringify(<WelcomeResponse>{
                        message: "test-123",
                    }),
                };
            }

            throw new Error();
        });

        // Act
        const welcomeText: string = await welcomeService.getWelcome();

        // Assert
        expect(welcomeText).toBe("test-123");
    });
});
