import { beforeEach, describe, expect, test, vi } from "vitest";
import { createTestApp, TestApp, TestResponse } from "./__helpers__/express.helpers";

import { app } from "@api/index";
import { SessionService } from "@api/services/SessionService";
import { WelcomeResponse } from "@shared/types";

beforeEach(() => {
    // Clear and reset all mocks
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("Routes", () => {
    test("/welcome returns default text", async () => {
        // Arrange
        const testApp: TestApp = createTestApp(app);

        // Act
        const response: TestResponse = await testApp
            .get("/welcome")
            .send();

        // Assert
        expect(response.status).toBe(200);

        const responseJson: WelcomeResponse = response.body as WelcomeResponse;
        expect(responseJson.message).toBe("Hello world!");
    });

    test("/welcome returns user specific text", async () => {
        // Arrange
        const testApp: TestApp = createTestApp(app);

        vi.spyOn(SessionService.prototype, "getUserIdBySession").mockResolvedValue(1337);

        // Act
        const response: TestResponse = await testApp
            .get("/welcome")
            .set({
                "x-session": "test-session",
            })
            .send();

        // Assert
        expect(response.status).toBe(200);

        const responseJson: WelcomeResponse = response.body as WelcomeResponse;
        expect(responseJson.message).toBe("Hello 1337!");
    });
});
