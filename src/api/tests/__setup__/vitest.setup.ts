import "@hboictcloud/metadata";
import { vi } from "vitest";
import createFetchMock, { FetchMock } from "vitest-fetch-mock";

const fetchMocker: FetchMock = createFetchMock(vi);
fetchMocker.enableMocks();

// NOTE: Disable mocking fetch by default
fetchMocker.dontMock();
