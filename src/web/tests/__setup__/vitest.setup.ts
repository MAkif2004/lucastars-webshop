import "@hboictcloud/metadata";
import { vi } from "vitest";
import createFetchMock, { FetchMock } from "vitest-fetch-mock";

// Set environment variables
// @ts-expect-error global.d.ts doesn't seem to work
global.VITE_API_URL = "/";

// NOTE: Create a mock for fetch
const fetchMocker: FetchMock = createFetchMock(vi);
fetchMocker.enableMocks();

// NOTE: Disable mocking fetch by default
fetchMocker.dontMock();

// NOTE: Monkey patch attachShadow to always be open
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalAttachShadow: (init: ShadowRootInit) => ShadowRoot = Element.prototype.attachShadow;

Element.prototype.attachShadow = function (init) {
    return originalAttachShadow.call(this, { ...init, mode: "open" });
};
