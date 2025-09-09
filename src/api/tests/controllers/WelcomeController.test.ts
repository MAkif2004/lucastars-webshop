import { beforeEach, describe, expect, test, vi } from "vitest";
import {
    createMockRequest,
    createMockResponse,
    MockRequest,
    MockResponse
} from "../__helpers__/express.helpers";

import { WelcomeController } from "@api/controllers/WelcomeController";
import { WelcomeResponse } from "@shared/types";

beforeEach(() => {
    // Clear and reset all mocks
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("WelcomeController", () => {
    test("getWelcome returns default text", () => {
        // Arrange
        const welcomeController: WelcomeController = new WelcomeController();

        const request: MockRequest = createMockRequest();
        const response: MockResponse = createMockResponse();

        // Act
        welcomeController.getWelcome(request, response);

        // Assert
        expect(response.statusCode).toBe(200);

        const responseJson: WelcomeResponse = response._getJSONData() as WelcomeResponse;
        expect(responseJson.message).toBe("Hello world!");
    });

    test("getWelcome returns user specific text", () => {
        // Arrange
        const welcomeController: WelcomeController = new WelcomeController();

        const request: MockRequest = createMockRequest({
            userId: 1337,
        });

        const response: MockResponse = createMockResponse();

        // Act
        welcomeController.getWelcome(request, response);

        // Assert
        expect(response.statusCode).toBe(200);

        const responseJson: WelcomeResponse = response._getJSONData() as WelcomeResponse;
        expect(responseJson.message).toBe("Hello 1337!");
    });
});
