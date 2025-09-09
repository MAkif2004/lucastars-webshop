import { beforeEach, describe, expect, test, vi } from "vitest";

import { IWelcomeService } from "@api/interfaces/IWelcomeService";
import { WelcomeService } from "@api/services/WelcomeService";

beforeEach(() => {
    // Clear and reset all mocks
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("WelcomeService", () => {
    test("getWelcomeText returns default text", () => {
        // Arrange
        const welcomeService: IWelcomeService = new WelcomeService();

        // Act
        const welcomeText: string = welcomeService.getWelcomeText();

        // Assert
        expect(welcomeText).toBe("Hello world!");
    });

    test("getWelcomeText returns user specific text", () => {
        // Arrange
        const welcomeService: IWelcomeService = new WelcomeService();

        // Act
        const welcomeText: string = welcomeService.getWelcomeText(1337);

        // Assert
        expect(welcomeText).toBe("Hello 1337!");
    });
});
