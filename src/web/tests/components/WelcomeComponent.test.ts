import userEvent, { UserEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { deepQuerySelector, deepQuerySelectorAll } from "../__helpers__/web.helpers";

import { WelcomeComponent } from "@web/components/WelcomeComponent";
import { WebshopEvent } from "@web/enums/WebshopEvent";
import { WebshopEventService } from "@web/services/WebshopEventService";
import { WelcomeService } from "@web/services/WelcomeService";

beforeEach(() => {
    // Clear and reset all mocks
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("WelcomeComponent", () => {
    test("should render 4 buttons", () => {
        // Arrange
        const component: WelcomeComponent = new WelcomeComponent();
        document.body.append(component);

        const result1: HTMLElement[] = deepQuerySelectorAll(document, "button");

        // Act / Assert
        expect(result1.length).toEqual(4);
    });

    test("public text button should change result and trigger event", async () => {
        // Arrange
        const component: WelcomeComponent = new WelcomeComponent();
        document.body.append(component);

        const result1: HTMLElement = deepQuerySelector(document, "#public-text-button")!;
        const result2: HTMLElement = deepQuerySelector(document, "#result")!;

        vi
            .spyOn(WelcomeService.prototype, "getWelcome")
            .mockResolvedValue("test-123");

        vi.spyOn(WebshopEventService.prototype, "dispatchEvent");

        // Act
        const user: UserEvent = userEvent.setup();
        await user.click(result1);

        // Assert
        expect(result2.innerHTML.trim()).toContain("test-123");
        expect(WebshopEventService.prototype["dispatchEvent"])
            .toBeCalledWith(WebshopEvent.Welcome, "test-123");
    });

    test("create session button should change result", async () => {
        // Arrange
        const component: WelcomeComponent = new WelcomeComponent();
        document.body.append(component);

        const result1: HTMLElement = deepQuerySelector(document, "#create-session-button")!;
        const result2: HTMLElement = deepQuerySelector(document, "#result")!;

        vi
            .spyOn(WelcomeService.prototype, "getSession")
            .mockResolvedValue("test-123");

        // Act
        const user: UserEvent = userEvent.setup();
        await user.click(result1);

        // Assert
        expect(result2.innerHTML.trim()).toContain("test-123");
    });
});
